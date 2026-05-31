import { Link, useRouteContext } from "@tanstack/react-router";
import { LogOut, UserIcon, X } from "lucide-react";
import type { NavOption, UserInfo } from "@/features/theme/contract/layouts";
import { m } from "@/paraglide/messages";

interface MobileMenuProps {
  navOptions: Array<NavOption>;
  isOpen: boolean;
  onClose: () => void;
  user?: UserInfo;
  logout: () => Promise<void>;
}

export function MobileMenu({ navOptions, isOpen, onClose, user, logout }: MobileMenuProps) {
  const { siteConfig } = useRouteContext({ from: "__root__" });

  return (
    <div
      className={`fixed inset-0 z-100 transition-all duration-400 ease-in-out ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Glass backdrop */}
      <div className="absolute inset-0 wg-glass-overlay" onClick={onClose} />

      {/* Content */}
      <div
        className={`relative h-full w-full flex flex-col p-8 md:p-16 transition-all duration-400 ${
          isOpen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold tracking-tight text-foreground/90">
            {siteConfig.theme.windglass.navBarName}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full wg-glass-subtle flex items-center justify-center text-foreground/60 hover:text-foreground transition-colors wg-pressable"
            aria-label={m.common_open_menu()}
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 flex flex-col justify-center gap-4">
          {navOptions.map((item, idx) => (
            <Link
              key={item.id}
              to={item.to}
              onClick={onClose}
              className={`group flex items-baseline gap-3 transition-all duration-400 ${
                isOpen ? "translate-x-0 opacity-100" : "-translate-x-6 opacity-0"
              }`}
              activeProps={{ className: "!text-foreground" }}
              style={{ transitionDelay: isOpen ? `${40 + idx * 40}ms` : "0ms" }}
            >
              {({ isActive }) => (
                <>
                  <span className="text-xs text-foreground/25 font-mono">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`text-4xl md:text-5xl font-semibold tracking-tight transition-colors ${
                      isActive ? "text-foreground" : "text-foreground/40 group-hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </Link>
          ))}

          {user?.role === "admin" && (
            <Link
              to="/admin"
              onClick={onClose}
              className={`group flex items-baseline gap-3 transition-all duration-400 ${
                isOpen ? "translate-x-0 opacity-100" : "-translate-x-6 opacity-0"
              }`}
              style={{
                transitionDelay: isOpen ? `${80 + navOptions.length * 40}ms` : "0ms",
              }}
            >
              <span className="text-xs text-foreground/25 font-mono">
                {String(navOptions.length + 1).padStart(2, "0")}
              </span>
              <span className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground/40 group-hover:text-foreground transition-colors">
                {m.profile_admin_dashboard()}
              </span>
            </Link>
          )}
        </nav>

        {/* Footer: user / login */}
        <div
          className={`transition-all duration-400 pt-6 border-t border-foreground/8 ${
            isOpen ? "opacity-100 translate-y-0 delay-300" : "opacity-0 translate-y-3"
          }`}
        >
          {user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full wg-glass overflow-hidden">
                  {user.image ? (
                    <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <UserIcon size={14} className="text-foreground/60" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground/80">@{user.name}</span>
                  <Link
                    to="/profile"
                    onClick={onClose}
                    className="text-[10px] uppercase tracking-widest text-foreground/40 hover:text-foreground transition-colors"
                  >
                    {m.profile_title()}
                  </Link>
                </div>
              </div>

              <button
                type="button"
                onClick={async () => {
                  await logout();
                  onClose();
                }}
                className="text-foreground/40 hover:text-foreground/80 transition-colors wg-pressable"
              >
                <LogOut size={18} strokeWidth={1.5} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={onClose}
              className="text-xl font-medium text-foreground/40 hover:text-foreground transition-colors"
            >
              {m.nav_login()} →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
