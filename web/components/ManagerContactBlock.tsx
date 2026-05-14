"use client";

import { useState } from "react";

const wa = process.env.NEXT_PUBLIC_WA_LINK?.trim() ?? "";
const tg = process.env.NEXT_PUBLIC_TG_LINK?.trim() ?? "";
const phoneDisplay = process.env.NEXT_PUBLIC_MANAGER_PHONE?.trim() ?? "";

function telHrefFromDisplay(display: string): string {
  let d = display.replace(/\D/g, "");
  if (!d) return "";
  if (d.length === 11 && d.startsWith("8")) d = `7${d.slice(1)}`;
  if (d.length === 10) d = `7${d}`;
  return `tel:+${d}`;
}

type Panel = null | "wa" | "tg" | "phone";

type Props = {
  showCallbackForm?: boolean;
  initialCallbackOpen?: boolean;
  className?: string;
};

export function ManagerContactBlock({
  showCallbackForm = true,
  initialCallbackOpen = false,
  className,
}: Props) {
  const phoneTel = telHrefFromDisplay(phoneDisplay);

  const [panel, setPanel] = useState<Panel>(() =>
    initialCallbackOpen && phoneTel ? "phone" : null,
  );

  const hasWa = Boolean(wa);
  const hasTg = Boolean(tg);
  const hasPhone = Boolean(phoneDisplay && phoneTel);

  function toggle(next: Panel) {
    setPanel((cur) => (cur === next ? null : next));
  }

  const hasAny = hasWa || hasTg || (showCallbackForm && hasPhone);

  return (
    <section
      className={`rounded-2xl border border-sand/90 bg-gradient-to-br from-white/90 via-sand/40 to-[#ebe4d8]/55 p-6 shadow-soft ring-1 ring-black/[0.04] backdrop-blur-sm md:p-8 ${className ?? ""}`}
    >
      <h2 className="font-serif text-2xl font-semibold tracking-tight text-accent md:text-[1.75rem]">Остались вопросы?</h2>
      <p className="mt-2 leading-relaxed text-neutral-700">
        {hasAny
          ? "Свяжитесь с нами через WhatsApp или Telegram либо позвоните по телефону."
          : "Также вы можете оставить заявку через форму на сайте — мы перезвоним или напишем в ответ."}
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        {hasWa ? (
          <button
            type="button"
            onClick={() => toggle("wa")}
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition duration-300 hover:bg-accent-dark hover:shadow-md motion-safe:hover:-translate-y-0.5"
          >
            {panel === "wa" ? "Скрыть WhatsApp" : "WhatsApp"}
          </button>
        ) : null}
        {hasTg ? (
          <button
            type="button"
            onClick={() => toggle("tg")}
            className="rounded-full border border-accent/80 bg-white/60 px-5 py-2.5 text-sm font-semibold text-accent backdrop-blur-sm transition duration-300 hover:border-accent hover:bg-white"
          >
            {panel === "tg" ? "Скрыть Telegram" : "Telegram"}
          </button>
        ) : null}
        {showCallbackForm && hasPhone ? (
          <button
            type="button"
            onClick={() => toggle("phone")}
            className="rounded-full border border-neutral-300 bg-white/50 px-5 py-2.5 text-sm font-medium text-ink backdrop-blur-sm transition duration-300 hover:border-neutral-400 hover:bg-white"
          >
            {panel === "phone" ? "Скрыть номер" : "Звонок"}
          </button>
        ) : null}
      </div>

      {panel === "wa" && hasWa ? (
        <div className="mt-6 rounded-xl border border-white/90 bg-white/95 p-5 shadow-soft ring-1 ring-black/[0.04]">
          <p className="text-sm font-medium text-accent">WhatsApp</p>
          <p className="mt-2 text-sm text-neutral-700">Мы ответим в рабочее время клуба.</p>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-accent-dark"
          >
            Написать в WhatsApp
          </a>
        </div>
      ) : null}

      {panel === "tg" && hasTg ? (
        <div className="mt-6 rounded-xl border border-white/90 bg-white/95 p-5 shadow-soft ring-1 ring-black/[0.04]">
          <p className="text-sm font-medium text-accent">Telegram</p>
          <p className="mt-2 text-sm text-neutral-700">Откроется приложение или веб-клиент.</p>
          <a
            href={tg}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex rounded-full border border-accent/80 bg-white px-5 py-2.5 text-sm font-semibold text-accent transition hover:border-accent hover:bg-sand/30"
          >
            Открыть Telegram
          </a>
        </div>
      ) : null}

      {showCallbackForm && panel === "phone" && hasPhone ? (
        <div className="mt-6 rounded-xl border border-white/90 bg-white/95 p-5 shadow-soft ring-1 ring-black/[0.04]">
          <p className="text-sm font-medium text-accent">Телефон</p>
          <p className="mt-2 text-sm text-neutral-600">Для набора номера:</p>
          <a href={phoneTel} className="mt-2 inline-block font-serif text-2xl font-semibold tracking-wide text-accent underline-offset-4 hover:underline">
            {phoneDisplay}
          </a>
        </div>
      ) : null}
    </section>
  );
}
