# Web — приложение сайта конного клуба

Фронтенд на **Next.js**: главная, услуги, инфраструктура, тренеры, конюшни, контакты, динамические страницы из CMS. Форма заявки и публичные настройки (город, мессенджеры, карта) задаются через переменные окружения.

Обзор всего репозитория (монорепозиторий, Vercel): см. [**README в корне**](../README.md).

---

## Технологии

- **Next.js 15** — App Router, серверные компоненты, API routes  
- **React 19** + **TypeScript**  
- **Tailwind CSS** — вёрстка и тема  
- **Prisma 6** + **PostgreSQL** — опционально: страницы и галерея; без БД часть контента берётся из статики в коде  
- **ESLint** (конфиг Next)

---

## Запуск

Нужен **Node.js** (LTS, совместимый с Next.js 15).

### Вариант А: из корня репозитория (рекомендуется)

```bash
cd ..
npm install
copy web\.env.example web\.env.local
npm run dev
```

На Unix:

```bash
cd ..
npm install
cp web/.env.example web/.env.local
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

### Вариант Б: только из папки `web`

```bash
npm install
copy .env.example .env.local
npm run dev
```

`postinstall` сгенерирует Prisma Client; для БД добавьте в `.env.local` строку `DATABASE_URL` (см. `.env.example`).

### Продакшен локально

```bash
npm run build
npm run start
```

### База данных (по желанию)

После настройки `DATABASE_URL` в `.env.local`:

```bash
npm run db:push
npm run db:seed
```

---

## Полезные npm-скрипты (в `web`)

| Скрипт | Назначение |
|--------|------------|
| `npm run dev` | Разработка |
| `npm run build` | Сборка (включает генерацию Prisma) |
| `npm run start` | Запуск после `build` |
| `npm run lint` | Проверка ESLint |
| `npm run db:generate` / `db:push` / `db:seed` | Prisma |
| `npm run images:sync` | Синхронизация изображений из корневой папки `../images/` |

Переменные окружения описаны в **`.env.example`**.
