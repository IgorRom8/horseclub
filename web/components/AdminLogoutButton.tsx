"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={() => void logout()}
      disabled={loading}
      className="rounded-full border border-sand px-3 py-1 text-xs font-medium text-neutral-700 hover:bg-sand/50 disabled:opacity-60"
    >
      {loading ? "Выход…" : "Выйти"}
    </button>
  );
}
