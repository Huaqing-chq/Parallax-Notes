import { Link } from "@tanstack/react-router";
import type { UserLayoutProps } from "@/features/theme/contract/layouts";
import { m } from "@/paraglide/messages";
import { AmbientBackground } from "../components/ambient-background";

export function UserLayout({ isAuthenticated, children }: UserLayoutProps) {
  return (
    <div className="windglass-theme relative isolate min-h-screen">
      <AmbientBackground />
      {isAuthenticated ? (
        <main>{children}</main>
      ) : (
        <main className="flex flex-col items-center justify-center min-h-screen px-6">
          <div className="max-w-sm w-full wg-glass rounded-3xl p-10 text-center space-y-6">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground/90">
              {m.auth_layout_login_required()}
            </h1>
            <p className="text-sm text-foreground/50 leading-relaxed">
              {m.auth_layout_login_required_desc()}
            </p>
            <div className="flex items-center justify-center gap-6 pt-2">
              <Link
                to="/login"
                className="text-sm font-medium text-foreground hover:text-foreground/70 transition-colors wg-pressable"
              >
                {m.auth_layout_go_to_login()} →
              </Link>
              <Link
                to="/"
                className="text-sm text-foreground/40 hover:text-foreground transition-colors"
              >
                {m.auth_layout_back_home()}
              </Link>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
