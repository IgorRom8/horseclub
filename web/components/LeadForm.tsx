"use client";

import { createPortal } from "react-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { addLocalLead } from "@/lib/localLeads";
export type LeadFormProps = {
  /** Запись по конкретной услуге */
  serviceSlug?: "postoy" | "trenirovki" | "kormlenie";
  serviceTitle?: string;
  /** Если true и есть serviceSlug — дата обязательна (правило сервера) */
  requirePreferredDate?: boolean;
  className?: string;
  /** После успешной отправки — когда пользователь закроет окно-подтверждение */
  onSuccess?: () => void;
};

function todayInputMin(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function LeadForm({
  serviceSlug,
  serviceTitle,
  requirePreferredDate = false,
  className,
  onSuccess,
}: LeadFormProps) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [errText, setErrText] = useState("");

  const onSuccessRef = useRef(onSuccess);
  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const minDate = useMemo(() => todayInputMin(), []);

  const needDate = !!(serviceSlug && requirePreferredDate);

  const dismissSuccess = useCallback(() => {
    setStatus("idle");
    onSuccessRef.current?.();
  }, []);

  useEffect(() => {
    if (status !== "ok") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismissSuccess();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [status, dismissSuccess]);

  const submit = useCallback(async () => {
    setErrText("");
    const n = name.trim();
    const p = phone.replace(/\D/g, "");
    if (!n || !p) {
      setErrText("Укажите имя и телефон (в номере только цифры).");
      setStatus("err");
      return;
    }
    if (needDate && !preferredDate) {
      setErrText("Выберите дату.");
      setStatus("err");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: n,
          phone: p,
          message: message.trim() || undefined,
          serviceSlug: serviceSlug ?? undefined,
          preferredDate: preferredDate || undefined,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? `Ошибка ${res.status}`);
      }
      if (user) {
        addLocalLead({
          userId: user.userId,
          name: n,
          phone: p,
          message: message.trim() || undefined,
          serviceSlug: serviceSlug ?? undefined,
          serviceTitle: serviceTitle ?? undefined,
          preferredDate: preferredDate || undefined,
        });
      }
      setStatus("ok");
      setName("");
      setPhone("");
      setMessage("");
      setPreferredDate("");
    } catch (e) {
      setStatus("err");
      setErrText(e instanceof Error ? e.message : "Не удалось отправить");
    }
  }, [name, phone, message, preferredDate, needDate, serviceSlug, serviceTitle, user]);
  return (
    <div className={className}>
      {serviceTitle ? (
        <p className="text-sm font-medium text-accent">
          Услуга: <span className="text-ink">{serviceTitle}</span>
        </p>
      ) : null}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">Имя</span>
          <input
            type="text"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-sand bg-white px-3 py-2 text-sm text-ink shadow-inner outline-none ring-0 transition focus:border-accent focus:ring-2 focus:ring-accent/25"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">Телефон</span>
          <input
            type="tel"
            inputMode="numeric"
            name="phone"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 15))}
            placeholder="Только цифры, например 79991234567"
            className="rounded-xl border border-sand bg-white px-3 py-2 text-sm text-ink shadow-inner outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25"
          />
        </label>
      </div>

      <label className="mt-3 flex flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          Желаемая дата {needDate ? "" : "(по желанию)"}
        </span>
        <input
          type="date"
          min={minDate}
          value={preferredDate}
          onChange={(e) => setPreferredDate(e.target.value)}
          className="w-full max-w-[14rem] rounded-xl border border-sand bg-white px-3 py-2 text-sm text-ink shadow-inner outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25 sm:w-auto"
        />
      </label>

      <label className="mt-3 flex flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">Комментарий</span>
        <textarea
          name="message"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Задачи, время звонка, количество лошадей…"
          className="rounded-xl border border-sand bg-white px-3 py-2 text-sm text-ink shadow-inner outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25"
        />
      </label>

      {errText ? (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {errText}
        </p>
      ) : null}

      <button
        type="button"
        disabled={status === "sending"}
        onClick={submit}
        className="mt-4 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-accent-dark disabled:pointer-events-none disabled:opacity-60"
      >
        {status === "sending" ? "Отправка…" : "Отправить заявку"}
      </button>

      {mounted && status === "ok"
        ? createPortal(
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" role="presentation">
              <div
                className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
                aria-hidden
                onClick={dismissSuccess}
              />
              <div
                className="relative z-[1] w-full max-w-md rounded-2xl border border-accent/25 bg-white px-6 py-6 shadow-2xl ring-1 ring-black/[0.06]"
                role="dialog"
                aria-modal="true"
                aria-labelledby="lead-success-title"
                aria-describedby="lead-success-desc"
              >
                <h2 id="lead-success-title" className="font-serif text-xl font-semibold tracking-tight text-accent">
                  Заявка отправлена
                </h2>
                <p id="lead-success-desc" className="mt-3 text-sm leading-relaxed text-neutral-700">
                  Вам скоро перезвонит менеджер.
                  {user ? (
                    <>
                      {" "}
                      <a href="/account" className="font-medium text-accent underline-offset-2 hover:underline">
                        Смотреть в личном кабинете
                      </a>
                      .
                    </>
                  ) : null}
                </p>
                <button
                  type="button"
                  onClick={dismissSuccess}
                  className="mt-6 w-full rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-accent-dark"
                >
                  Понятно
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
