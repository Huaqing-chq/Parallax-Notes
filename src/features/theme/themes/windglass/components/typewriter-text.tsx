import { useEffect, useMemo, useState } from "react";

interface TypewriterSegment {
  text: string;
  className?: string;
}

interface TypewriterTextProps {
  segments: TypewriterSegment[];
  visibleCharacters: number;
  className?: string;
  cursor?: boolean;
}

export function TypewriterText({
  segments,
  visibleCharacters,
  className,
  cursor,
}: TypewriterTextProps) {
  const text = segments.map((segment) => segment.text).join("");
  let remainingCharacters = visibleCharacters;

  return (
    <span aria-label={text} className={className}>
      <span aria-hidden="true">
        {segments.map((segment, segmentIndex) => {
          const characters = Array.from(segment.text);
          const visibleSegmentCharacters = Math.max(
            0,
            Math.min(characters.length, remainingCharacters),
          );
          remainingCharacters -= visibleSegmentCharacters;

          if (visibleSegmentCharacters === 0) {
            return null;
          }

          return (
            <span className={segment.className} key={segmentIndex}>
              {characters
                .slice(0, visibleSegmentCharacters)
                .map((character, characterIndex) => (
                  <span
                    className="wg-typewriter-char"
                    key={`${segmentIndex}-${characterIndex}-${character}`}
                  >
                    {character}
                  </span>
                ))}
            </span>
          );
        })}
        {cursor && <span className="wg-typewriter-cursor" />}
      </span>
    </span>
  );
}

export function useTypewriter(totalCharacters: number, intervalMs = 42) {
  const [visibleCharacters, setVisibleCharacters] = useState(0);

  useEffect(() => {
    if (totalCharacters <= 0) {
      setVisibleCharacters(0);
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setVisibleCharacters(totalCharacters);
      return;
    }

    setVisibleCharacters(0);
    const timer = window.setInterval(() => {
      setVisibleCharacters((current) => {
        if (current >= totalCharacters) {
          window.clearInterval(timer);
          return totalCharacters;
        }

        return current + 1;
      });
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [intervalMs, totalCharacters]);

  return visibleCharacters;
}

export function useTypewriterCharacterCount(segments: TypewriterSegment[]) {
  return useMemo(
    () =>
      segments.reduce(
        (count, segment) => count + Array.from(segment.text).length,
        0,
      ),
    [segments],
  );
}
