import Link from "next/link";

import { AdminLogoutButton } from "@/components/AdminLogoutButton";
import { isAdminOpenAccess } from "@/lib/adminCredentials";

export default async function AdminPrivateLayout({ children }: { children: React.ReactNode }) {
  const open = isAdminOpenAccess();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf8f5] to-sand/30">
      {open ? (
        <div className="border-b border-amber-200/90 bg-amber-50 px-4 py-2.5 text-center text-xs leading-relaxed text-amber-950">
          Панель по умолчанию без пароля (в т.ч. на Vercel). Перед продакшеном защитите:{" "}
          <code className="rounded bg-white/90 px-1 py-0.5">ADMIN_OPEN_ACCESS=false</code> и переменные ADMIN_*.
        </div>
      ) : null}
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
            {open ? (
              <span className="text-xs font-medium text-neutral-500">Без пароля</span>
            ) : (
              <AdminLogoutButton />
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
    </div>
  );
}
