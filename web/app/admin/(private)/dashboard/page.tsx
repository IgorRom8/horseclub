import { getAdminSessionSecret, isAdminOpenAccess } from "@/lib/adminCredentials";

export default async function AdminDashboardPage() {
  const hasDb = Boolean(process.env.DATABASE_URL?.trim());
  const sessionConfigured = getAdminSessionSecret() !== null;
  const open = isAdminOpenAccess();

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl text-accent">Панель</h1>
      {!open && !sessionConfigured ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          Задайте <code>ADMIN_SESSION_SECRET</code> в окружении (обязателен в production). Локально в development
          используется встроенный секрет.
        </p>
      ) : null}
      {!hasDb ? (
        <p className="rounded-lg border border-sand bg-white p-4 text-sm text-neutral-700">
          Без <code className="text-xs">DATABASE_URL</code> сохранение текстов и картинок недоступно. Главная и
          внутренние страницы по умолчанию берут данные из кода.
        </p>
      ) : (
        <p className="text-sm text-neutral-600">
          Редактирование сохраняется в PostgreSQL. После первого деплоя выполните{" "}
          <code className="rounded bg-sand/80 px-1 text-xs">npm run db:push</code> и при необходимости{" "}
          <code className="rounded bg-sand/80 px-1 text-xs">npm run db:seed</code>.
        </p>
      )}
      <ul className="list-disc space-y-2 pl-5 text-sm text-neutral-800">
        <li>
          <strong>Главная</strong> — тексты блоков и URL основных изображений (герой, услуги, инфраструктура).
        </li>
        <li>
          <strong>Страницы</strong> — редактор блоков для «Инфраструктура», «О нас», «Правила».
        </li>
        <li>
          <strong>Конюшни</strong> — три карточки: заголовок, описания, ссылки на фото (можно загрузить файл).
        </li>
      </ul>
    </div>
  );
}
