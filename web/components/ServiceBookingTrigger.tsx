"use client";

import { useCallback, useId, useState } from "react";
import { LeadForm } from "@/components/LeadForm";

type ServiceKey = "postoy" | "trenirovki" | "kormlenie";

type Props = {
  serviceSlug: ServiceKey;
  serviceTitle: string;
};

export function ServiceBookingTrigger({ serviceSlug, serviceTitle }: Props) {
  const dialogId = useId();
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-8 inline-flex items-center rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-accent-dark motion-safe:hover:-translate-y-0.5"
      >
        Записаться — выберите дату
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-4 sm:items-center"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div
            role="dialog"
            aria-labelledby={dialogId}
            className="max-h-[min(90vh,640px)] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/70 bg-[#fdfaf5] p-6 shadow-lift ring-1 ring-black/10"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 id={dialogId} className="font-serif text-xl font-semibold text-accent">
                Запись на услугу
              </h3>
              <button
                type="button"
                onClick={close}
                aria-label="Закрыть"
                className="rounded-full px-2 py-1 text-2xl leading-none text-neutral-500 transition hover:bg-sand hover:text-ink"
              >
                ×
              </button>
            </div>
            <LeadForm
              serviceSlug={serviceSlug}
              serviceTitle={serviceTitle}
              requirePreferredDate
              className="mt-6"
              onSuccess={close}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
