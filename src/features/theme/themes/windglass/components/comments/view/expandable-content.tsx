import type { JSONContent } from "@tiptap/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";
import { renderCommentReact } from "./comment-render";

interface ExpandableContentProps {
  content: JSONContent | null;
  className?: string;
  maxLines?: number;
}

export function ExpandableContent({
  content,
  className,
  maxLines = 6,
}: ExpandableContentProps) {
  const [expanded, setExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    setShowButton(
      contentRef.current.scrollHeight > contentRef.current.clientHeight,
    );
  }, [content]);

  return (
    <div className={cn("relative", className)}>
      <div
        ref={contentRef}
        className={cn(
          "wg-comment-prose max-w-none text-sm transition-all duration-300",
          !expanded && "overflow-hidden",
        )}
        style={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: expanded ? "unset" : maxLines,
        }}
      >
        {renderCommentReact(content)}
      </div>

      {showButton && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="wg-pressable mt-2 min-h-8 rounded-full px-3 text-xs font-semibold text-sky-700 hover:bg-white/18 dark:text-sky-200 dark:hover:bg-white/10"
        >
          {expanded ? m.common_collapse() : m.common_expand_all()}
        </button>
      )}
    </div>
  );
}
