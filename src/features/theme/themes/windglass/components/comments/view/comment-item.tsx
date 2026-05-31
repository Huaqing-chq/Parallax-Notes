import { ClientOnly } from "@tanstack/react-router";
import { MessageCircle, Trash2, X } from "lucide-react";
import { memo, useMemo } from "react";
import type { CommentWithUser } from "@/features/comments/comments.schema";
import { authClient } from "@/lib/auth/auth.client";
import { cn, formatDate } from "@/lib/utils";
import { m } from "@/paraglide/messages";
import { ExpandableContent } from "./expandable-content";

interface CommentItemProps {
  comment: CommentWithUser;
  onReply?: (rootId: number, commentId: number, userName: string) => void;
  onDelete?: (commentId: number) => void;
  isReply?: boolean;
  replyToName?: string | null;
  highlightCommentId?: number;
  className?: string;
}

export const WindGlassCommentItem = memo(
  ({
    comment,
    onReply,
    onDelete,
    isReply,
    replyToName,
    highlightCommentId,
    className,
  }: CommentItemProps) => {
    const isHighlighted = highlightCommentId === comment.id;
    const { data: session } = authClient.useSession();
    const isAuthor = session?.user.id === comment.userId;
    const isAdmin = session?.user.role === "admin";
    const isBlogger = comment.user?.role === "admin";

    const renderedContent = useMemo(() => {
      if (comment.status === "deleted") {
        return (
          <p className="py-1 text-sm italic text-gray-500 dark:text-white/42">
            {m.comments_item_deleted_content()}
          </p>
        );
      }

      return (
        <ExpandableContent
          content={comment.content}
          className="py-1"
          maxLines={6}
        />
      );
    }, [comment.content, comment.status]);

    const authorName =
      comment.status === "deleted"
        ? m.comments_item_deleted_author()
        : comment.user?.name || m.comments_item_anonymous();

    return (
      <div
        id={`comment-${comment.id}`}
        className={cn(
          "group scroll-mt-32 transition-all duration-300",
          isReply
            ? "ml-3 border-l border-white/35 pl-4 dark:border-white/10 md:ml-8 md:pl-5"
            : "py-3",
          className,
        )}
      >
        <div
          className={cn(
            "relative flex gap-3 rounded-[1.6rem] p-3 md:gap-4 md:p-4",
            isHighlighted
              ? "wg-glass-card brightness-110"
              : "hover:bg-white/10 dark:hover:bg-white/[0.035]",
          )}
        >
          <div className="shrink-0 pt-0.5">
            <div className="wg-glass-subtle flex h-10 w-10 items-center justify-center overflow-hidden rounded-full">
              {comment.status === "deleted" ? (
                <X size={15} className="text-gray-400 dark:text-white/35" />
              ) : comment.user?.image ? (
                <img
                  src={comment.user.image}
                  alt={comment.user.name ?? m.comments_item_anonymous()}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm font-semibold text-gray-600 dark:text-white/62">
                  {comment.user?.name?.slice(0, 1) || "?"}
                </span>
              )}
            </div>
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <span className="truncate text-sm font-semibold text-gray-800 dark:text-white/82">
                  {authorName}
                </span>
                {isBlogger && comment.status !== "deleted" && (
                  <span className="wg-glass-subtle rounded-full px-2 py-0.5 text-[10px] font-semibold text-sky-700 dark:text-sky-100">
                    {m.comments_item_blogger()}
                  </span>
                )}
                {isReply && replyToName && (
                  <span className="text-xs text-gray-500 dark:text-white/42">
                    {m.comments_item_reply_to({
                      name:
                        comment.status === "deleted"
                          ? m.comments_item_unknown()
                          : replyToName,
                    })}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500 dark:text-white/38">
                <ClientOnly fallback="-">
                  {formatDate(comment.createdAt, { includeTime: true })}
                </ClientOnly>
              </span>
            </div>

            {renderedContent}

            {comment.status !== "deleted" && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const rootId = comment.rootId ?? comment.id;
                    onReply?.(
                      rootId,
                      comment.id,
                      comment.user?.name || m.comments_item_unknown_user(),
                    );
                  }}
                  className="wg-pressable inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-gray-500 hover:bg-white/18 hover:text-sky-700 dark:text-white/45 dark:hover:bg-white/10 dark:hover:text-sky-200"
                >
                  <MessageCircle size={13} />
                  {m.comments_item_reply()}
                </button>

                {(isAuthor || isAdmin) && (
                  <button
                    type="button"
                    onClick={() => onDelete?.(comment.id)}
                    className="wg-pressable inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-gray-500 hover:bg-red-500/10 hover:text-red-600 dark:text-white/45 dark:hover:bg-red-400/10 dark:hover:text-red-300"
                  >
                    <Trash2 size={13} />
                    {m.comments_item_delete()}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);

WindGlassCommentItem.displayName = "WindGlassCommentItem";
