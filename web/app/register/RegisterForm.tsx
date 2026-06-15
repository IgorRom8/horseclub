"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AuthFormShell } from "@/components/auth/AuthFormShell";
import { useAuth } from "@/components/auth/AuthProvider";

export function RegisterForm() {
  const router = useRouter();
  const { register, user, ready } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ready && user) router.replace("/account");
  }, [ready, user, router]);

  if (ready && user) {
    return <div className="py-20 text-center text-sm text-neutral-500">Переход…</div>;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    if (password !== confirm) {
      setMsg("Пароли не совпадают");
      return;
    }
    setLoading(true);
    const r = register(username, password);
    setLoading(false);
    if (!r.ok) {
      setMsg(r.error);
      return;
    }
    router.replace("/account");
  }

  return (
    <AuthFormShell
      title="Регистрация"
      subtitle="Создайте локальный аккаунт — он сохранится только в этом браузере."
      altHref="/login"
      altLabel="Уже есть аккаунт? Войти"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {msg ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{msg}</p> : null}
        <label className="block text-sm font-medium text-neutral-700">
          Логин
          <input
            className="mt-1 w-full rounded-lg border border-sand px-3 py-2 text-neutral-900"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
          />
        </label>
        <label className="block text-sm font-medium text-neutral-700">
          Пароль
          <input
            type="password"
            className="mt-1 w-full rounded-lg border border-sand px-3 py-2 text-neutral-900"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={4}
          />
        </label>
        <label className="block text-sm font-medium text-neutral-700">
          Повтор пароля
          <input
            type="password"
            className="mt-1 w-full rounded-lg border border-sand px-3 py-2 text-neutral-900"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={4}
          />
        </label>
        <button
          type="submit"
          disabled={loading || !ready}
          className="w-full rounded-full bg-accent py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Создание…" : "Зарегистрироваться"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        <Link href="/" className="text-neutral-500 hover:text-accent">
          ← На главную
        </Link>
      </p>
    </AuthFormShell>
  );
}
