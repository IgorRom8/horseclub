import { LeadForm } from "@/components/LeadForm";
import { ManagerContactBlock } from "@/components/ManagerContactBlock";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Контакты",
};

const mapSrc =
  process.env.NEXT_PUBLIC_YANDEX_MAP_EMBED ??
  "https://yandex.ru/map-widget/v1/?ll=37.588144%2C55.733842&z=12";

export default function ContactsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-serif text-4xl text-accent">Контакты</h1>
      <p className="mt-3 text-neutral-700">
        Адрес и карта, онлайн-заявка и контакты для связи.
      </p>

      <div className="mt-10 rounded-2xl border border-sand/90 bg-gradient-to-br from-white/95 to-sand/40 p-6 shadow-soft ring-1 ring-black/[0.04] md:p-8">
        <h2 className="font-serif text-2xl font-semibold text-accent">Заявка на сайте</h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-700">
          Имя и телефон обязательны. Дату и комментарий можно указать по желанию — ответ по телефону.
        </p>
        <LeadForm className="mt-6" />
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-sand bg-sand">
        <iframe
          title="Карта"
          src={mapSrc}
          width="100%"
          height="420"
          className="min-h-[320px] w-full border-0"
          allowFullScreen
        />
      </div>

      <address className="mt-8 not-italic text-neutral-800">
        <p className="font-medium">Адрес (замените в переменных окружения / контенте)</p>
        <p className="mt-2 text-sm text-neutral-600">
          Московская область, ориентир — подставьте точный адрес клуба из «almazovo»/вашего договора.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <a
            className="text-accent underline-offset-4 hover:underline"
            href={process.env.NEXT_PUBLIC_WA_LINK ?? "#"}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
          <a
            className="text-accent underline-offset-4 hover:underline"
            href={process.env.NEXT_PUBLIC_TG_LINK ?? "#"}
            target="_blank"
            rel="noreferrer"
          >
            Telegram
          </a>
        </div>
      </address>

      <ManagerContactBlock className="mt-12" />
    </div>
  );
}
