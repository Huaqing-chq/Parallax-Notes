import { ClientOnly } from "@tanstack/react-router";
import { Loader2, X } from "lucide-react";
import type React from "react";
import { createPortal } from "react-dom";
import { m } from "@/paraglide/messages";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  isDanger?: boolean;
  isLoading?: boolean;
}

const WindGlassConfirmationModalInternal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = m.common_confirm(),
  isDanger = false,
  isLoading = false,
}) => {
  return createPortal(
    <div
      className={`fixed inset-0 z-100 flex items-center justify-center p-4 transition-all duration-300 md:p-6 ${
        isOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/28 backdrop-blur-2xl dark:bg-black/55"
        onClick={isLoading ? undefined : () => onClose()}
        aria-label={m.common_cancel()}
      />

      <div
        className={`wg-glass-card relative flex w-full max-w-md flex-col rounded-[2rem] transition-all duration-300 ${
          isOpen
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-4 scale-95 opacity-0"
        }`}
      >
        <div className="flex items-start justify-between px-6 pb-4 pt-6">
          <h2 className="wg-heading text-lg">{title}</h2>
          <button
            type="button"
            onClick={() => onClose()}
            disabled={isLoading}
            className="wg-pressable flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-white/18 hover:text-gray-950 disabled:opacity-50 dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label={m.common_cancel()}
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 pb-4">
          <p className="text-sm leading-relaxed text-gray-600 dark:text-white/58">
            {message}
          </p>

          {isDanger && (
            <div className="wg-glass-subtle mt-4 rounded-2xl px-4 py-3 text-xs leading-relaxed text-red-600 dark:text-red-300">
              {m.common_irreversible()}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 px-6 pb-6">
          <button
            type="button"
            onClick={() => onClose()}
            disabled={isLoading}
            className="wg-pressable min-h-10 rounded-full px-4 text-sm font-medium text-gray-500 hover:bg-white/18 hover:text-gray-950 disabled:opacity-50 dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white"
          >
            {m.common_cancel()}
          </button>
          <button
            type="button"
            onClick={() => onConfirm()}
            disabled={isLoading}
            className={`wg-pressable inline-flex min-h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-45 ${
              isDanger
                ? "bg-red-500/92 text-white shadow-[0_12px_30px_rgba(239,68,68,0.25)] hover:bg-red-600"
                : "wg-glass-pill text-sky-700 dark:text-sky-100"
            }`}
          >
            {isLoading && <Loader2 size={15} className="animate-spin" />}
            <span>{isLoading ? m.common_processing() : confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default function WindGlassConfirmationModal(
  props: ConfirmationModalProps,
) {
  return (
    <ClientOnly>
      <WindGlassConfirmationModalInternal {...props} />
    </ClientOnly>
  );
}
