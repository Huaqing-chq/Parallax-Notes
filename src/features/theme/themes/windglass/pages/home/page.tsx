import { Link, useRouteContext } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  resolveSocialHref,
  SOCIAL_PLATFORMS,
} from "@/features/config/utils/social-platforms";
import type { PostItem } from "@/features/posts/schema/posts.schema";
import type { HomePageProps } from "@/features/theme/contract/pages";
import { m } from "@/paraglide/messages";
import { PostCard } from "../../components/post-card";
import {
  TypewriterText,
  useTypewriter,
  useTypewriterCharacterCount,
} from "../../components/typewriter-text";
import { usePointerGlow } from "../../components/use-pointer-glow";

interface MergedPost {
  post: PostItem;
  pinned: boolean;
  popular: boolean;
}

const TYPEWRITER_INTRO_DELAY_CHARACTERS = 8;

export function HomePage({ posts, pinnedPosts, popularPosts }: HomePageProps) {
  const { siteConfig } = useRouteContext({ from: "__root__" });
  const viewAllGlow = usePointerGlow<HTMLAnchorElement>();
  const mergedPosts = useMemo(() => {
    const seen = new Set<string>();
    const result: MergedPost[] = [];
    const popularSlugs = new Set((popularPosts ?? []).map((p) => p.slug));

    for (const post of pinnedPosts ?? []) {
      if (seen.has(post.slug)) continue;
      seen.add(post.slug);
      result.push({ post, pinned: true, popular: popularSlugs.has(post.slug) });
    }

    for (const post of popularPosts ?? []) {
      if (seen.has(post.slug)) continue;
      seen.add(post.slug);
      result.push({ post, pinned: false, popular: true });
    }

    for (const post of posts) {
      if (seen.has(post.slug)) continue;
      seen.add(post.slug);
      result.push({ post, pinned: false, popular: false });
    }

    return result;
  }, [posts, pinnedPosts, popularPosts]);

  const socialLinks = (siteConfig.social ?? []).filter((l) => l.url);
  const greetingSegments = [{ text: m.home_greeting() }];
  const introSegments = [
    { text: `${m.home_intro_prefix()} ` },
    {
      text: siteConfig.author,
      className: "text-gray-800 dark:text-white/80 font-medium",
    },
    { text: m.home_intro_separator() },
    { text: siteConfig.description },
  ];
  const greetingCharacterCount = useTypewriterCharacterCount(greetingSegments);
  const introCharacterCount = useTypewriterCharacterCount(introSegments);
  const visibleCharacters = useTypewriter(
    greetingCharacterCount +
      TYPEWRITER_INTRO_DELAY_CHARACTERS +
      introCharacterCount,
  );
  const visibleGreetingCharacters = Math.min(
    visibleCharacters,
    greetingCharacterCount,
  );
  const visibleIntroCharacters = Math.max(
    0,
    visibleCharacters -
      greetingCharacterCount -
      TYPEWRITER_INTRO_DELAY_CHARACTERS,
  );

  return (
    <div className="px-4 py-10 md:py-16">
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        {/* ── Greeting section ── */}
        <section className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white/90 mb-5 flex items-center gap-3">
            <TypewriterText
              cursor={visibleIntroCharacters === 0}
              segments={greetingSegments}
              visibleCharacters={visibleGreetingCharacters}
            />
            {visibleGreetingCharacters >= greetingCharacterCount && (
              <span className="inline-block animate-[wave_2.4s_ease-in-out_infinite] origin-[70%_70%]">
                👋
              </span>
            )}
          </h1>

          <p className="text-base md:text-lg text-gray-500 dark:text-white/50 font-light leading-relaxed mb-6 max-w-xl">
            <TypewriterText
              cursor={visibleIntroCharacters > 0}
              segments={introSegments}
              visibleCharacters={visibleIntroCharacters}
            />
          </p>

          {/* Social links */}
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {socialLinks.map((link, i) => {
                const preset =
                  link.platform !== "custom"
                    ? SOCIAL_PLATFORMS[link.platform]
                    : null;
                const Icon = preset?.icon;
                const label = preset?.label ?? link.label ?? "";
                const href = resolveSocialHref(link.platform, link.url);

                return (
                  <a
                    key={`${link.platform}-${i}`}
                    href={href}
                    target={link.platform === "email" ? undefined : "_blank"}
                    rel={link.platform === "email" ? undefined : "noreferrer"}
                    aria-label={label}
                    className="wg-glass-subtle wg-pressable w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 dark:text-white/50 hover:text-gray-800 dark:hover:text-white/80 transition-colors"
                  >
                    {Icon ? (
                      <Icon size={16} strokeWidth={1.5} />
                    ) : (
                      <img src={link.icon} alt={label} className="w-4 h-4" />
                    )}
                  </a>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Divider ── */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent mb-2" />

        <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-400 dark:text-white/35 px-1 mb-1">
          {m.home_latest_posts()}
        </h2>

        {mergedPosts.map(({ post, pinned, popular }) => (
          <PostCard
            key={post.slug}
            post={post}
            pinned={pinned}
            popular={!pinned && popular}
          />
        ))}

        <Link
          ref={viewAllGlow.ref}
          to="/posts"
          className="wg-glass-pill wg-pressable wg-hover-lift mt-4 flex items-center justify-center h-12 text-sm font-medium text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors"
          {...viewAllGlow.handlers}
        >
          <div style={viewAllGlow.glowStyle} aria-hidden="true" />
          <span className="relative z-[1]">{m.home_view_all_posts()}</span>
        </Link>
      </div>
    </div>
  );
}
