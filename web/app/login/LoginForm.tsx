"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { AuthFormShell } from "@/components/auth/AuthFormShell";
import { useAuth } from "@/components/auth/AuthProvider";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user, ready } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const next = searchParams.get("next") || "/account";

  useEffect(() => {
    if (ready && user) router.replace(next);
  }, [ready, user, router, next]);

  if (ready && user) {
    return <div className="py-20 text-center text-sm text-neutral-500">Переход…</div>;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    const r = login(username, password);
    setLoading(false);
    if (!r.ok) {
      setMsg(r.error);
      return;
    }
    router.replace(next);
  }

  return (
    <AuthFormShell
      title="Вход"
      subtitle="Войдите в аккаунт, созданный на этом компьютере."
      altHref="/register"
      altLabel="Нет аккаунта? Зарегистрироваться"
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
          />
        </label>
        <label className="block text-sm font-medium text-neutral-700">
          Пароль
          <input
            type="password"
            className="mt-1 w-full rounded-lg border border-sand px-3 py-2 text-neutral-900"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button
          type="submit"
          disabled={loading || !ready}
          className="w-full rounded-full bg-accent py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Вход…" : "Войти"}
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
