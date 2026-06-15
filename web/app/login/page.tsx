import { Suspense } from "react";

import { LoginForm } from "./LoginForm";

export const metadata = {
  title: "Вход",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-neutral-500">Загрузка…</div>}>
      <LoginForm />
    </Suspense>
  );
}
