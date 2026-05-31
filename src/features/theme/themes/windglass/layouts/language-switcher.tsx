import { ChevronDown, Languages } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { m } from "@/paraglide/messages";
import { getLocale, setLocale } from "@/paraglide/runtime";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentLocale = getLocale();

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className={`relative flex items-center justify-center ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-full h-full transition-colors wg-pressable"
        aria-label={m.common_switch_language()}
      >
        <Languages size={15} strokeWidth={1.5} />
        <ChevronDown
          size={10}
          className={`ml-0.5 opacity-60 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-28 wg-glass rounded-xl z-50 py-1.5 animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
          {(["zh", "en"] as const).map((locale) => (
            <button
              key={locale}
              type="button"
              onClick={() => {
                setLocale(locale);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-xs transition-colors ${
                currentLocale === locale
                  ? "text-foreground font-semibold"
                  : "text-foreground/50 hover:text-foreground"
              }`}
            >
              {locale === "zh" ? "中文" : "English"}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
