import { useState } from "react";
import type { PublicLayoutProps } from "@/features/theme/contract/layouts";
import { AmbientBackground } from "../components/ambient-background";
import { Footer } from "./footer";
import { MobileMenu } from "./mobile-menu";
import { Navbar } from "./navbar";

export function PublicLayout({
  children,
  navOptions,
  user,
  isSessionLoading,
  logout,
}: PublicLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="windglass-theme relative isolate min-h-screen flex flex-col">
      <AmbientBackground />

      <Navbar
        navOptions={navOptions}
        onMenuClick={() => setIsMenuOpen(true)}
        user={user}
        isLoading={isSessionLoading}
      />
      <MobileMenu
        navOptions={navOptions}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        user={user}
        logout={logout}
      />
      <main className="flex-1">{children}</main>
      <Footer navOptions={navOptions} />
    </div>
  );
}
