import { Link } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import type { VerifyEmailPageProps } from "@/features/theme/contract/pages";
import { m } from "@/paraglide/messages";

export function VerifyEmailPage({ status, error }: VerifyEmailPageProps) {
  return (
    <div className="space-y-8 text-center">
      <header className="space-y-3">
        <p className="wg-kicker">{m.verify_email_header()}</p>
        <h1 className="wg-heading text-3xl tracking-tight">
          {status === "ANALYZING" && m.verify_email_analyzing_title()}
          {status === "SUCCESS" && m.verify_email_success_title()}
          {status === "ERROR" && m.verify_email_error_title()}
        </h1>
      </header>

      {status === "ANALYZING" && (
        <div className="wg-glass-subtle rounded-3xl p-7 flex flex-col items-center gap-4 text-gray-500 dark:text-white/45">
          <Loader2 size={28} className="animate-spin" />
          <p className="text-sm">{m.verify_email_analyzing_desc()}</p>
        </div>
      )}

      {status === "SUCCESS" && (
        <div className="space-y-6">
          <CheckCircle2 className="mx-auto text-emerald-500" size={54} />
          <p className="text-sm leading-relaxed text-gray-500 dark:text-white/45">
            {m.verify_email_success_desc()}
          </p>
          <Link
            to="/"
            className="wg-glass wg-pressable min-h-12 w-full rounded-2xl inline-flex items-center justify-center text-sm font-semibold text-gray-800 dark:text-white/78"
          >
            {m.verify_email_success_action()}
          </Link>
        </div>
      )}

      {status === "ERROR" && (
        <div className="space-y-6">
          <AlertCircle className="mx-auto text-red-500" size={54} />
          <p className="text-sm leading-relaxed text-gray-500 dark:text-white/45">
            {error === "invalid_token"
              ? m.verify_email_error_invalid_token_desc()
              : m.verify_email_error_generic_desc()}
          </p>
          <Link
            to="/login"
            className="wg-glass-subtle wg-pressable min-h-12 w-full rounded-2xl inline-flex items-center justify-center text-sm text-gray-700 dark:text-white/68"
          >
            {m.verify_email_error_action()}
          </Link>
        </div>
      )}
    </div>
  );
}
