import type { JSONContent } from "@tiptap/react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import { Loader2, Send } from "lucide-react";
import { useCallback, useState } from "react";
import { getCommentExtensions } from "@/features/comments/components/editor/config";
import { normalizeLinkHref } from "@/lib/links/normalize-link-href";
import { m } from "@/paraglide/messages";
import WindGlassCommentEditorToolbar from "./comment-editor-toolbar";
import type { ModalType } from "./comment-insert-modal";
import { WindGlassInsertModal } from "./comment-insert-modal";

interface CommentEditorProps {
  onSubmit: (content: JSONContent) => Promise<void>;
  isSubmitting?: boolean;
  autoFocus?: boolean;
  onCancel?: () => void;
  submitLabel?: string;
}

export const WindGlassCommentEditor = ({
  onSubmit,
  isSubmitting,
  autoFocus,
  onCancel,
  submitLabel,
}: CommentEditorProps) => {
  const actualSubmitLabel = submitLabel || m.comments_editor_submit();
  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalInitialUrl, setModalInitialUrl] = useState("");

  const editor = useEditor({
    extensions: getCommentExtensions(),
    content: "",
    autofocus: autoFocus ? "end" : false,
    editorProps: {
      attributes: {
        class:
          "min-h-[86px] w-full bg-transparent py-2 text-sm leading-relaxed text-gray-800 focus:outline-none dark:text-white/78",
      },
    },
  });

  const { isEmpty } = useEditorState({
    editor,
    selector: (ctx) => ({
      isEmpty: ctx.editor.isEmpty,
    }),
  });

  const openLinkModal = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    setModalInitialUrl(previousUrl || "");
    setModalType("LINK");
  }, [editor]);

  const openImageModal = useCallback(() => {
    setModalInitialUrl("");
    setModalType("IMAGE");
  }, []);

  const handleSubmit = async () => {
    if (isEmpty || isSubmitting) return;

    try {
      await onSubmit(editor.getJSON());
      editor.commands.clearContent();
    } catch {
      // Parent hooks surface the error and keep the editor content intact.
    }
  };

  return (
    <div className="wg-glass-card rounded-[1.65rem] transition-all duration-300 focus-within:brightness-105">
      <div className="border-b border-white/35 dark:border-white/10">
        <WindGlassCommentEditorToolbar
          editor={editor}
          onLinkClick={openLinkModal}
          onImageClick={openImageModal}
        />
      </div>

      <EditorContent editor={editor} className="min-h-28 w-full px-4 py-3" />

      <div className="flex flex-col gap-3 border-t border-white/35 px-4 pb-4 pt-3 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xs text-gray-500 dark:text-white/42">
          {m.comments_editor_support_markdown()}
        </span>
        <div className="flex items-center justify-end gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="wg-pressable min-h-10 rounded-full px-4 text-sm font-medium text-gray-500 hover:bg-white/18 hover:text-gray-950 dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {m.comments_editor_cancel()}
            </button>
          )}
          <button
            type="button"
            disabled={isEmpty || isSubmitting}
            onClick={handleSubmit}
            className="wg-glass-pill wg-pressable inline-flex min-h-10 items-center gap-2 px-4 text-sm font-semibold text-sky-700 disabled:cursor-not-allowed disabled:opacity-45 dark:text-sky-100"
          >
            <span>{actualSubmitLabel}</span>
            {isSubmitting ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Send size={15} />
            )}
          </button>
        </div>
      </div>

      <WindGlassInsertModal
        type={modalType}
        initialUrl={modalInitialUrl}
        onClose={() => setModalType(null)}
        onSubmit={(url, attrs) => {
          if (modalType === "LINK") {
            const href = normalizeLinkHref(url);
            if (href === "") {
              editor.chain().focus().extendMarkRange("link").unsetLink().run();
            } else {
              editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href })
                .run();
            }
          } else if (modalType === "IMAGE") {
            editor.chain().focus().setImage({ src: url, ...attrs }).run();
          }
          setModalType(null);
        }}
      />
    </div>
  );
};
