import Link from "next/link";

import { AdminLogoutButton } from "@/components/AdminLogoutButton";

export default function AdminPrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf8f5] to-sand/30">
      <header className="sticky top-0 z-10 border-b border-sand/90 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-3 px-4 py-3">
          <span className="font-serif text-lg font-semibold text-accent">Админ-сайт</span>
          <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-700">
            <Link href="/admin/dashboard" className="hover:text-accent">
              Обзор
            </Link>
            <Link href="/admin/home" className="hover:text-accent">
              Главная
            </Link>
            <Link href="/admin/pages" className="hover:text-accent">
              Страницы
            </Link>
            <Link href="/admin/gallery" className="hover:text-accent">
              Конюшни
            </Link>
            <Link href="/" className="text-neutral-500 hover:text-accent">
              На сайт
            </Link>
          </nav>
          <div className="ml-auto">
            <AdminLogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
    </div>
  );
}
