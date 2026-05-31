import { Link, useRouteContext } from "@tanstack/react-router";
import { Search, UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Skeleton } from "@/components/ui/skeleton";
import type { NavOption, UserInfo } from "@/features/theme/contract/layouts";
import { m } from "@/paraglide/messages";
import { usePointerGlow } from "../components/use-pointer-glow";
import { LanguageSwitcher } from "./language-switcher";

interface NavbarProps {
  navOptions: Array<NavOption>;
  onMenuClick: () => void;
  isLoading?: boolean;
  user?: UserInfo;
}

export function Navbar({ onMenuClick, user, navOptions, isLoading }: NavbarProps) {
  const { siteConfig } = useRouteContext({ from: "__root__" });
  const [isScrolled, setIsScrolled] = useState(false);
  const glow = usePointerGlow<HTMLElement>();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        ref={glow.ref}
        {...glow.handlers}
        className={`fixed top-0 left-0 right-0 z-40 flex items-center wg-nav ${
          isScrolled ? "is-scrolled py-2" : "py-2.5"
        }`}
      >
        {/* Cursor-following highlight sweeping along the bar */}
        <div style={{ ...glow.glowStyle, zIndex: 0 }} aria-hidden="true" />

        <div className="relative z-[1] w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="group select-none wg-pressable">
            <span className="text-sm font-semibold tracking-tight text-foreground/90 transition-colors group-hover:text-foreground">
              {siteConfig.theme.windglass.navBarName}
            </span>
          </Link>

          {/* Center nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {navOptions.map((option) => (
              <Link
                key={option.id}
                to={option.to}
                className="text-[11px] font-medium uppercase tracking-widest text-foreground/50 hover:text-foreground transition-colors"
                activeProps={{ className: "!text-foreground" }}
              >
                {option.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0.5">
              <ThemeToggle />
              <LanguageSwitcher className="text-foreground/50 hover:text-foreground h-7 w-7" />
              <Link
                to="/search"
                className="text-foreground/50 hover:text-foreground h-7 w-7 flex items-center justify-center transition-colors wg-pressable"
                aria-label={m.nav_search()}
              >
                <Search size={14} strokeWidth={1.5} />
              </Link>
            </div>

            <div className="flex items-center gap-3 pl-2 border-l border-foreground/10">
              <div className="hidden md:flex items-center">
                {isLoading ? (
                  <Skeleton className="w-6 h-6 rounded-full" />
                ) : (
                  <div className="flex items-center gap-3 animate-in fade-in">
                    {user ? (
                      <Link
                        to="/profile"
                        className="w-6 h-6 rounded-full overflow-hidden ring-1 ring-white/40 hover:ring-white/70 transition-all wg-pressable"
                        style={{ viewTransitionName: "user-avatar" }}
                      >
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full wg-glass-subtle flex items-center justify-center">
                            <UserIcon size={11} className="text-foreground/60" />
                          </div>
                        )}
                      </Link>
                    ) : (
                      <Link
                        to="/login"
                        className="text-[10px] uppercase tracking-widest font-semibold text-foreground/50 hover:text-foreground transition-colors"
                      >
                        {m.nav_login()}
                      </Link>
                    )}
                  </div>
                )}
              </div>

              <button
                className="w-7 h-7 flex flex-col items-center justify-center gap-[4px] group lg:hidden wg-pressable"
                onClick={onMenuClick}
                aria-label={m.common_open_menu()}
                type="button"
              >
                <div className="w-4.5 h-px bg-foreground/70 rounded-full transition-all group-hover:w-3.5" />
                <div className="w-4.5 h-px bg-foreground/70 rounded-full transition-all group-hover:w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer so content doesn't sit behind the fixed header */}
      <div className="h-14" />
    </>
  );
}
