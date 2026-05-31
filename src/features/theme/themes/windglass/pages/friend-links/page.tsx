import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Sparkles } from "lucide-react";
import type { FriendLinksPageProps } from "@/features/theme/contract/pages";
import { m } from "@/paraglide/messages";

export function FriendLinksPage({ links }: FriendLinksPageProps) {
  return (
    <div className="wg-shell">
      <header className="mb-8 md:mb-12 space-y-5">
        <p className="wg-kicker">{m.friend_links_title()}</p>
        <h1 className="wg-heading text-4xl md:text-6xl tracking-tight">
          {m.friend_links_title()}
        </h1>
        <p className="max-w-2xl text-base md:text-lg text-gray-600/85 dark:text-white/55 leading-relaxed">
          {m.friend_links_desc()}
        </p>
      </header>

      {links.length === 0 ? (
        <div className="wg-glass-card rounded-3xl p-10 text-center">
          <Sparkles className="mx-auto mb-4 text-gray-400 dark:text-white/35" size={22} />
          <p className="text-lg text-gray-600 dark:text-white/55">
            {m.friend_links_no_links()}
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-white/35">
            {m.friend_links_first_link()}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {links.map((link) => {
            const displayUrl = link.siteUrl
              .replace(/^https?:\/\//, "")
              .replace(/\/$/, "");

            return (
              <a
                key={link.id}
                href={link.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="wg-glass-card wg-hover-lift wg-pressable group rounded-3xl p-5 flex gap-4"
              >
                <div className="shrink-0 w-12 h-12 rounded-2xl wg-glass-subtle overflow-hidden flex items-center justify-center">
                  {link.logoUrl ? (
                    <img
                      src={link.logoUrl}
                      alt={link.siteName}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-lg font-semibold text-gray-500 dark:text-white/45">
                      {link.siteName.slice(0, 1)}
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-semibold text-gray-900 dark:text-white/86 truncate">
                      {link.siteName}
                    </h2>
                    <ArrowUpRight
                      size={15}
                      className="shrink-0 text-gray-400 dark:text-white/35 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-400 dark:text-white/32 truncate">
                    {displayUrl}
                  </p>
                  {link.description && (
                    <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-white/50 line-clamp-2">
                      {link.description}
                    </p>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      )}

      <section className="wg-glass rounded-3xl p-5 md:p-6 mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white/82">
            {m.friend_links_join_title()}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-white/45">
            {m.friend_links_join_desc()}
          </p>
        </div>
        <Link
          to="/submit-friend-link"
          className="wg-glass-subtle wg-pressable min-h-11 rounded-full px-5 inline-flex items-center justify-center gap-2 text-sm text-gray-700 dark:text-white/68 hover:text-gray-950 dark:hover:text-white"
        >
          <span>{m.friend_links_apply()}</span>
          <ArrowUpRight size={15} />
        </Link>
      </section>
    </div>
  );
}
