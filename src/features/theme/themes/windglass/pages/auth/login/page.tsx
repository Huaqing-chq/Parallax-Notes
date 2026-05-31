import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { GithubIcon } from "@/components/common/brand-icon";
import { Input } from "@/components/ui/input";
import type { LoginPageProps } from "@/features/theme/contract/pages";
import { m } from "@/paraglide/messages";

export function LoginPage({
  isEmailConfigured,
  loginForm,
  socialLogin,
  turnstileElement,
}: LoginPageProps) {
  const { register, errors, handleSubmit, loginStep, isSubmitting, turnstilePending } =
    loginForm;

  return (
    <div className="space-y-8">
      <header className="text-center space-y-3">
        <p className="wg-kicker">
          {isEmailConfigured ? m.login_label() : m.login_auth_label()}
        </p>
        <h1 className="wg-heading text-3xl tracking-tight">
          {isEmailConfigured ? m.login_title() : m.login_auth_title()}
        </h1>
        {!isEmailConfigured && (
          <p className="text-sm text-gray-500 dark:text-white/45">
            {m.login_only_third_party()}
          </p>
        )}
      </header>

      {isEmailConfigured && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block space-y-2">
            <span className="wg-kicker">{m.login_email_address()}</span>
            <Input
              type="email"
              {...register("email")}
              className="wg-field h-12 px-4 shadow-none"
              placeholder={m.login_email_placeholder()}
              autoComplete="username"
              disabled={isSubmitting || loginStep !== "IDLE"}
            />
            {errors.email && (
              <span className="text-xs text-red-600 dark:text-red-300">
                {errors.email.message}
              </span>
            )}
          </label>

          <label className="block space-y-2">
            <span className="flex items-center justify-between gap-3">
              <span className="wg-kicker">{m.login_password()}</span>
              <Link
                to="/forgot-password"
                tabIndex={-1}
                className="text-xs text-gray-500 dark:text-white/42 hover:text-gray-900 dark:hover:text-white"
              >
                {m.login_forgot_password()}
              </Link>
            </span>
            <Input
              type="password"
              {...register("password")}
              className="wg-field h-12 px-4 shadow-none"
              placeholder={m.login_password_placeholder()}
              autoComplete="current-password"
              disabled={isSubmitting || loginStep !== "IDLE"}
            />
            {errors.password && (
              <span className="text-xs text-red-600 dark:text-red-300">
                {errors.password.message}
              </span>
            )}
          </label>

          <button
            type="submit"
            disabled={isSubmitting || loginStep !== "IDLE" || turnstilePending}
            className="wg-glass wg-pressable min-h-12 w-full rounded-2xl inline-flex items-center justify-center gap-2 text-sm font-semibold text-gray-800 dark:text-white/78 disabled:opacity-50"
          >
            {loginStep === "VERIFYING" && <Loader2 size={16} className="animate-spin" />}
            <span>{m.login_submit()}</span>
          </button>
        </form>
      )}

      <div className="space-y-5">
        {isEmailConfigured && (
          <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-white/28">
            <span className="h-px flex-1 bg-white/45 dark:bg-white/10" />
            <span>{m.login_or()}</span>
            <span className="h-px flex-1 bg-white/45 dark:bg-white/10" />
          </div>
        )}
        <button
          type="button"
          onClick={socialLogin.handleGithubLogin}
          disabled={socialLogin.isLoading}
          className="wg-glass-subtle wg-pressable min-h-12 w-full rounded-2xl inline-flex items-center justify-center gap-3 text-sm text-gray-700 dark:text-white/68 disabled:opacity-50"
        >
          {socialLogin.isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <GithubIcon size={16} strokeWidth={1.7} />
          )}
          <span>
            {socialLogin.isLoading ? m.login_social_connecting() : m.login_github()}
          </span>
        </button>
      </div>

      {turnstileElement}

      {isEmailConfigured && (
        <p className="text-center text-sm text-gray-500 dark:text-white/42">
          {m.login_no_account()}{" "}
          <Link to="/register" className="text-gray-900 dark:text-white hover:opacity-70">
            {m.login_register_now()}
          </Link>
        </p>
      )}
    </div>
  );
}
