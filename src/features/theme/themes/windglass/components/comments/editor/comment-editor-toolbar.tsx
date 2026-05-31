import type { Editor } from "@tiptap/react";
import { useEditorState } from "@tiptap/react";
import type { LucideIcon } from "lucide-react";
import {
  Bold,
  Code,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  Redo,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo,
} from "lucide-react";
import type React from "react";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";

interface CommentEditorToolbarProps {
  editor: Editor;
  onLinkClick: () => void;
  onImageClick: () => void;
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  icon: LucideIcon;
  label?: string;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  onClick,
  isActive,
  icon: Icon,
  label,
}) => (
  <button
    onClick={onClick}
    className={cn(
      "wg-pressable flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200",
      isActive
        ? "wg-glass-pill text-sky-700 dark:text-sky-100"
        : "text-gray-500 hover:bg-white/18 hover:text-gray-950 dark:text-white/45 dark:hover:bg-white/10 dark:hover:text-white",
    )}
    title={label}
    aria-label={label}
    type="button"
  >
    <Icon size={15} />
  </button>
);

const WindGlassCommentEditorToolbar: React.FC<CommentEditorToolbarProps> = ({
  editor,
  onLinkClick,
  onImageClick,
}) => {
  const { isBold, isItalic, isUnderline, isStrike, isCode, isLink } =
    useEditorState({
      editor,
      selector: (ctx) => ({
        isBold: ctx.editor.isActive("bold"),
        isItalic: ctx.editor.isActive("italic"),
        isUnderline: ctx.editor.isActive("underline"),
        isStrike: ctx.editor.isActive("strike"),
        isCode: ctx.editor.isActive("code"),
        isLink: ctx.editor.isActive("link"),
      }),
    });

  return (
    <div className="flex items-center gap-1 overflow-x-auto p-1.5">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={isBold}
        icon={Bold}
        label={m.comments_editor_toolbar_bold()}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={isItalic}
        icon={Italic}
        label={m.comments_editor_toolbar_italic()}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={isUnderline}
        icon={UnderlineIcon}
        label={m.comments_editor_toolbar_underline()}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={isStrike}
        icon={Strikethrough}
        label={m.comments_editor_toolbar_strike()}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={isCode}
        icon={Code}
        label={m.comments_editor_toolbar_code()}
      />

      <div className="mx-1 h-6 w-px shrink-0 bg-white/35 dark:bg-white/10" />

      <ToolbarButton
        onClick={onLinkClick}
        isActive={isLink}
        icon={LinkIcon}
        label={m.comments_editor_toolbar_link()}
      />
      <ToolbarButton
        onClick={onImageClick}
        icon={ImageIcon}
        label={m.comments_editor_toolbar_image()}
      />

      <div className="ml-auto flex gap-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          icon={Undo}
          label={m.comments_editor_toolbar_undo()}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          icon={Redo}
          label={m.comments_editor_toolbar_redo()}
        />
      </div>
    </div>
  );
};

export default WindGlassCommentEditorToolbar;
