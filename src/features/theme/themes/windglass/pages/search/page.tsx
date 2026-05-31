import { ArrowLeft, Search } from "lucide-react";
import { useEffect, useRef } from "react";
import type { SearchPageProps } from "@/features/theme/contract/pages";
import { m } from "@/paraglide/messages";

export function SearchPage({
  query,
  results,
  isSearching,
  onQueryChange,
  onSelectPost,
  onBack,
}: SearchPageProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const id = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="wg-shell">
      <header className="mb-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="wg-glass-subtle wg-pressable min-h-10 rounded-full px-4 inline-flex items-center gap-2 text-sm text-gray-600 dark:text-white/55 hover:text-gray-950 dark:hover:text-white"
        >
          <ArrowLeft size={15} />
          <span>{m.search_back()}</span>
        </button>
      </header>

      <section className="wg-glass-card rounded-[2rem] p-5 md:p-7 mb-6">
        <label className="wg-kicker mb-3 flex items-center gap-2">
          <Search size={14} />
          <span>{m.search_input_label()}</span>
        </label>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="..."
          className="w-full bg-transparent text-4xl md:text-6xl font-semibold tracking-tight text-gray-900 dark:text-white/90 placeholder:text-gray-400/30 dark:placeholder:text-white/15 focus:outline-none"
        />
      </section>

      <section className="space-y-3">
        {isSearching && (
          <div className="wg-glass-subtle rounded-full px-4 py-2 inline-flex text-sm text-gray-500 dark:text-white/45 animate-pulse">
            {m.posts_loading()}
          </div>
        )}

        {query.trim() !== "" && !isSearching && results.length === 0 && (
          <div className="wg-glass-card rounded-3xl p-8 text-center">
            <p className="text-gray-600 dark:text-white/52">
              {m.search_no_results()} "{query}"
            </p>
          </div>
        )}

        {results.map((result) => (
          <button
            key={result.post.id}
            type="button"
            onClick={() => onSelectPost(result.post.slug)}
            className="wg-glass-card wg-hover-lift wg-pressable group w-full rounded-3xl p-5 text-left"
          >
            <h2
              className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white/78 group-hover:text-gray-950 dark:group-hover:text-white transition-colors"
              style={{ viewTransitionName: `post-title-${result.post.slug}` }}
              dangerouslySetInnerHTML={{
                __html: result.matches.title || result.post.title,
              }}
            />
            <p
              className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-white/45 line-clamp-2"
              dangerouslySetInnerHTML={{
                __html: result.matches.summary || result.post.summary || "",
              }}
            />
            {result.post.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {result.post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="wg-glass-subtle rounded-full px-2.5 py-1 text-[11px] text-gray-500 dark:text-white/42"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </button>
        ))}
      </section>
    </div>
  );
}
