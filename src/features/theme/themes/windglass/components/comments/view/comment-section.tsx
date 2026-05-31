import { useInfiniteQuery } from "@tanstack/react-query";
import { getRouteApi, Link } from "@tanstack/react-router";
import type { JSONContent } from "@tiptap/react";
import { Loader2, LogIn, MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Turnstile, useTurnstile } from "@/components/common/turnstile";
import { useComments } from "@/features/comments/hooks/use-comments";
import { rootCommentsByPostIdInfiniteQuery } from "@/features/comments/queries";
import { authClient } from "@/lib/auth/auth.client";
import { m } from "@/paraglide/messages";
import { WindGlassCommentEditor } from "../editor/comment-editor";
import { WindGlassCommentList } from "./comment-list";
import WindGlassConfirmationModal from "./confirmation-modal";

const routeApi = getRouteApi("/_public/post/$slug");

interface WindGlassCommentSectionProps {
  postId: number;
}

export function WindGlassCommentSection({ postId }: WindGlassCommentSectionProps) {
  const { data: session } = authClient.useSession();
  const { rootId, highlightCommentId } = routeApi.useSearch();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      rootCommentsByPostIdInfiniteQuery(postId, session?.user.id),
    );

  const rootComments = data?.pages.flatMap((page) => page.items) ?? [];
  const totalCount = data?.pages[0]?.total ?? 0;
  const { createComment, deleteComment, isCreating, isDeleting } =
    useComments(postId);

  const [replyTarget, setReplyTarget] = useState<{
    rootId: number;
    commentId: number;
    userName: string;
  } | null>(null);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const {
    isPending: turnstilePending,
    reset: resetTurnstile,
    turnstileProps,
  } = useTurnstile("comment");

  const requireTurnstile = () => {
    if (!turnstilePending) return false;
    toast.error(m.comments_turnstile_required());
    turnstileRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    throw new Error("TURNSTILE_PENDING");
  };

  const handleCreateComment = async (content: JSONContent) => {
    requireTurnstile();
    try {
      await createComment({
        data: {
          postId,
          content,
        },
      });
    } finally {
      resetTurnstile();
    }
  };

  const handleCreateReply = async (content: JSONContent) => {
    if (!replyTarget) return;
    requireTurnstile();
    try {
      await createComment({
        data: {
          postId,
          content,
          rootId: replyTarget.rootId,
          replyToCommentId: replyTarget.commentId,
        },
      });
      setReplyTarget(null);
    } finally {
      resetTurnstile();
    }
  };

  const handleDelete = async () => {
    if (!commentToDelete) return;
    await deleteComment({ data: { id: commentToDelete } });
    setCommentToDelete(null);
  };

  useEffect(() => {
    if (isLoading || !data) return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const handleAnchor = () => {
      const hash = window.location.hash;
      if (!hash || !hash.startsWith("#comment-")) return;

      const commentId = parseInt(hash.replace("#comment-", ""), 10);
      if (Number.isNaN(commentId)) return;

      let retries = 0;
      const maxRetries = 20;

      const attemptScroll = () => {
        const element = document.getElementById(`comment-${commentId}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }

        if (retries < maxRetries) {
          retries++;
          timeoutId = setTimeout(attemptScroll, 200);
        }
      };

      attemptScroll();
    };

    handleAnchor();
    window.addEventListener("hashchange", handleAnchor);
    return () => {
      window.removeEventListener("hashchange", handleAnchor);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading, data]);

  if (isLoading || !data) {
    return <WindGlassCommentSectionSkeleton />;
  }

  return (
    <section className="wg-glass-card rounded-[2rem] p-5 md:p-7">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h2 className="wg-heading flex items-center gap-2 text-2xl">
            <MessageCircle size={22} className="text-sky-600 dark:text-sky-200" />
            {m.comments_count({ count: totalCount })}
          </h2>
        </div>
      </header>

      <div className="space-y-6">
        {session ? (
          <WindGlassCommentEditor
            onSubmit={handleCreateComment}
            isSubmitting={isCreating && !replyTarget}
          />
        ) : (
          <div className="wg-glass-subtle flex flex-col items-center justify-center gap-4 rounded-[1.6rem] px-5 py-10 text-center">
            <p className="max-w-sm text-sm leading-relaxed text-gray-600 dark:text-white/58">
              {m.comments_join_discussion()}
            </p>
            <Link to="/login">
              <button
                type="button"
                className="wg-glass-pill wg-pressable inline-flex min-h-11 items-center gap-2 px-5 text-sm font-semibold text-sky-700 dark:text-sky-100"
              >
                <LogIn size={15} />
                {m.comments_login()}
              </button>
            </Link>
          </div>
        )}

        <div ref={turnstileRef}>
          <Turnstile {...turnstileProps} />
        </div>

        <WindGlassCommentList
          rootComments={rootComments}
          postId={postId}
          onReply={(rootIdArg, commentId, userName) =>
            setReplyTarget({ rootId: rootIdArg, commentId, userName })
          }
          onDelete={(id) => setCommentToDelete(id)}
          replyTarget={replyTarget}
          onCancelReply={() => setReplyTarget(null)}
          onSubmitReply={handleCreateReply}
          isSubmittingReply={isCreating}
          initialExpandedRootId={rootId}
          highlightCommentId={highlightCommentId}
        />

        {hasNextPage && (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="wg-glass-pill wg-pressable inline-flex min-h-11 items-center gap-2 px-6 text-sm font-semibold text-sky-700 disabled:cursor-not-allowed disabled:opacity-45 dark:text-sky-100"
            >
              {isFetchingNextPage && (
                <Loader2 size={15} className="animate-spin" />
              )}
              {isFetchingNextPage ? m.comments_loading() : m.comments_load_more()}
            </button>
          </div>
        )}
      </div>

      <WindGlassConfirmationModal
        isOpen={!!commentToDelete}
        onClose={() => setCommentToDelete(null)}
        onConfirm={handleDelete}
        title={m.comments_delete_title()}
        message={m.comments_delete_desc()}
        confirmLabel={m.comments_delete_confirm()}
        isDanger
        isLoading={isDeleting}
      />
    </section>
  );
}

function WindGlassCommentSectionSkeleton() {
  return (
    <section className="wg-glass-card rounded-[2rem] p-5 md:p-7">
      <div className="mb-6 space-y-3">
        <div className="h-3 w-28 animate-pulse rounded-full bg-white/35 dark:bg-white/10" />
        <div className="h-7 w-40 animate-pulse rounded-full bg-white/45 dark:bg-white/12" />
      </div>
      <div className="h-36 animate-pulse rounded-[1.6rem] bg-white/28 dark:bg-white/[0.06]" />
      <div className="mt-6 space-y-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="flex gap-3 rounded-[1.6rem] p-3 md:gap-4 md:p-4"
          >
            <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-white/35 dark:bg-white/10" />
            <div className="flex-1 space-y-3">
              <div className="flex justify-between gap-3">
                <div className="h-4 w-24 animate-pulse rounded-full bg-white/35 dark:bg-white/10" />
                <div className="h-3 w-20 animate-pulse rounded-full bg-white/25 dark:bg-white/[0.06]" />
              </div>
              <div className="space-y-2">
                <div className="h-3.5 w-full animate-pulse rounded-full bg-white/28 dark:bg-white/[0.06]" />
                <div className="h-3.5 w-3/4 animate-pulse rounded-full bg-white/28 dark:bg-white/[0.06]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
