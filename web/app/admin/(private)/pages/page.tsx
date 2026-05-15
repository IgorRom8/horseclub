import Link from "next/link";

import { ADMIN_EDITABLE_PAGE_SLUGS, adminPageLabels } from "@/lib/adminEditablePages";

export default function AdminPagesIndexPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl text-accent">Страницы</h1>
      <p className="text-sm text-neutral-600">
        Редактируется JSON-контент блоков (как в сиде). Ошибка в JSON не сохранится.
      </p>
      <ul className="space-y-2">
        {ADMIN_EDITABLE_PAGE_SLUGS.map((slug) => (
          <li key={slug}>
            <Link href={`/admin/pages/${slug}`} className="text-accent underline-offset-2 hover:underline">
              {adminPageLabels[slug]}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
