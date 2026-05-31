import type { JSONContent } from "@tiptap/react";
import { renderToReactElement } from "@tiptap/static-renderer/pm/react";
import type { ReactNode } from "react";
import { getCommentExtensions } from "@/features/comments/components/editor/config";

export function renderCommentReact(content: JSONContent | null) {
  if (!content) return null;

  if (isPlainTextDocument(content)) {
    const text = extractPlainText(content).trim();
    if (hasMarkdownSyntax(text)) return renderMarkdownText(text);
  }

  return renderToReactElement({
    extensions: getCommentExtensions(),
    content,
    options: {
      nodeMapping: {
        image: ({ node }) => {
          const attrs = node.attrs as {
            src: string;
            alt?: string | null;
            width?: number | string;
            height?: number | string;
          };

          const alt =
            (attrs.alt && attrs.alt !== "null" ? attrs.alt : null) ||
            "comment image";

          return (
            <img
              src={attrs.src}
              alt={alt}
              width={attrs.width || undefined}
              height={attrs.height || undefined}
              loading="lazy"
              decoding="async"
              className="my-3 max-h-[28rem] w-auto max-w-full rounded-2xl object-contain shadow-[0_18px_54px_rgba(40,70,100,0.16)] dark:shadow-[0_18px_54px_rgba(0,0,0,0.38)]"
            />
          );
        },
      },
    },
  });
}

function isPlainTextDocument(node: JSONContent): boolean {
  if (!node.type) return true;
  if (!["doc", "paragraph", "text", "hardBreak"].includes(node.type)) {
    return false;
  }
  return node.content?.every(isPlainTextDocument) ?? true;
}

function extractPlainText(node: JSONContent): string {
  if (node.type === "text") return node.text ?? "";
  if (node.type === "hardBreak") return "\n";
  if (!node.content?.length) return "";

  const text = node.content.map(extractPlainText).join("");
  return node.type === "paragraph" ? `${text}\n\n` : text;
}

function hasMarkdownSyntax(text: string) {
  return /(^|\n)(#{1,6}\s|```|>\s|[-*+]\s|\d+\.\s)/.test(text);
}

function renderMarkdownText(text: string) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (line.trim() === "") {
      index++;
      continue;
    }

    const fenceMatch = line.match(/^```(\S+)?\s*$/);
    if (fenceMatch) {
      const language = fenceMatch[1];
      const codeLines: string[] = [];
      index++;
      while (index < lines.length && !lines[index].match(/^```\s*$/)) {
        codeLines.push(lines[index]);
        index++;
      }
      if (index < lines.length) index++;
      blocks.push(
        <pre key={`code-${index}`} className="wg-comment-code">
          {language && <span className="wg-comment-code-lang">{language}</span>}
          <code>{codeLines.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = Math.min(headingMatch[1].length, 4);
      const Tag = `h${Math.max(level + 2, 3)}` as "h3" | "h4" | "h5" | "h6";
      blocks.push(
        <Tag key={`heading-${index}`} className="wg-comment-heading">
          {renderInlineMarkdown(headingMatch[2])}
        </Tag>,
      );
      index++;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quoteLines: string[] = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) {
        quoteLines.push(lines[index].replace(/^>\s?/, ""));
        index++;
      }
      blocks.push(
        <blockquote key={`quote-${index}`}>
          {renderInlineMarkdown(quoteLines.join(" "))}
        </blockquote>,
      );
      continue;
    }

    if (/^[-*+]\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^[-*+]\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^[-*+]\s+/, ""));
        index++;
      }
      blocks.push(
        <ul key={`ul-${index}`}>
          {items.map((item, itemIndex) => (
            <li key={`${item}-${itemIndex}`}>{renderInlineMarkdown(item)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\d+\.\s+/, ""));
        index++;
      }
      blocks.push(
        <ol key={`ol-${index}`}>
          {items.map((item, itemIndex) => (
            <li key={`${item}-${itemIndex}`}>{renderInlineMarkdown(item)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    const paragraphLines: string[] = [];
    while (
      index < lines.length &&
      lines[index].trim() !== "" &&
      !/^(#{1,6}\s|```|>\s?|[-*+]\s+|\d+\.\s+)/.test(lines[index])
    ) {
      paragraphLines.push(lines[index]);
      index++;
    }
    blocks.push(
      <p key={`p-${index}`}>{renderInlineMarkdown(paragraphLines.join(" "))}</p>,
    );
  }

  return <>{blocks}</>;
}

function renderInlineMarkdown(text: string) {
  const parts: ReactNode[] = [];
  const pattern =
    /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith("`")) {
      parts.push(<code key={`${token}-${match.index}`}>{token.slice(1, -1)}</code>);
    } else if (token.startsWith("**")) {
      parts.push(
        <strong key={`${token}-${match.index}`}>{token.slice(2, -2)}</strong>,
      );
    } else if (token.startsWith("*")) {
      parts.push(<em key={`${token}-${match.index}`}>{token.slice(1, -1)}</em>);
    } else {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      const href = linkMatch?.[2] ?? "";
      parts.push(
        <a
          key={`${token}-${match.index}`}
          href={href}
          target="_blank"
          rel="noreferrer"
        >
          {linkMatch?.[1] ?? token}
        </a>,
      );
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}
