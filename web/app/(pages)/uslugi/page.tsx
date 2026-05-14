import { FadeIn } from "@/components/FadeIn";
import { ManagerContactBlock } from "@/components/ManagerContactBlock";
import { RegularImageBlock } from "@/components/RegularImageBlock";
import { ServiceBookingTrigger } from "@/components/ServiceBookingTrigger";
import { siteImages } from "@/lib/siteImages";

const blocks = [
  {
    id: "postoy" as const,
    title: "Постой",
    price: "от 950 ₽ / сутки (уточняйте по запросу)",
    lines: [
      "Денник 3×3,5 м (резина/опилки по сезону).",
      "Кормление — 3 раза в день.",
      "Выгул в леваде по графику.",
      "Хранение снаряжения в амуничнике (маркировка).",
    ],
    img: siteImages.servicePostoy,
  },
  {
    id: "trenirovki" as const,
    title: "Тренировки",
    price: "по запросу",
    lines: [
      "Индивидуально — программа под уровень всадника и задачи лошади.",
      "Группы — малая численность, расписание по согласованию.",
      "С тренером — только с инструктором базы до допуска к самостоятельной работе.",
    ],
    img: siteImages.serviceTrain,
  },
  {
    id: "kormlenie" as const,
    title: "Кормление",
    price: "входит в постой / отдельный тариф",
    lines: [
      "Рацион согласуется с ветеринаром и тренером.",
      "Сено луговое, комбикорм по норме.",
      "Добавки (витамины, масла) — опционально.",
    ],
    img: siteImages.serviceFeed,
  },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <FadeIn>
        <h1 className="font-serif text-4xl text-accent">Услуги</h1>
        <p className="mt-3 max-w-2xl text-neutral-700">
          Три независимых блока: постой, тренировки, кормление. Цены — ориентир; актуальные условия — у менеджера.
        </p>
      </FadeIn>

      <div className="mt-14 space-y-20">
        {blocks.map((b, idx) => (
          <FadeIn key={b.id} delay={idx * 80}>
            <section id={b.id} className="grid gap-8 md:grid-cols-2 md:items-start">
              <div className={idx % 2 === 1 ? "md:order-2" : ""}>
                <h2 className="font-serif text-3xl text-accent">{b.title}</h2>
                <p className="mt-2 text-sm uppercase tracking-wide text-neutral-500">{b.price}</p>
                <ul className="mt-6 list-disc space-y-2 pl-5 text-neutral-800">
                  {b.lines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <ServiceBookingTrigger serviceSlug={b.id} serviceTitle={b.title} />
              </div>
              <div className={idx % 2 === 1 ? "md:order-1" : ""}>
                <RegularImageBlock src={b.img} alt={b.title} caption={b.title} />
              </div>
            </section>
          </FadeIn>
        ))}
      </div>

      <FadeIn className="mt-20">
        <ManagerContactBlock />
      </FadeIn>
    </div>
  );
}
