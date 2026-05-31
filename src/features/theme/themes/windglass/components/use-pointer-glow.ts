import { type CSSProperties, useCallback, useRef, useState } from "react";

/**
 * Produces two Liquid Glass interactions for a surface:
 *
 *  1. A soft highlight that fades in on hover and slowly spreads from the
 *     center to fill the whole surface (it does NOT follow the cursor).
 *  2. An optional subtle 3D tilt that leans the surface toward the cursor.
 *
 * The same hook powers post cards, the navbar, the footer and pill buttons so
 * the hover behaviour stays identical across the theme.
 *
 * Usage:
 *   const glow = usePointerGlow({ tiltMax: 4 });
 *   <div ref={glow.ref} {...glow.handlers} style={glow.tiltStyle}>
 *     <div style={glow.glowStyle} aria-hidden />
 *     ...content...
 *   </div>
 */
interface PointerGlowOptions {
  /** Max tilt angle in degrees. Pass 0 (default) for flat surfaces. */
  tiltMax?: number;
  /** Peak opacity of the highlight while hovered. Keep it gentle. */
  glowOpacity?: number;
  /** Highlight gradient size as a percentage of the element. */
  glowSize?: number;
  /** Highlight color. Defaults to soft white. */
  glowColor?: string;
}

interface PointerState {
  x: number;
  y: number;
  inside: boolean;
}

export function usePointerGlow<T extends HTMLElement>({
  tiltMax = 0,
  glowOpacity = 0.45,
  glowSize = 120,
  glowColor = "rgba(255, 255, 255, 0.85)",
}: PointerGlowOptions = {}) {
  const ref = useRef<T>(null);
  const [pointer, setPointer] = useState<PointerState>({
    x: 50,
    y: 50,
    inside: false,
  });

  const onPointerEnter = useCallback(() => {
    setPointer((prev) => ({ ...prev, inside: true }));
  }, []);

  const onPointerLeave = useCallback(() => {
    setPointer({ x: 50, y: 50, inside: false });
  }, []);

  // Only flat-tilting surfaces need the live cursor position. For everyone
  // else we skip the per-move state update so hover stays cheap.
  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (tiltMax <= 0) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setPointer({ x, y, inside: true });
    },
    [tiltMax],
  );

  const rotateY = pointer.inside ? ((pointer.x - 50) / 50) * tiltMax : 0;
  const rotateX = pointer.inside ? -((pointer.y - 50) / 50) * tiltMax : 0;

  const tiltStyle: CSSProperties =
    tiltMax > 0
      ? {
          transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: pointer.inside
            ? "transform 80ms ease-out"
            : "transform 400ms cubic-bezier(0.2, 0.8, 0.2, 1)",
          transformStyle: "preserve-3d",
        }
      : {};

  // Highlight stays centered. On hover it scales up from a small disc to
  // slightly larger than the surface, giving a "fills in gradually" feel.
  //
  // On leave we ONLY fade opacity out; the scale is held at its full size and
  // reset to the small disc with a delay equal to the fade duration — so the
  // shrink happens after the glow is already invisible. This avoids the
  // "white square snapping back" artifact while keeping the grow-in on re-hover.
  const glowStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    borderRadius: "inherit",
    pointerEvents: "none",
    opacity: pointer.inside ? glowOpacity : 0,
    background: `radial-gradient(${glowSize}% ${glowSize}% at 50% 50%, ${glowColor}, transparent 72%)`,
    transform: pointer.inside ? "scale(1.15)" : "scale(0.6)",
    transformOrigin: "center",
    transition: pointer.inside
      ? "opacity 450ms ease, transform 700ms cubic-bezier(0.22, 1, 0.36, 1)"
      : "opacity 500ms ease, transform 0ms linear 500ms",
    mixBlendMode: "soft-light",
    zIndex: 2,
  };

  return {
    ref,
    handlers: { onPointerEnter, onPointerMove, onPointerLeave },
    glowStyle,
    tiltStyle,
  };
}
