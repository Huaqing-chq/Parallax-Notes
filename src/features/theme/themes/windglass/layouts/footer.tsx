import { ClientOnly, Link, useRouteContext } from "@tanstack/react-router";
import {
  resolveSocialHref,
  SOCIAL_PLATFORMS,
} from "@/features/config/utils/social-platforms";
import type { NavOption } from "@/features/theme/contract/layouts";
import { m } from "@/paraglide/messages";
import { usePointerGlow } from "../components/use-pointer-glow";

interface FooterProps {
  navOptions: Array<NavOption>;
}

export function Footer({ navOptions }: FooterProps) {
  const { siteConfig } = useRouteContext({ from: "__root__" });
  const glow = usePointerGlow<HTMLDivElement>();

  return (
    <footer className="mt-24 mb-8 px-4">
      <div
        ref={glow.ref}
        {...glow.handlers}
        className="wg-footer-glass mx-auto max-w-3xl px-6 md:px-9 py-3 flex flex-wrap items-center justify-center gap-x-7 gap-y-2"
      >
        {/* Cursor-following highlight */}
        <div style={glow.glowStyle} aria-hidden="true" />

        <span className="relative z-[1] text-sm font-semibold tracking-tight text-foreground/80">
          {siteConfig.theme.windglass.navBarName}
        </span>

        <span className="relative z-[1] text-[10px] text-foreground/35 tracking-widest uppercase font-mono">
          <ClientOnly fallback="-">
            {m.footer_copyright({
              year: new Date().getFullYear().toString(),
              author: siteConfig.author,
            })}
          </ClientOnly>
        </span>

        <nav className="relative z-[1] flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
          {navOptions.map((option) => (
            <Link
              key={option.id}
              to={option.to}
              className="text-[11px] font-medium uppercase tracking-widest text-foreground/35 hover:text-foreground transition-colors"
            >
              {option.label}
            </Link>
          ))}
          {siteConfig.social
            .filter((link) => link.url)
            .map((link, i) => {
              const href = resolveSocialHref(link.platform, link.url);
              const label =
                link.platform !== "custom"
                  ? SOCIAL_PLATFORMS[link.platform].label
                  : (link.label ?? "");
              return (
                <a
                  key={`${link.platform}-${i}`}
                  href={href}
                  target={link.platform === "email" ? undefined : "_blank"}
                  rel={link.platform === "email" ? undefined : "noreferrer"}
                  className="text-[11px] font-medium uppercase tracking-widest text-foreground/35 hover:text-foreground transition-colors"
                >
                  {label}
                </a>
              );
            })}
        </nav>
      </div>
    </footer>
  );
}
