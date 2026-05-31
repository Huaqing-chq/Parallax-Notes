import { ClientOnly } from "@tanstack/react-router";
import { X } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDelayUnmount } from "@/hooks/use-delay-unmount";
import { m } from "@/paraglide/messages";

export type ModalType = "LINK" | "IMAGE" | null;

interface WindGlassInsertModalProps {
  type: ModalType;
  initialUrl?: string;
  onClose: () => void;
  onSubmit: (url: string, attrs?: { width?: number; height?: number }) => void;
}

const WindGlassInsertModalInternal: React.FC<WindGlassInsertModalProps> = ({
  type,
  initialUrl = "",
  onClose,
  onSubmit,
}) => {
  const isMounted = !!type;
  const shouldRender = useDelayUnmount(isMounted, 300);
  const [activeType, setActiveType] = useState<ModalType>(type);
  const [inputUrl, setInputUrl] = useState(initialUrl);

  useEffect(() => {
    if (type) {
      setActiveType(type);
      setInputUrl(initialUrl);
    }
  }, [type, initialUrl]);

  const handleSubmit = (event?: React.FormEvent) => {
    event?.preventDefault();
    const trimmed = inputUrl.trim();
    if (activeType === "LINK") {
      if (trimmed || initialUrl.trim()) onSubmit(trimmed);
      return;
    }
    if (trimmed) onSubmit(trimmed);
  };

  if (!shouldRender) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-100 flex items-center justify-center p-4 transition-all duration-300 md:p-6 ${
        isMounted
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/28 backdrop-blur-2xl dark:bg-black/55"
        onClick={onClose}
        aria-label={m.comments_editor_modal_cancel()}
      />

      <div
        className={`wg-glass-card relative flex w-full max-w-md flex-col rounded-[2rem] p-0 transition-all duration-300 ${
          isMounted
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-4 scale-95 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between px-6 pb-4 pt-6">
          <h2 className="wg-heading text-lg">
            {activeType === "LINK"
              ? m.comments_editor_modal_link_title()
              : m.comments_editor_modal_image_title()}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="wg-pressable flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-white/18 hover:text-gray-950 dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label={m.comments_editor_modal_cancel()}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 pb-4">
          <div className="space-y-2">
            <label className="ml-1 text-sm font-medium text-gray-700 dark:text-white/72">
              {activeType === "IMAGE"
                ? m.comments_editor_modal_image_label()
                : m.comments_editor_modal_link_label()}
            </label>
            <input
              type="url"
              autoFocus
              value={inputUrl}
              onChange={(event) => setInputUrl(event.target.value)}
              placeholder="https://..."
              className="wg-field min-h-11 w-full px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 dark:text-white/88 dark:placeholder:text-white/32"
            />
          </div>

          <p className="px-1 text-xs leading-relaxed text-gray-500 dark:text-white/45">
            {activeType === "LINK"
              ? m.comments_editor_modal_link_desc()
              : m.comments_editor_modal_image_desc()}
          </p>
        </form>

        <div className="flex justify-end gap-3 px-6 pb-6 pt-2">
          <button
            onClick={onClose}
            type="button"
            className="wg-pressable min-h-11 rounded-full px-4 text-sm font-medium text-gray-500 hover:bg-white/18 hover:text-gray-950 dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white"
          >
            {m.comments_editor_modal_cancel()}
          </button>
          <button
            onClick={() => handleSubmit()}
            type="button"
            disabled={
              activeType === "LINK"
                ? !inputUrl.trim() && !initialUrl.trim()
                : !inputUrl.trim()
            }
            className="wg-glass-pill wg-pressable min-h-11 px-6 text-sm font-semibold text-sky-700 disabled:cursor-not-allowed disabled:opacity-45 dark:text-sky-100"
          >
            {activeType === "LINK" && !inputUrl.trim() && initialUrl.trim()
              ? m.comments_editor_modal_remove_link()
              : m.comments_editor_modal_confirm()}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export const WindGlassInsertModal: React.FC<WindGlassInsertModalProps> = (
  props,
) => (
  <ClientOnly>
    <WindGlassInsertModalInternal {...props} />
  </ClientOnly>
);
