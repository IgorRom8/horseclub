"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { LeadForm } from "@/components/LeadForm";
import {
  formatLeadDate,
  formatPhoneDisplay,
  formatPreferredDate,
  getLocalLeadsForUser,
  LEAD_STATUS_LABELS,
  LEADS_UPDATED_EVENT,
  serviceLabel,
  type LocalLead,
} from "@/lib/localLeads";

function statusClass(status: LocalLead["status"]): string {
  switch (status) {
    case "in_progress":
      return "bg-amber-50 text-amber-900 ring-amber-200/80";
    case "done":
      return "bg-emerald-50 text-emerald-900 ring-emerald-200/80";
    default:
      return "bg-sand/80 text-accent ring-sand";
  }
}

function LeadCard({ lead }: { lead: LocalLead }) {
  const svc = serviceLabel(lead.serviceSlug, lead.serviceTitle);
  const pref = formatPreferredDate(lead.preferredDate);

  return (
    <article className="rounded-2xl border border-sand/90 bg-white p-5 shadow-soft ring-1 ring-black/[0.03] transition hover:shadow-lift md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            {formatLeadDate(lead.createdAt)}
          </p>
          <h3 className="mt-1 font-serif text-lg font-semibold text-ink">{lead.name}</h3>
        </div>
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusClass(lead.status)}`}
        >
          {LEAD_STATUS_LABELS[lead.status]}
        </span>
      </div>

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">Телефон</dt>
          <dd className="mt-0.5 font-medium text-neutral-900">{formatPhoneDisplay(lead.phone)}</dd>
        </div>
        {svc ? (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">Услуга</dt>
            <dd className="mt-0.5 font-medium text-neutral-900">{svc}</dd>
          </div>
        ) : null}
        {pref ? (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">Желаемая дата</dt>
            <dd className="mt-0.5 font-medium text-neutral-900">{pref}</dd>
          </div>
        ) : null}
      </dl>

      {lead.message ? (
        <div className="mt-4 rounded-xl bg-[#faf8f5] px-4 py-3 text-sm leading-relaxed text-neutral-700">
          {lead.message}
        </div>
      ) : null}
    </article>
  );
}

export function AccountPanel() {
  const router = useRouter();
  const { user, ready, logout } = useAuth();
  const [leads, setLeads] = useState<LocalLead[]>([]);

  const reloadLeads = useCallback(() => {
    if (user) setLeads(getLocalLeadsForUser(user.userId));
  }, [user]);

  useEffect(() => {
    if (ready && !user) {
      router.replace("/login?next=/account");
    }
  }, [ready, user, router]);

  useEffect(() => {
    reloadLeads();
  }, [reloadLeads]);

  useEffect(() => {
    const onUpdate = () => reloadLeads();
    window.addEventListener(LEADS_UPDATED_EVENT, onUpdate);
    return () => window.removeEventListener(LEADS_UPDATED_EVENT, onUpdate);
  }, [reloadLeads]);

  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-neutral-500">
        Загрузка…
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="pb-16">
      <section className="border-b border-sand/80 bg-gradient-to-br from-sand/50 via-white to-[#faf8f5]">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent/80">Личный кабинет</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            Здравствуйте, {user.username}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-600 md:text-base">
            Здесь ваши заявки с сайта. Они сохраняются в этом браузере — менеджер свяжется с вами по указанному
            телефону.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[minmax(0,17rem)_1fr] lg:gap-12">
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-sand/90 bg-white p-5 shadow-soft ring-1 ring-black/[0.03]">
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Профиль</p>
            <p className="mt-2 font-serif text-xl font-semibold text-accent">{user.username}</p>
            <p className="mt-1 text-xs text-neutral-500">
              Вход: {new Date(user.loggedInAt).toLocaleString("ru-RU")}
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <Link
                href="/"
                className="rounded-xl border border-sand bg-[#fdfcfa] px-4 py-2.5 text-center text-sm font-medium text-neutral-800 transition hover:border-accent/30 hover:bg-sand/40"
              >
                На главную
              </Link>
              <Link
                href="/kontakty"
                className="rounded-xl bg-accent px-4 py-2.5 text-center text-sm font-semibold text-white shadow-soft transition hover:bg-accent-dark"
              >
                Новая заявка
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.replace("/");
                }}
                className="rounded-xl border border-transparent px-4 py-2.5 text-sm font-medium text-neutral-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
              >
                Выйти
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-sand/70 bg-sand/30 px-4 py-3 text-xs leading-relaxed text-neutral-600">
            <strong className="font-semibold text-neutral-800">{leads.length}</strong>{" "}
            {leads.length === 1 ? "заявка" : leads.length >= 2 && leads.length <= 4 ? "заявки" : "заявок"} в истории
          </div>
        </aside>

        <section>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-accent md:text-3xl">Мои заявки</h2>
              <p className="mt-1 text-sm text-neutral-600">От новых к старым</p>
            </div>
          </div>

          {leads.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-sand bg-gradient-to-br from-white to-sand/20 px-6 py-14 text-center shadow-inner">
              <p className="font-serif text-xl font-semibold text-ink">Заявок пока нет</p>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-neutral-600">
                Отправьте форму на главной, на странице услуг или в контактах — будучи авторизованным, вы увидите её
                здесь.
              </p>
              <Link
                href="/#lead"
                className="mt-6 inline-flex rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-accent-dark"
              >
                Оставить заявку
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {leads.map((lead) => (
                <li key={lead.id}>
                  <LeadCard lead={lead} />
                </li>
              ))}
            </ul>
          )}

          <div className="mt-12 rounded-2xl border border-sand/90 bg-gradient-to-br from-white to-sand/25 p-6 shadow-soft md:p-8">
            <h2 className="font-serif text-xl font-semibold text-accent md:text-2xl">Новая заявка</h2>
            <p className="mt-2 text-sm text-neutral-600">
              Заполните форму — она сразу появится в списке выше.
            </p>
            <LeadForm className="mt-6" />
          </div>
        </section>
      </div>
    </div>
  );
}
