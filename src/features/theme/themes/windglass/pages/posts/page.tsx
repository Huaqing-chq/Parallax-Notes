import { useRouteContext } from "@tanstack/react-router";
import { ChevronDown, Filter } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { PostsPageProps } from "@/features/theme/contract/pages";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";
import { PostCard } from "../../components/post-card";

const INITIAL_TAG_COUNT = 10;

export function PostsPage({
  posts,
  tags,
  selectedTag,
  onTagClick,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: PostsPageProps) {
  const { siteConfig } = useRouteContext({ from: "__root__" });
  const [isExpanded, setIsExpanded] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);
  const hasMoreTags = tags.length > INITIAL_TAG_COUNT;
  const visibleTags = isExpanded ? tags : tags.slice(0, INITIAL_TAG_COUNT);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px 240px" },
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="wg-shell">
      <header className="mb-8 md:mb-12 space-y-5">
        <p className="wg-kicker">{m.nav_posts()}</p>
        <h1 className="wg-heading text-4xl md:text-6xl tracking-tight">
          {m.nav_posts()}
        </h1>
        <p className="max-w-2xl text-base md:text-lg text-gray-600/85 dark:text-white/55 leading-relaxed">
          {siteConfig.description}
        </p>
      </header>

      <section className="wg-glass-card rounded-3xl p-4 md:p-5 mb-6">
        <div className="flex items-center gap-2 mb-4 text-gray-500 dark:text-white/45">
          <Filter size={14} strokeWidth={1.7} />
          <span className="wg-kicker">{m.posts_tags_filter()}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onTagClick("")}
            className={cn(
              "wg-glass-subtle wg-pressable min-h-9 rounded-full px-4 text-sm transition-colors",
              !selectedTag
                ? "text-gray-950 dark:text-white"
                : "text-gray-600 dark:text-white/55 hover:text-gray-950 dark:hover:text-white",
            )}
          >
            {m.posts_all()}
          </button>

          {visibleTags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => onTagClick(tag.name)}
              className={cn(
                "wg-glass-subtle wg-pressable min-h-9 rounded-full px-4 text-sm transition-colors",
                "inline-flex items-center gap-2",
                selectedTag === tag.name
                  ? "text-gray-950 dark:text-white"
                  : "text-gray-600 dark:text-white/55 hover:text-gray-950 dark:hover:text-white",
              )}
            >
              <span>{tag.name}</span>
              <span className="text-[11px] opacity-45">{tag.postCount}</span>
            </button>
          ))}

          {hasMoreTags && (
            <button
              type="button"
              onClick={() => setIsExpanded((value) => !value)}
              className="wg-glass-subtle wg-pressable min-h-9 rounded-full px-4 text-sm text-gray-600 dark:text-white/55 inline-flex items-center gap-2"
            >
              {isExpanded ? m.tags_collapse() : m.tags_expand()}
              <ChevronDown
                size={14}
                className={cn("transition-transform", isExpanded && "rotate-180")}
              />
            </button>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        {posts.length === 0 ? (
          <div className="wg-glass-card rounded-3xl p-10 text-center">
            <p className="text-lg text-gray-500 dark:text-white/45">
              {m.posts_no_posts()}
            </p>
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </section>

      <div
        ref={observerRef}
        className="py-12 flex items-center justify-center text-sm text-gray-500 dark:text-white/45"
      >
        {isFetchingNextPage ? (
          <span className="wg-glass-subtle rounded-full px-4 py-2 animate-pulse">
            {m.posts_loading()}
          </span>
        ) : hasNextPage ? (
          <span className="h-px w-24 bg-white/45" />
        ) : posts.length > 0 ? (
          <span className="wg-kicker">{m.posts_end()}</span>
        ) : null}
      </div>
    </div>
  );
}
