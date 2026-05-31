import { ClientOnly, Link } from "@tanstack/react-router";
import { Calendar, Clock, Eye, Flame, Pin, Tag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { PostItem } from "@/features/posts/schema/posts.schema";
import { formatDate } from "@/lib/utils";
import { m } from "@/paraglide/messages";
import { usePointerGlow } from "./use-pointer-glow";

interface PostCardProps {
  post: PostItem;
  pinned?: boolean;
  popular?: boolean;
  views?: number;
  isLoadingViews?: boolean;
}

export function PostCard({
  post,
  pinned,
  popular,
  views,
  isLoadingViews,
}: PostCardProps) {
  const tagNames = (post.tags ?? []).map((t) => t.name);
  const glow = usePointerGlow<HTMLAnchorElement>({ tiltMax: 4 });

  return (
    <Link
      ref={glow.ref}
      to="/post/$slug"
      params={{ slug: post.slug }}
      className={[
        "wg-glass-card wg-hover-lift wg-pressable group",
        "block rounded-2xl overflow-hidden relative",
        "p-5 md:p-6",
        pinned ? "ring-1 ring-blue-400/30 dark:ring-blue-400/20" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={glow.tiltStyle}
      {...glow.handlers}
    >
      {/* Dynamic cursor-following glow */}
      <div style={glow.glowStyle} aria-hidden="true" />

      {/* Pinned: subtle ambient tint */}
      {pinned && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/6 via-transparent to-violet-400/4"
          aria-hidden="true"
        />
      )}

      {/* Badge row */}
      {(pinned || popular) && (
        <div className="flex items-center gap-1.5 mb-3 text-sm font-medium relative z-[1]">
          {pinned ? (
            <>
              <Pin size={13} className="fill-current text-blue-500/80" />
              <span className="text-blue-600 dark:text-blue-400 text-xs tracking-wide">
                {m.home_pinned_posts()}
              </span>
            </>
          ) : (
            <>
              <Flame size={13} className="text-orange-400" />
              <span className="text-orange-500 dark:text-orange-400 text-xs tracking-wide">
                {m.home_popular_posts()}
              </span>
            </>
          )}
        </div>
      )}

      {/* Title */}
      <h2 className="relative z-[1] font-semibold text-lg md:text-xl leading-snug mb-2.5 text-gray-800 dark:text-white/88 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors duration-200 line-clamp-2">
        {post.title}
      </h2>

      {/* Summary */}
      {post.summary && (
        <p className="relative z-[1] text-sm leading-relaxed text-gray-500/90 dark:text-white/45 line-clamp-2 mb-4">
          {post.summary}
        </p>
      )}

      {/* Metadata */}
      <div className="relative z-[1] flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-400 dark:text-white/35">
        <span className="inline-flex items-center gap-1.5">
          <Calendar size={12} strokeWidth={1.5} />
          <time dateTime={post.publishedAt?.toISOString()}>
            <ClientOnly fallback="—">{formatDate(post.publishedAt)}</ClientOnly>
          </time>
        </span>

        <span className="inline-flex items-center gap-1.5">
          <Clock size={12} strokeWidth={1.5} />
          {m.read_time({ count: post.readTimeInMinutes })}
        </span>

        {isLoadingViews ? (
          <span className="inline-flex items-center gap-1.5">
            <Eye size={12} strokeWidth={1.5} />
            <Skeleton className="h-2.5 w-6 rounded bg-black/8 dark:bg-white/8" />
          </span>
        ) : (
          views !== undefined && (
            <span className="inline-flex items-center gap-1.5">
              <Eye size={12} strokeWidth={1.5} />
              {views.toLocaleString()}
            </span>
          )
        )}
      </div>

      {/* Tags */}
      {tagNames.length > 0 && (
        <div className="relative z-[1] flex flex-wrap items-center gap-1.5 mt-3.5">
          <Tag size={11} className="text-gray-300 dark:text-white/25 shrink-0" />
          {tagNames.map((name) => (
            <span
              key={name}
              className="wg-glass-subtle text-[11px] px-2.5 py-0.5 rounded-full text-gray-500 dark:text-white/50"
            >
              {name}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
