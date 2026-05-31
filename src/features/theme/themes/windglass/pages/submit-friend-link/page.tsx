import { ClientOnly, Link } from "@tanstack/react-router";
import { ExternalLink, Loader2, MoveLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Turnstile } from "@/components/common/turnstile";
import { Input } from "@/components/ui/input";
import type { SubmitFriendLinkPageProps } from "@/features/theme/contract/pages";
import { formatDate } from "@/lib/utils";
import { m } from "@/paraglide/messages";

export function SubmitFriendLinkPage({ myLinks, form }: SubmitFriendLinkPageProps) {
  const { register, errors, handleSubmit, isSubmitting, turnstileProps } = form;

  return (
    <div className="wg-shell">
      <header className="mb-8 md:mb-12 space-y-5">
        <Link
          to="/friend-links"
          className="wg-glass-subtle wg-pressable min-h-10 rounded-full px-4 inline-flex items-center gap-2 text-sm text-gray-600 dark:text-white/55 hover:text-gray-950 dark:hover:text-white"
        >
          <MoveLeft size={15} />
          <span>{m.friend_links_title()}</span>
        </Link>
        <p className="wg-kicker">{m.friend_link_submit_form_title()}</p>
        <h1 className="wg-heading text-4xl md:text-6xl tracking-tight">
          {m.friend_links_apply()}
        </h1>
        <p className="max-w-2xl text-base md:text-lg text-gray-600/85 dark:text-white/55 leading-relaxed">
          {m.friend_link_submit_desc()}
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="wg-glass-card rounded-[2rem] p-5 md:p-7 space-y-5"
      >
        <Turnstile {...turnstileProps} />
        <Field
          label={m.friend_link_field_site_name()}
          error={errors.siteName?.message}
        >
          <Input
            {...register("siteName")}
            className="wg-field h-12 px-4 shadow-none"
            placeholder={m.friend_link_placeholder_site_name_default()}
          />
        </Field>
        <Field
          label={m.friend_link_field_site_url()}
          error={errors.siteUrl?.message}
        >
          <Input
            {...register("siteUrl")}
            className="wg-field h-12 px-4 shadow-none font-mono text-sm"
            placeholder={m.friend_link_placeholder_site_url()}
          />
        </Field>
        <Field
          label={m.friend_link_field_description_default()}
          error={errors.description?.message}
        >
          <Input
            {...register("description")}
            className="wg-field h-12 px-4 shadow-none"
            placeholder={m.friend_link_placeholder_description_default()}
          />
        </Field>
        <Field
          label={m.friend_link_field_logo_url_default()}
          error={errors.logoUrl?.message}
        >
          <Input
            {...register("logoUrl")}
            className="wg-field h-12 px-4 shadow-none font-mono text-sm"
            placeholder={m.friend_link_placeholder_site_url()}
          />
        </Field>
        <Field
          label={m.friend_link_field_contact_email()}
          error={errors.contactEmail?.message}
        >
          <Input
            {...register("contactEmail")}
            className="wg-field h-12 px-4 shadow-none font-mono text-sm"
            placeholder={m.friend_link_placeholder_contact_email_default()}
          />
        </Field>

        <button
          type="submit"
          disabled={isSubmitting}
          className="wg-glass wg-pressable min-h-12 w-full rounded-2xl px-5 inline-flex items-center justify-center gap-2 text-sm font-semibold text-gray-800 dark:text-white/78 disabled:opacity-50"
        >
          {isSubmitting && <Loader2 size={16} className="animate-spin" />}
          {isSubmitting
            ? m.friend_link_submitting()
            : m.friend_link_submit_button_default()}
        </button>
      </form>

      {myLinks.length > 0 && (
        <section className="mt-10 space-y-4">
          <h2 className="wg-kicker">{m.friend_link_my_submissions()}</h2>
          {myLinks.map((link) => (
            <div
              key={link.id}
              className="wg-glass-card rounded-3xl p-5 flex items-start justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white/82 truncate">
                    {link.siteName}
                  </h3>
                  <StatusBadge status={link.status} />
                </div>
                <a
                  href={link.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-xs text-gray-500 dark:text-white/42 hover:text-gray-900 dark:hover:text-white inline-flex items-center gap-1 max-w-full"
                >
                  <ExternalLink size={12} className="shrink-0" />
                  <span className="truncate">{link.siteUrl}</span>
                </a>
                {link.rejectionReason && (
                  <p className="mt-2 text-xs text-red-600 dark:text-red-300">
                    {m.friend_link_rejection_reason()}: {link.rejectionReason}
                  </p>
                )}
              </div>
              <span className="shrink-0 text-xs text-gray-400 dark:text-white/32">
                <ClientOnly fallback="-">
                  {formatDate(link.createdAt).split(" ")[0]}
                </ClientOnly>
              </span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="wg-kicker">{label}</span>
      {children}
      {error && <span className="text-xs text-red-600 dark:text-red-300">{error}</span>}
    </label>
  );
}

function StatusBadge({ status }: { status: string }) {
  const labels: Record<string, string> = {
    approved: m.friend_link_status_approved(),
    pending: m.friend_link_status_pending(),
    rejected: m.friend_link_status_rejected(),
  };

  return (
    <span className="wg-glass-subtle rounded-full px-2.5 py-1 text-[10px] uppercase text-gray-600 dark:text-white/50">
      {labels[status] || status}
    </span>
  );
}
