import { useInfiniteQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import type { JSONContent } from "@tiptap/react";
import { ChevronDown, LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import type { RootCommentWithReplyCount } from "@/features/comments/comments.schema";
import { repliesByRootIdInfiniteQuery } from "@/features/comments/queries";
import { authClient } from "@/lib/auth/auth.client";
import { m } from "@/paraglide/messages";
import { WindGlassCommentEditor } from "../editor/comment-editor";
import { WindGlassCommentItem } from "./comment-item";

type RootCommentWithUser = RootCommentWithReplyCount;

interface CommentListProps {
  rootComments: Array<RootCommentWithUser>;
  postId: number;
  onReply?: (rootId: number, commentId: number, userName: string) => void;
  onDelete?: (commentId: number) => void;
  replyTarget?: { rootId: number; commentId: number; userName: string } | null;
  onCancelReply?: () => void;
  onSubmitReply?: (content: JSONContent) => Promise<void>;
  isSubmittingReply?: boolean;
  initialExpandedRootId?: number;
  highlightCommentId?: number;
}

export const WindGlassCommentList = ({
  rootComments,
  postId,
  onReply,
  onDelete,
  replyTarget,
  onCancelReply,
  onSubmitReply,
  isSubmittingReply,
  initialExpandedRootId,
  highlightCommentId,
}: CommentListProps) => {
  const { data: session } = authClient.useSession();
  const [expandedRoots, setExpandedRoots] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (initialExpandedRootId) {
      setExpandedRoots((prev) => new Set(prev).add(initialExpandedRootId));
    }
  }, [initialExpandedRootId]);

  const toggleExpand = (targetRootId: number) => {
    setExpandedRoots((prev) => {
      const next = new Set(prev);
      if (next.has(targetRootId)) {
        next.delete(targetRootId);
      } else {
        next.add(targetRootId);
      }
      return next;
    });
  };

  if (rootComments.length === 0) {
    return (
      <div className="wg-glass-subtle rounded-[1.6rem] px-5 py-12 text-center">
        <p className="text-sm text-gray-500 dark:text-white/45">
          {m.comments_list_empty()}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {rootComments.map((root) => (
        <RootCommentWithReplies
          key={root.id}
          root={root}
          postId={postId}
          isExpanded={expandedRoots.has(root.id)}
          onToggleExpand={() => toggleExpand(root.id)}
          onReply={onReply}
          onDelete={onDelete}
          replyTarget={replyTarget}
          onCancelReply={onCancelReply}
          onSubmitReply={onSubmitReply}
          isSubmittingReply={isSubmittingReply}
          session={session}
          highlightCommentId={highlightCommentId}
        />
      ))}
    </div>
  );
};

interface RootCommentWithRepliesProps {
  root: RootCommentWithUser;
  postId: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onReply?: (rootId: number, commentId: number, userName: string) => void;
  onDelete?: (commentId: number) => void;
  replyTarget?: { rootId: number; commentId: number; userName: string } | null;
  onCancelReply?: () => void;
  onSubmitReply?: (content: JSONContent) => Promise<void>;
  isSubmittingReply?: boolean;
  session: ReturnType<typeof authClient.useSession>["data"];
  highlightCommentId?: number;
}

function RootCommentWithReplies({
  root,
  postId,
  isExpanded,
  onToggleExpand,
  onReply,
  onDelete,
  replyTarget,
  onCancelReply,
  onSubmitReply,
  isSubmittingReply,
  session,
  highlightCommentId,
}: RootCommentWithRepliesProps) {
  const {
    data: repliesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    repliesByRootIdInfiniteQuery(postId, root.id, session?.user.id),
  );

  const allReplies = repliesData?.pages.flatMap((page) => page.items) ?? [];
  const isReplyingToRoot =
    replyTarget &&
    replyTarget.rootId === root.id &&
    replyTarget.commentId === root.id;

  return (
    <div>
      <WindGlassCommentItem
        comment={root}
        onReply={() => {
          onReply?.(
            root.id,
            root.id,
            root.user?.name || m.comments_item_unknown_user(),
          );
        }}
        onDelete={onDelete}
        highlightCommentId={highlightCommentId}
      />

      {isReplyingToRoot && (
        <div className="ml-12 py-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {session ? (
            onSubmitReply && onCancelReply ? (
              <ReplyForm
                userName={replyTarget.userName}
                onSubmit={onSubmitReply}
                isSubmitting={isSubmittingReply ?? false}
                onCancel={onCancelReply}
              />
            ) : null
          ) : (
            <LoginToReplyPrompt
              userName={replyTarget.userName}
              onCancel={onCancelReply}
            />
          )}
        </div>
      )}

      {root.replyCount > 0 && (
        <div className="ml-12 mt-1">
          <button
            type="button"
            onClick={onToggleExpand}
            className="wg-pressable inline-flex min-h-9 items-center gap-2 rounded-full px-3 text-xs font-semibold text-gray-500 hover:bg-white/18 hover:text-sky-700 dark:text-white/45 dark:hover:bg-white/10 dark:hover:text-sky-200"
          >
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
            {isExpanded
              ? m.comments_list_collapse_replies()
              : m.comments_list_expand_replies({ count: root.replyCount })}
          </button>

          {isExpanded && (
            <div className="mt-2 space-y-1">
              {allReplies.map((reply) => {
                const isReplyingToThis =
                  replyTarget &&
                  replyTarget.rootId === root.id &&
                  replyTarget.commentId === reply.id;

                return (
                  <div key={reply.id}>
                    <WindGlassCommentItem
                      comment={reply}
                      onReply={() => {
                        onReply?.(
                          root.id,
                          reply.id,
                          reply.replyTo?.name ||
                            reply.user?.name ||
                            m.comments_item_unknown_user(),
                        );
                      }}
                      onDelete={onDelete}
                      isReply
                      replyToName={reply.replyTo?.name}
                      highlightCommentId={highlightCommentId}
                    />
                    {isReplyingToThis && (
                      <div className="py-4 pl-4 animate-in fade-in slide-in-from-top-2 duration-300 md:pl-8">
                        {session ? (
                          <ReplyForm
                            userName={replyTarget.userName}
                            onSubmit={onSubmitReply!}
                            isSubmitting={isSubmittingReply!}
                            onCancel={onCancelReply!}
                          />
                        ) : (
                          <LoginToReplyPrompt
                            userName={replyTarget.userName}
                            onCancel={onCancelReply}
                          />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {hasNextPage && (
                <button
                  type="button"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="wg-pressable min-h-9 rounded-full px-3 text-xs font-semibold text-sky-700 hover:bg-white/18 disabled:cursor-not-allowed disabled:opacity-50 dark:text-sky-200 dark:hover:bg-white/10"
                >
                  {isFetchingNextPage
                    ? m.comments_loading()
                    : m.comments_list_load_more_replies()}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ReplyForm({
  userName,
  onSubmit,
  isSubmitting,
  onCancel,
}: {
  userName: string;
  onSubmit: (content: JSONContent) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <span className="text-xs font-semibold text-gray-500 dark:text-white/42">
          {m.comments_item_reply()}
        </span>
        <span className="text-sm font-semibold text-sky-700 dark:text-sky-200">
          @{userName}
        </span>
      </div>
      <WindGlassCommentEditor
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        autoFocus
        onCancel={onCancel}
        submitLabel={m.comments_editor_submit_reply()}
      />
    </div>
  );
}

function LoginToReplyPrompt({
  userName,
  onCancel,
}: {
  userName: string;
  onCancel?: () => void;
}) {
  return (
    <div className="wg-glass-subtle flex flex-col gap-3 rounded-[1.4rem] px-4 py-3 sm:flex-row sm:items-center">
      <span className="flex-1 text-sm text-gray-600 dark:text-white/58">
        {m.comments_list_login_to_reply({ userName })}
      </span>
      <Link to="/login">
        <button
          type="button"
          className="wg-glass-pill wg-pressable inline-flex min-h-10 items-center gap-2 px-4 text-sm font-semibold text-sky-700 dark:text-sky-100"
        >
          <LogIn size={14} />
          {m.comments_login()}
        </button>
      </Link>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="wg-pressable min-h-10 rounded-full px-3 text-sm font-medium text-gray-500 hover:bg-white/18 hover:text-gray-950 dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white"
        >
          {m.comments_editor_cancel()}
        </button>
      )}
    </div>
  );
}
