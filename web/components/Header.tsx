"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth/AuthProvider";

const links = [
  { href: "/uslugi", label: "Услуги" },
  { href: "/infrastruktura", label: "Инфраструктура" },
  { href: "/o-nas", label: "О нас" },
  { href: "/trenery", label: "Тренеры" },
  { href: "/konyushni", label: "Конюшни" },
  { href: "/pravila-i-tb", label: "Правила и ТБ" },
  { href: "/kontakty", label: "Контакты" },
] as const;

const desktopLinkClass =
  "relative py-1 text-sm font-medium text-neutral-600 transition-colors duration-300 hover:text-accent " +
  "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:rounded-full after:bg-accent/80 after:transition-transform after:duration-300 after:ease-smooth after:origin-left hover:after:scale-x-100 after:scale-x-0";

const mobileLinkClass =
  "block rounded-xl border border-transparent px-3 py-3 text-base font-medium text-neutral-700 transition-colors hover:border-sand/80 hover:bg-sand/40 hover:text-accent active:bg-sand/55";

function AuthLinks({ mobile }: { mobile?: boolean }) {
  const { user, ready, logout } = useAuth();
  const pathname = usePathname();

  if (!ready) return null;

  const linkClass = mobile
    ? mobileLinkClass
    : "text-sm font-medium text-neutral-600 transition hover:text-accent";

  if (user) {
    return (
      <>
        <Link href="/account" className={linkClass}>
          {user.username}
        </Link>
        <button
          type="button"
          className={mobile ? mobileLinkClass + " w-full text-left" : linkClass}
          onClick={() => {
            logout();
            if (pathname === "/account") window.location.href = "/";
          }}
        >
          Выйти
        </button>
      </>
    );
  }

  return (
    <>
      <Link href="/login" className={linkClass}>
        Вход
      </Link>
      <Link
        href="/register"
        className={
          mobile
            ? mobileLinkClass
            : "rounded-full bg-accent px-3 py-1.5 text-sm font-semibold text-white hover:bg-accent-dark"
        }
      >
        Регистрация
      </Link>
    </>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const hideAuth = pathname.startsWith("/admin");

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header className="relative sticky top-0 z-40 border-b border-sand/70 bg-white/80 shadow-nav backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/72">
      <div className="relative z-[45] mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link
          href="/"
          className="font-serif text-2xl font-semibold tracking-tight text-accent transition-colors duration-300 hover:text-accent-dark"
          onClick={() => setOpen(false)}
        >
          Конный клуб
        </Link>

        <nav className="hidden flex-wrap items-center gap-x-5 gap-y-2 md:flex" aria-label="Основное меню">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={desktopLinkClass}>
              {l.label}
            </Link>
          ))}
          {!hideAuth ? (
            <div className="ml-1 flex items-center gap-3 border-l border-sand/80 pl-4">
              <AuthLinks />
            </div>
          ) : null}
        </nav>

        <button
          type="button"
          className="relative flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-[5px] rounded-xl border border-sand/90 bg-white/90 text-neutral-800 shadow-sm transition hover:border-accent/25 hover:bg-white md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`block h-0.5 w-[22px] rounded-full bg-current transition-transform duration-300 ease-smooth ${open ? "translate-y-[7px] rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-[22px] rounded-full bg-current transition-opacity duration-200 ${open ? "opacity-0" : "opacity-100"}`}
          />
          <span
            className={`block h-0.5 w-[22px] rounded-full bg-current transition-transform duration-300 ease-smooth ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[35] bg-black/25 backdrop-blur-[2px] md:hidden"
            aria-label="Закрыть меню"
            onClick={() => setOpen(false)}
          />
          <nav
            id="mobile-nav"
            className="relative z-[45] border-t border-sand/70 bg-white/95 px-4 py-4 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.12)] backdrop-blur-xl md:hidden"
            aria-label="Мобильное меню"
          >
            <ul className="mx-auto flex max-w-6xl flex-col gap-1">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={mobileLinkClass} onClick={() => setOpen(false)}>
                    {l.label}
                  </Link>
                </li>
              ))}
              {!hideAuth ? (
                <li className="mt-2 border-t border-sand/70 pt-2">
                  <div className="flex flex-col gap-1">
                    <AuthLinks mobile />
                  </div>
                </li>
              ) : null}
            </ul>
          </nav>
        </>
      ) : null}
    </header>
  );
}
