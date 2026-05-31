import { useRouteContext, useRouterState } from "@tanstack/react-router";
import type { CSSProperties } from "react";

export function AmbientBackground() {
  const { siteConfig } = useRouteContext({ from: "__root__" });
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const background = siteConfig.theme.windglass.background;
  const isHomepage = pathname === "/" || pathname === "";

  if (!background || (!background.homeImage && !background.globalImage)) {
    return (
      <div
        className="fixed inset-0 -z-10 pointer-events-none wg-ambient"
        aria-hidden="true"
      />
    );
  }

  const homeImage = background.homeImage || background.globalImage;
  const globalImage = background.globalImage || background.homeImage;
  const transition = `opacity ${background.transitionDuration}ms ease`;
  const imageStyle = {
    "--wg-bg-blur": `${background.backdropBlur}px`,
    "--wg-bg-opacity-light": background.light.opacity,
    "--wg-bg-opacity-dark": background.dark.opacity,
  } as CSSProperties;

  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none wg-ambient"
      aria-hidden="true"
      style={imageStyle}
    >
      {homeImage && <link rel="preload" as="image" href={homeImage} />}
      {globalImage && globalImage !== homeImage && (
        <link rel="preload" as="image" href={globalImage} />
      )}

      {homeImage && (
        <div
          className="wg-ambient-image wg-ambient-image-home"
          style={{
            backgroundImage: `url("${homeImage}")`,
            opacity: isHomepage ? "var(--wg-bg-opacity)" : 0,
            transition,
          }}
        />
      )}
      {globalImage && (
        <div
          className="wg-ambient-image wg-ambient-image-global"
          style={{
            backgroundImage: `url("${globalImage}")`,
            opacity: isHomepage && homeImage ? 0 : "var(--wg-bg-opacity)",
            transition,
          }}
        />
      )}
      <div className="wg-ambient-vignette" />
    </div>
  );
}
