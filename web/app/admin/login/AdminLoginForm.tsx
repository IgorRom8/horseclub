"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = { configError: boolean };

export function AdminLoginForm({ configError }: Props) {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const j = (await r.json().catch(() => ({}))) as { error?: string };
    setLoading(false);
    if (!r.ok) {
      setMsg(j.error || "Ошибка входа");
      return;
    }
    router.replace("/admin/dashboard");
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto w-full max-w-sm space-y-4 rounded-xl border border-sand/90 bg-white p-8 shadow-soft ring-1 ring-black/[0.04]"
    >
      <h1 className="font-serif text-2xl text-accent">Вход администратора</h1>
      {configError ? (
        <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
          В production задайте <code className="text-xs">ADMIN_SESSION_SECRET</code> в переменных окружения.
        </p>
      ) : (
        <p className="text-xs text-neutral-500">
          По умолчанию: логин <strong className="font-medium text-neutral-700">admin</strong>, пароль{" "}
          <strong className="font-medium text-neutral-700">123456</strong> (смените через{" "}
          <code className="text-[11px]">ADMIN_USERNAME</code> / <code className="text-[11px]">ADMIN_PASSWORD</code>).
        </p>
      )}
      {msg ? <p className="text-sm text-red-600">{msg}</p> : null}
      <label className="block text-sm font-medium text-neutral-700">
        Логин
        <input
          name="username"
          autoComplete="username"
          className="mt-1 w-full rounded-lg border border-sand px-3 py-2 text-neutral-900"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label className="block text-sm font-medium text-neutral-700">
        Пароль
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          className="mt-1 w-full rounded-lg border border-sand px-3 py-2 text-neutral-900"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-accent py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading ? "Вход…" : "Войти"}
      </button>
    </form>
  );
}
