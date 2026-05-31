import { Link, useNavigate } from "@tanstack/react-router";
import type { JSONContent } from "@tiptap/react";
import {
  ArrowLeft,
  ArrowUp,
  Calendar,
  Clock,
  Share2,
  Sparkles,
  Tag,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { PostPageProps } from "@/features/theme/contract/pages";
import { formatDate } from "@/lib/utils";
import { m } from "@/paraglide/messages";
import { WindGlassCommentSection } from "../../components/comments/view/comment-section";
import { useTypewriter } from "../../components/typewriter-text";

const POST_TYPEWRITER_INTERVAL_MS = 14;

export function PostPage({ post }: PostPageProps) {
  const navigate = useNavigate();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const categories = post.tags ?? [];
  const contentCharacterCount = useMemo(
    () => countTypewriterCharacters(post.contentJson),
    [post.contentJson],
  );
  const visibleContentCharacters = useTypewriter(
    contentCharacterCount,
    POST_TYPEWRITER_INTERVAL_MS,
  );

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 420);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="wg-shell max-w-3xl">
      <nav className="mb-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate({ to: "/posts" })}
          className="wg-glass-subtle wg-pressable min-h-10 rounded-full px-4 inline-flex items-center gap-2 text-sm text-gray-600 dark:text-white/55 hover:text-gray-950 dark:hover:text-white"
        >
          <ArrowLeft size={15} />
          <span>{m.post_back_to_list()}</span>
        </button>
      </nav>

      <article className="space-y-8">
        <header className="wg-glass-card rounded-[2rem] p-5 md:p-6 space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-white/45">
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={13} />
              {m.post_published_at()}: {formatDate(post.publishedAt)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={13} />
              {m.read_time({ count: post.readTimeInMinutes })}
            </span>
          </div>

          <h1
            className="wg-heading text-4xl md:text-6xl tracking-tight"
            style={{ viewTransitionName: `post-title-${post.slug}` }}
          >
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-white/45">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <Tag size={13} />
              <span>分类</span>
            </span>
            {categories.length > 0 ? (
              categories.map((tag) => (
                <Link
                  key={tag.id}
                  to="/posts"
                  search={{ tagName: tag.name }}
                  className="wg-glass-subtle wg-pressable rounded-full px-3 py-1 text-xs text-gray-600 dark:text-white/60 hover:text-gray-950 dark:hover:text-white"
                >
                  {tag.name}
                </Link>
              ))
            ) : (
              <span className="wg-glass-subtle rounded-full px-3 py-1 text-xs text-gray-500 dark:text-white/45">
                {m.post_no_tags()}
              </span>
            )}
          </div>

          {post.summary && (
            <div className="wg-glass-subtle grid grid-cols-[auto_1fr] items-start gap-2.5 rounded-2xl px-3.5 py-2.5 md:px-4">
              <div className="inline-flex items-center gap-1.5 pt-0.5 text-[11px] font-semibold uppercase text-gray-500 dark:text-white/45">
                <Sparkles size={13} />
                <span>{m.post_summary_title()}</span>
              </div>
              <p className="text-sm leading-5 text-gray-700 dark:text-white/68">
                {post.summary}
              </p>
            </div>
          )}
        </header>

        <div className="relative">
          {post.toc.length > 0 && (
            <aside className="hidden xl:block absolute left-full ml-10 top-0 h-full">
              <nav className="sticky top-32 w-64 wg-glass-card rounded-3xl p-5">
                <p className="wg-kicker mb-4">In this post</p>
                <div className="space-y-2">
                  {post.toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="block text-sm text-gray-500 dark:text-white/45 hover:text-gray-950 dark:hover:text-white transition-colors"
                      style={{
                        paddingLeft: `${Math.max(0, item.level - 2) * 12}px`,
                      }}
                    >
                      {item.text}
                    </a>
                  ))}
                </div>
              </nav>
            </aside>
          )}

          <main className="wg-glass-card rounded-[2rem] p-5 md:p-9">
            <div className="wg-prose">
              {renderContent(post.contentJson, visibleContentCharacters)}
            </div>

            <footer className="mt-12 pt-6 border-t border-white/35 dark:border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <span className="wg-kicker">{m.post_end_notice()}</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard
                    .writeText(window.location.href)
                    .then(() => {
                      toast.success(m.post_share_success(), {
                        description: m.post_share_success_desc(),
                      });
                    })
                    .catch(() => {
                      toast.error(m.post_share_error(), {
                        description: m.post_share_error_desc(),
                      });
                    });
                }}
                className="wg-glass-subtle wg-pressable min-h-10 rounded-full px-4 inline-flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-white/55 hover:text-gray-950 dark:hover:text-white"
              >
                <span>{m.post_share()}</span>
                <Share2 size={14} />
              </button>
            </footer>
          </main>
        </div>

        <div className="pt-2">
          <WindGlassCommentSection postId={post.id} />
        </div>
      </article>

      <div
        className={`fixed bottom-7 right-7 z-40 transition-all duration-300 ${
          showBackToTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="wg-glass wg-pressable h-12 w-12 rounded-full flex items-center justify-center text-gray-700 dark:text-white/70"
          aria-label={m.post_back_to_top()}
        >
          <ArrowUp size={18} />
        </button>
      </div>
    </div>
  );
}

function renderContent(content: JSONContent | null, visibleCharacters: number) {
  if (!content) return null;
  return renderNode(content, "root", {
    remainingCharacters: visibleCharacters,
  });
}

interface TypewriterRenderState {
  remainingCharacters: number;
}

function renderNode(
  node: JSONContent,
  key: string,
  state: TypewriterRenderState,
): ReactNode {
  if (node.type === "text") return renderText(node, key, state);

  switch (node.type) {
    case "doc": {
      const { children } = renderChildren(node, key, state);
      return <>{children}</>;
    }
    case "paragraph": {
      const { children, hasVisibleChildren } = renderChildren(node, key, state);
      if (!hasVisibleChildren) return null;
      return <p key={key}>{children}</p>;
    }
    case "heading": {
      const { children, hasVisibleChildren } = renderChildren(node, key, state);
      if (!hasVisibleChildren) return null;
      const level = Math.min(Math.max(Number(node.attrs?.level ?? 2), 2), 4);
      const id = typeof node.attrs?.id === "string" ? node.attrs.id : undefined;
      const Tag = `h${level}` as "h2" | "h3" | "h4";
      return (
        <Tag key={key} id={id}>
          {children}
        </Tag>
      );
    }
    case "bulletList": {
      const { children, hasVisibleChildren } = renderChildren(node, key, state);
      if (!hasVisibleChildren) return null;
      return <ul key={key}>{children}</ul>;
    }
    case "orderedList": {
      const { children, hasVisibleChildren } = renderChildren(node, key, state);
      if (!hasVisibleChildren) return null;
      return <ol key={key}>{children}</ol>;
    }
    case "listItem": {
      const { children, hasVisibleChildren } = renderChildren(node, key, state);
      if (!hasVisibleChildren) return null;
      return <li key={key}>{children}</li>;
    }
    case "blockquote": {
      const { children, hasVisibleChildren } = renderChildren(node, key, state);
      if (!hasVisibleChildren) return null;
      return <blockquote key={key}>{children}</blockquote>;
    }
    case "codeBlock": {
      const code = getTextContent(node);
      const codeCharacters = Array.from(code);
      const visibleCodeCharacters = consumeVisibleCharacters(
        state,
        codeCharacters.length,
      );

      if (visibleCodeCharacters === 0) return null;

      const isComplete = visibleCodeCharacters >= codeCharacters.length;
      const html =
        typeof node.attrs?.highlightedHtml === "string"
          ? node.attrs.highlightedHtml
          : null;
      return (
        <div key={key} className="wg-code-block">
          {html && isComplete ? (
            <div
              className="wg-code-block-shiki"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <pre>
              <code>
                {codeCharacters.slice(0, visibleCodeCharacters).join("")}
                {!isComplete && <span className="wg-typewriter-cursor" />}
              </code>
            </pre>
          )}
        </div>
      );
    }
    case "image": {
      const src = typeof node.attrs?.src === "string" ? node.attrs.src : "";
      const alt =
        typeof node.attrs?.alt === "string" && node.attrs.alt !== "null"
          ? node.attrs.alt
          : "blog image";
      if (!src) return null;
      if (consumeVisibleCharacters(state, 1) === 0) return null;
      return (
        <img
          key={key}
          src={src}
          alt={alt}
          loading="lazy"
          className="rounded-3xl"
        />
      );
    }
    case "horizontalRule":
      if (consumeVisibleCharacters(state, 1) === 0) return null;
      return <hr key={key} />;
    case "hardBreak":
      if (consumeVisibleCharacters(state, 1) === 0) return null;
      return <br key={key} />;
    default: {
      const { children, hasVisibleChildren } = renderChildren(node, key, state);
      return hasVisibleChildren ? <div key={key}>{children}</div> : null;
    }
  }
}

function renderChildren(
  node: JSONContent,
  key: string,
  state: TypewriterRenderState,
) {
  const children = node.content?.map((child, index) =>
    renderNode(child, `${key}-${index}`, state),
  );

  return {
    children,
    hasVisibleChildren: children?.some((child) => child != null) ?? false,
  };
}

function renderText(
  node: JSONContent,
  key: string,
  state: TypewriterRenderState,
): ReactNode {
  const characters = Array.from(node.text ?? "");
  const visibleCharacters = consumeVisibleCharacters(state, characters.length);

  if (visibleCharacters === 0) return null;

  const isComplete = visibleCharacters >= characters.length;
  let element: ReactNode = (
    <>
      {characters.slice(0, visibleCharacters).join("")}
      {!isComplete && <span className="wg-typewriter-cursor" />}
    </>
  );

  for (const mark of node.marks ?? []) {
    if (mark.type === "bold")
      element = <strong key={`${key}-b`}>{element}</strong>;
    if (mark.type === "italic") element = <em key={`${key}-i`}>{element}</em>;
    if (mark.type === "code") element = <code key={`${key}-c`}>{element}</code>;
    if (mark.type === "link") {
      const href = typeof mark.attrs?.href === "string" ? mark.attrs.href : "#";
      element = (
        <a key={`${key}-a`} href={href} target="_blank" rel="noreferrer">
          {element}
        </a>
      );
    }
  }

  return <span key={key}>{element}</span>;
}

function getTextContent(node: JSONContent): string {
  if (node.type === "text") return node.text ?? "";
  return node.content?.map(getTextContent).join("") ?? "";
}

function countTypewriterCharacters(node: JSONContent | null): number {
  if (!node) return 0;
  if (node.type === "text") return Array.from(node.text ?? "").length;
  if (node.type === "codeBlock") return Array.from(getTextContent(node)).length;
  if (node.type === "image" || node.type === "horizontalRule") return 1;
  if (node.type === "hardBreak") return 1;
  return (
    node.content?.reduce(
      (count, child) => count + countTypewriterCharacters(child),
      0,
    ) ?? 0
  );
}

function consumeVisibleCharacters(
  state: TypewriterRenderState,
  characterCount: number,
) {
  if (characterCount <= 0 || state.remainingCharacters <= 0) return 0;

  const visibleCharacters = Math.min(characterCount, state.remainingCharacters);
  state.remainingCharacters -= visibleCharacters;
  return visibleCharacters;
}
