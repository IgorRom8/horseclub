import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden border-t border-accent/10 bg-gradient-to-b from-sand via-sand to-[#ebe4d8] shadow-[inset_0_1px_0_rgb(255_255_255/0.5)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/25 to-transparent" />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 text-sm text-neutral-700 sm:grid-cols-2">
        <div>
          <p className="font-serif text-2xl font-semibold tracking-tight text-accent">Конный клуб</p>
          <p className="mt-3 leading-relaxed text-neutral-600">
            Постой, тренировки, инфраструктура. Информация без рекламных блоков.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Link className="w-fit font-medium transition-colors duration-300 hover:text-accent" href="/trenery">
            Тренеры
          </Link>
          <Link className="w-fit font-medium transition-colors duration-300 hover:text-accent" href="/pravila-i-tb">
            Правила и техника безопасности
          </Link>
          <Link className="w-fit font-medium transition-colors duration-300 hover:text-accent" href="/kontakty">
            Контакты
          </Link>
        </div>
      </div>
      <div className="border-t border-white/40 py-4 text-center text-xs text-neutral-500">
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> Конный клуб
      </div>
    </footer>
  );
}
