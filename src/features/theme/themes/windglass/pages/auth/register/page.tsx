import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { RegisterPageProps } from "@/features/theme/contract/pages";
import { m } from "@/paraglide/messages";

export function RegisterPage({ registerForm, turnstileElement }: RegisterPageProps) {
  const { register, errors, handleSubmit, isSubmitting, isSuccess, turnstilePending } =
    registerForm;

  if (isSuccess) {
    return (
      <div className="text-center space-y-7">
        <p className="wg-kicker">{m.register_success_label()}</p>
        <h1 className="wg-heading text-3xl tracking-tight">
          {m.register_success_title()}
        </h1>
        <p className="text-sm leading-relaxed text-gray-500 dark:text-white/45">
          {m.register_success_desc()}
        </p>
        <Link
          to="/login"
          className="wg-glass-subtle wg-pressable min-h-12 w-full rounded-2xl inline-flex items-center justify-center text-sm text-gray-700 dark:text-white/68"
        >
          {m.register_back_to_login()}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="text-center space-y-3">
        <p className="wg-kicker">{m.register_label()}</p>
        <h1 className="wg-heading text-3xl tracking-tight">{m.register_title()}</h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block space-y-2">
          <span className="wg-kicker">{m.register_nickname()}</span>
          <Input {...register("name")} className="wg-field h-12 px-4 shadow-none" />
          {errors.name && (
            <span className="text-xs text-red-600 dark:text-red-300">
              {errors.name.message}
            </span>
          )}
        </label>

        <label className="block space-y-2">
          <span className="wg-kicker">{m.login_email_address()}</span>
          <Input
            type="email"
            {...register("email")}
            className="wg-field h-12 px-4 shadow-none"
            autoComplete="email"
          />
          {errors.email && (
            <span className="text-xs text-red-600 dark:text-red-300">
              {errors.email.message}
            </span>
          )}
        </label>

        <label className="block space-y-2">
          <span className="wg-kicker">{m.register_password()}</span>
          <Input
            type="password"
            {...register("password")}
            className="wg-field h-12 px-4 shadow-none"
            autoComplete="new-password"
          />
          {errors.password && (
            <span className="text-xs text-red-600 dark:text-red-300">
              {errors.password.message}
            </span>
          )}
        </label>

        <label className="block space-y-2">
          <span className="wg-kicker">{m.register_confirm_password()}</span>
          <Input
            type="password"
            {...register("confirmPassword")}
            className="wg-field h-12 px-4 shadow-none"
            autoComplete="new-password"
          />
          {errors.confirmPassword && (
            <span className="text-xs text-red-600 dark:text-red-300">
              {errors.confirmPassword.message}
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
          {m.register_submit()}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 dark:text-white/42">
        {m.register_have_account()}{" "}
        <Link to="/login" className="text-gray-900 dark:text-white hover:opacity-70">
          {m.register_go_to_login()}
        </Link>
      </p>
    </div>
  );
}
