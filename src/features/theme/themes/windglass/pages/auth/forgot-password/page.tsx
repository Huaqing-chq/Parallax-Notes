import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { ForgotPasswordPageProps } from "@/features/theme/contract/pages";
import { m } from "@/paraglide/messages";

export function ForgotPasswordPage({
  forgotPasswordForm,
  turnstileElement,
}: ForgotPasswordPageProps) {
  const { register, errors, handleSubmit, isSubmitting, isSent, sentEmail, turnstilePending } =
    forgotPasswordForm;

  if (isSent) {
    return (
      <div className="text-center space-y-7">
        <p className="wg-kicker">{m.forgot_password_success_label()}</p>
        <h1 className="wg-heading text-3xl tracking-tight">
          {m.forgot_password_success_title()}
        </h1>
        <p className="text-sm leading-relaxed text-gray-500 dark:text-white/45">
          {m.forgot_password_success_desc({ email: sentEmail })}
        </p>
        <Link
          to="/login"
          className="wg-glass-subtle wg-pressable min-h-12 w-full rounded-2xl inline-flex items-center justify-center text-sm text-gray-700 dark:text-white/68"
        >
          {m.forgot_password_back_to_login()}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="text-center space-y-3">
        <p className="wg-kicker">{m.forgot_password_label()}</p>
        <h1 className="wg-heading text-3xl tracking-tight">
          {m.forgot_password_title()}
        </h1>
        <p className="text-sm leading-relaxed text-gray-500 dark:text-white/45">
          {m.forgot_password_header_desc()}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block space-y-2">
          <span className="wg-kicker">{m.forgot_password_email_label()}</span>
          <Input
            type="email"
            {...register("email")}
            className="wg-field h-12 px-4 shadow-none"
            placeholder={m.login_email_placeholder()}
          />
          {errors.email && (
            <span className="text-xs text-red-600 dark:text-red-300">
              {errors.email.message}
            </span>
          )}
        </label>

        {turnstileElement}

        <button
          type="submit"
          disabled={isSubmitting || turnstilePending}
          className="wg-glass wg-pressable min-h-12 w-full rounded-2xl inline-flex items-center justify-center gap-2 text-sm font-semibold text-gray-800 dark:text-white/78 disabled:opacity-50"
        >
          {isSubmitting && <Loader2 size={16} className="animate-spin" />}
          {m.forgot_password_submit()}
        </button>
      </form>

      <Link
        to="/login"
        className="block text-center text-sm text-gray-500 dark:text-white/42 hover:text-gray-900 dark:hover:text-white"
      >
        {m.register_back_to_login()}
      </Link>
    </div>
  );
}
