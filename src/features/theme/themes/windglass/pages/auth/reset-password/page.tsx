import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { ResetPasswordPageProps } from "@/features/theme/contract/pages";
import { m } from "@/paraglide/messages";

export function ResetPasswordPage({
  resetPasswordForm,
  token,
  error,
}: ResetPasswordPageProps) {
  const { register, errors, handleSubmit, isSubmitting } = resetPasswordForm;

  if (!token && !error) {
    return <AuthError text={m.reset_password_error_missing_token()} to="/login" />;
  }

  if (error) {
    return (
      <AuthError
        text={m.reset_password_error_invalid_link({ error })}
        to="/forgot-password"
        action={m.reset_password_request_new_link()}
      />
    );
  }

  return (
    <div className="space-y-8">
      <header className="text-center space-y-3">
        <p className="wg-kicker">{m.reset_password_label()}</p>
        <h1 className="wg-heading text-3xl tracking-tight">
          {m.reset_password_title()}
        </h1>
        <p className="text-sm leading-relaxed text-gray-500 dark:text-white/45">
          {m.reset_password_header_desc()}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block space-y-2">
          <span className="wg-kicker">{m.reset_password_new_password()}</span>
          <Input
            type="password"
            {...register("password")}
            className="wg-field h-12 px-4 shadow-none"
            placeholder={m.login_password_placeholder()}
          />
          {errors.password && (
            <span className="text-xs text-red-600 dark:text-red-300">
              {errors.password.message}
            </span>
          )}
        </label>

        <label className="block space-y-2">
          <span className="wg-kicker">{m.reset_password_confirm_new_password()}</span>
          <Input
            type="password"
            {...register("confirmPassword")}
            className="wg-field h-12 px-4 shadow-none"
            placeholder={m.login_password_placeholder()}
          />
          {errors.confirmPassword && (
            <span className="text-xs text-red-600 dark:text-red-300">
              {errors.confirmPassword.message}
            </span>
          )}
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="wg-glass wg-pressable min-h-12 w-full rounded-2xl inline-flex items-center justify-center gap-2 text-sm font-semibold text-gray-800 dark:text-white/78 disabled:opacity-50"
        >
          {isSubmitting && <Loader2 size={16} className="animate-spin" />}
          {m.reset_password_submit()}
        </button>
      </form>
    </div>
  );
}

function AuthError({
  text,
  to,
  action = m.register_back_to_login(),
}: {
  text: string;
  to: "/login" | "/forgot-password";
  action?: string;
}) {
  return (
    <div className="text-center space-y-7">
      <p className="text-sm leading-relaxed text-red-600 dark:text-red-300">{text}</p>
      <Link
        to={to}
        className="wg-glass-subtle wg-pressable min-h-12 w-full rounded-2xl inline-flex items-center justify-center text-sm text-gray-700 dark:text-white/68"
      >
        {action}
      </Link>
    </div>
  );
}
