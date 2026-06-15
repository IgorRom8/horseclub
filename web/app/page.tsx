import { ManagerContactBlock } from "@/components/ManagerContactBlock";
import { FadeIn } from "@/components/FadeIn";
import { LeadForm } from "@/components/LeadForm";
import { getResolvedHomeContent } from "@/lib/homePageSettings";
import Link from "next/link";
import Image from "next/image";
import { ServiceTeaser } from "@/components/ServiceTeaser";

/** Иначе главная может закешироваться на build / Full Route Cache и не подхватывать правки из админки. */
export const dynamic = "force-dynamic";

const city = process.env.NEXT_PUBLIC_CLUB_CITY ?? "Подмосковье";

export default async function HomePage() {
  const { images: IMG, texts: t } = await getResolvedHomeContent();

  return (
    <>
      <section
        suppressHydrationWarning
        className="relative h-[min(72vh,540px)] w-full overflow-hidden bg-sand"
      >
        <Image
          src={IMG.hero}
          alt="Главное фото конного клуба"
          fill
          priority
          className="object-cover opacity-0 motion-safe:animate-hero-reveal motion-safe:saturate-[1.05]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/35 to-accent-dark/45 opacity-0 motion-safe:animate-fade-in motion-safe:animate-delay-100" />
        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center gap-5 px-4 py-10">
          <p className="max-w-xl font-medium uppercase tracking-[0.2em] text-white/80 opacity-0 motion-safe:animate-fade-up motion-safe:animate-delay-200">
            {t.heroEyebrow}
          </p>
          <h1 className="break-words font-serif text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.1] tracking-tight text-white opacity-0 motion-safe:animate-fade-up motion-safe:animate-delay-300">
            Конный клуб в {city}
          </h1>
          <div className="h-px max-w-[4.5rem] origin-left bg-gradient-to-r from-white to-white/40 motion-safe:animate-line-grow motion-safe:animate-delay-450" />
          <p className="max-w-xl text-lg font-medium leading-relaxed text-white drop-shadow-[0_2px_12px_rgb(0_0_0/0.85)] opacity-0 motion-safe:animate-fade-up motion-safe:animate-delay-600">
            {t.heroSubtitle}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <FadeIn>
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-accent md:text-4xl">{t.servicesTitle}</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-neutral-600">{t.servicesIntro}</p>
        </FadeIn>
        <div className="mt-10 grid gap-7 md:grid-cols-3">
          <FadeIn delay={0}>
            <ServiceTeaser
              title="Постой"
              description="Денник, кормление по графику, выгул, зона хранения снаряжения."
              imageSrc={IMG.servicePostoy}
              imageAlt="Постой лошади"
              href="/uslugi#postoy"
            />
          </FadeIn>
          <FadeIn delay={75}>
            <ServiceTeaser
              title="Тренировки"
              description="Индивидуальные и групповые занятия в крытом манеже и на плацу."
              imageSrc={IMG.serviceTrain}
              imageAlt="Тренировки"
              href="/uslugi#trenirovki"
            />
          </FadeIn>
          <FadeIn delay={150}>
            <ServiceTeaser
              title="Кормление"
              description="Сено, комбикорм, добавки — по согласованному рациону."
              imageSrc={IMG.serviceFeed}
              imageAlt="Кормление"
              href="/uslugi#kormlenie"
            />
          </FadeIn>
        </div>
      </section>

      <section className="relative border-y border-sand/90 bg-gradient-to-br from-sand/90 via-[#faf6ef] to-sand shadow-inner">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-70" />
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2 md:items-center md:gap-12">
          <FadeIn>
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-accent md:text-4xl">{t.infraTitle}</h2>
            <ul className="mt-8 space-y-7 text-neutral-800">
              <li className="flex gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-xl font-semibold text-accent shadow-soft motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:scale-105">
                  15
                </span>
                <div>
                  <p className="font-semibold text-ink">денников на базе</p>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                    Подготовленные боксы с системой содержания.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex h-[3.25rem] min-w-[3.25rem] shrink-0 items-center justify-center rounded-full bg-white px-1 text-center text-xs font-semibold leading-tight text-accent shadow-soft motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:scale-105">
                  20×60&nbsp;м
                </span>
                <div>
                  <p className="font-semibold text-ink">крытый манеж</p>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-600">Работа в любую погоду.</p>
                </div>
              </li>
            </ul>
            <Link
              href="/infrastruktura"
              className="mt-10 inline-flex items-center justify-center rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white shadow-soft transition duration-300 hover:bg-accent-dark hover:shadow-lift motion-safe:hover:-translate-y-0.5"
            >
              Смотреть объекты
            </Link>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/70 bg-white shadow-lift ring-1 ring-black/5">
              <Image
                src={IMG.infrastructureAside}
                alt="Инфраструктура конюшни"
                fill
                className="object-cover transition duration-[800ms] ease-smooth motion-safe:group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 420px"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-6xl border-t border-sand/70 px-4 py-16 md:py-20" id="lead">
        <FadeIn>
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-accent md:text-4xl">{t.leadTitle}</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-neutral-700">{t.leadIntro}</p>
          <div className="mt-8 rounded-2xl border border-sand/90 bg-white/80 p-6 shadow-soft ring-1 ring-black/[0.04] backdrop-blur-sm md:p-8">
            <LeadForm />
          </div>
        </FadeIn>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <FadeIn>
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-accent md:text-4xl">{t.managerTitle}</h2>
          <ManagerContactBlock className="mt-8" initialCallbackOpen />
        </FadeIn>
      </section>
    </>
  );
}
