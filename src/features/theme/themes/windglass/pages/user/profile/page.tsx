import { Link } from "@tanstack/react-router";
import { Loader2, LogOut, Shield, User } from "lucide-react";
import type { ReactNode } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import type { ProfilePageProps } from "@/features/theme/contract/pages";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";

export function ProfilePage({
  user,
  profileForm,
  passwordForm,
  notification,
  logout,
}: ProfilePageProps) {
  return (
    <div className="wg-shell">
      <header className="mb-8 md:mb-12 space-y-5">
        <p className="wg-kicker">{m.profile_settings()}</p>
        <h1 className="wg-heading text-4xl md:text-6xl tracking-tight">
          {m.profile_settings()}
        </h1>
        <p className="max-w-2xl text-base md:text-lg text-gray-600/85 dark:text-white/55 leading-relaxed">
          {m.profile_settings_desc()}
        </p>
      </header>

      <section className="wg-glass-card rounded-[2rem] p-5 md:p-7 mb-6 flex items-center gap-5">
        <div
          className="w-20 h-20 rounded-3xl wg-glass-subtle overflow-hidden flex items-center justify-center"
          style={{ viewTransitionName: "user-avatar" }}
        >
          {user.image ? (
            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <User size={28} className="text-gray-500 dark:text-white/45" />
          )}
        </div>
        <div className="min-w-0">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white/86 truncate">
            {user.name}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-white/42 truncate">
            {user.email}
          </p>
          <span className="mt-3 wg-glass-subtle rounded-full px-3 py-1 inline-flex text-xs text-gray-600 dark:text-white/48">
            {user.role === "admin" ? m.profile_role_admin() : m.profile_role_reader()}
          </span>
        </div>
      </section>

      <div className="space-y-6">
        <section className="wg-glass-card rounded-[2rem] p-5 md:p-7">
          <h2 className="mb-5 text-lg font-semibold text-gray-900 dark:text-white/84">
            {m.profile_basic_info()}
          </h2>
          <form onSubmit={profileForm.handleSubmit} className="space-y-5">
            <label className="block space-y-2">
              <span className="wg-kicker">{m.profile_name()}</span>
              <Input
                {...profileForm.register("name")}
                className="wg-field h-12 px-4 shadow-none"
              />
              {profileForm.errors.name && (
                <span className="text-xs text-red-600 dark:text-red-300">
                  {profileForm.errors.name.message}
                </span>
              )}
            </label>
            <label className="block space-y-2">
              <span className="wg-kicker">{m.profile_avatar_url()}</span>
              <Input
                {...profileForm.register("image")}
                className="wg-field h-12 px-4 shadow-none font-mono text-sm"
                placeholder="https://..."
              />
              {profileForm.errors.image && (
                <span className="text-xs text-red-600 dark:text-red-300">
                  {profileForm.errors.image.message}
                </span>
              )}
            </label>
            <GlassButton type="submit" disabled={profileForm.isSubmitting}>
              {profileForm.isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {m.profile_save_changes()}
            </GlassButton>
          </form>
        </section>

        {notification.available && (
          <section className="wg-glass-card rounded-[2rem] p-5 md:p-7">
            <h2 className="mb-5 text-lg font-semibold text-gray-900 dark:text-white/84">
              {m.profile_preferences()}
            </h2>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-white/72">
                  {m.profile_email_notify()}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-white/38">
                  {m.profile_email_notify_desc()}
                </p>
              </div>
              <button
                type="button"
                disabled={notification.isLoading || notification.isPending}
                onClick={notification.toggle}
                className={cn(
                  "wg-glass-subtle wg-pressable min-h-10 rounded-full px-4 text-xs disabled:opacity-50",
                  notification.enabled
                    ? "text-emerald-700 dark:text-emerald-200"
                    : "text-gray-600 dark:text-white/48",
                )}
              >
                {notification.enabled
                  ? m.profile_notify_enabled()
                  : m.profile_notify_disabled()}
              </button>
            </div>
          </section>
        )}

        {passwordForm && (
          <section className="wg-glass-card rounded-[2rem] p-5 md:p-7">
            <h2 className="mb-5 text-lg font-semibold text-gray-900 dark:text-white/84 inline-flex items-center gap-2">
              <Shield size={18} />
              {m.profile_security_settings()}
            </h2>
            <form onSubmit={passwordForm.handleSubmit} className="space-y-5">
              <PasswordField
                label={m.profile_current_password()}
                register={passwordForm.register("currentPassword")}
                error={passwordForm.errors.currentPassword?.message}
              />
              <PasswordField
                label={m.profile_new_password()}
                register={passwordForm.register("newPassword")}
                error={passwordForm.errors.newPassword?.message}
              />
              <PasswordField
                label={m.profile_confirm_password()}
                register={passwordForm.register("confirmPassword")}
                error={passwordForm.errors.confirmPassword?.message}
              />
              <GlassButton type="submit" disabled={passwordForm.isSubmitting}>
                {passwordForm.isSubmitting && <Loader2 size={16} className="animate-spin" />}
                {m.profile_update_password()}
              </GlassButton>
            </form>
          </section>
        )}

        <section className="wg-glass rounded-3xl p-5 flex flex-wrap items-center gap-3">
          {user.role === "admin" && (
            <Link
              to="/admin"
              className="wg-glass-subtle wg-pressable min-h-10 rounded-full px-4 inline-flex items-center text-sm text-gray-700 dark:text-white/65"
            >
              {m.profile_admin_dashboard()}
            </Link>
          )}
          <button
            type="button"
            onClick={logout}
            className="wg-glass-subtle wg-pressable min-h-10 rounded-full px-4 inline-flex items-center gap-2 text-sm text-red-600 dark:text-red-300"
          >
            <LogOut size={15} />
            {m.profile_logout()}
          </button>
        </section>
      </div>
    </div>
  );
}

function GlassButton({
  type,
  disabled,
  children,
}: {
  type: "submit" | "button";
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className="wg-glass wg-pressable min-h-12 rounded-2xl px-5 inline-flex items-center justify-center gap-2 text-sm font-semibold text-gray-800 dark:text-white/78 disabled:opacity-50"
    >
      {children}
    </button>
  );
}

function PasswordField({
  label,
  register,
  error,
}: {
  label: string;
  register: UseFormRegisterReturn;
  error?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="wg-kicker">{label}</span>
      <Input type="password" {...register} className="wg-field h-12 px-4 shadow-none" />
      {error && <span className="text-xs text-red-600 dark:text-red-300">{error}</span>}
    </label>
  );
}
