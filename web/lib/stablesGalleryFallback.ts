import type { GalleryDto } from "@/lib/cms";
import { konyushniGalleryImages } from "@/lib/siteImages";

export type StablesGalleryCard = {
  id: string;
  title: string;
  /** Краткий текст на карточке (превью). */
  description: string;
  /** Дополнительный текст только в модальном окне. */
  detail: string;
  imageUrl: string;
  thumbnailUrl: string;
};

/** Убирает карточки с тем же `imageUrl` (на случай старых данных в БД). */
export function uniqueGalleryByImageUrl<T extends { imageUrl: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.imageUrl.trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Пути к фото карточек конюшни (третья — другой кадр, не gallery-kon-03). */
const STABLES_CARD_IMAGE_INDICES = [0, 1, 3] as const;

function stablesCardImageAt(cardIndex: number): string {
  const slot = STABLES_CARD_IMAGE_INDICES[cardIndex];
  if (slot === undefined) throw new Error("stables: нет слота изображения");
  const src = konyushniGalleryImages[slot];
  if (!src) throw new Error("konyushniGalleryImages: не хватает файла для карточки конюшни");
  return src;
}

export const STABLES_INTRO = [
  {
    key: "stoyanka",
    title: "Постой и денники",
    description:
      "Ряд боксов с вентиляцией и естественным светом: подстилка по сезону, кормушки и поилки на месте.",
    detail:
      "Размер ячейки ориентируем на спокойное стояние и возможность развернуться лошади: важно, чтобы животное не упиралось корпусом в стены и спокойно доедало корм. Подстилку обновляем по графику и по погоде: зимой следим за сухостью и проветриванием, летом — за чистотой и отсутствием перегрева.\n\n" +
      "Центральный проход сделан так, чтобы можно было пройти вдоль ряда, заглянуть в бокс и оценить состояние лошади, не загоняя её в угол. Температура и влажность держим в рамках, привычных для зимних и летних режимов Подмосковья.\n\n" +
      "Кормление и поение согласуются с владельцем и инструктором: фиксируем рацион, время дачи корма и, при необходимости, добавки. После смены корма или режима наблюдаем за самочувствием лошади несколько дней — так меньше риска срыва пищеварения.",
  },
  {
    key: "ryad",
    title: "Обустройство конюшни",
    description:
      "Чистые проходы, порядок в денниках и понятная логистика кормления — база, с которой проще жить и работать каждый день.",
    detail:
      "В проходах нет лишних предметов: сумки и снаряжение убираем в отведённые места, чтобы не мешать выводу лошадей и технике. Пол и дренаж проверяем после мытья и дождливой погоды — сухие копыта и ровное покрытие снижают скольжение.\n\n" +
      "Корм и расходники храним так, чтобы их было видно персоналу, но недоступно животным. Мусор и упаковка сразу выносятся: запах и шуршание плащёвок сами по себе могут нервировать чувствительных лошадей.\n\n" +
      "График уборки и проветривания согласован с администратором: утром — проверка боксов и воды, вечером — закрытие и сверка по списку постойных. Если вы приехали впервые, кратко объясним, где вешать повод, куда поставить ведро и как лучше зайти в бокс, чтобы не напугать соседей по стойле.",
  },
  {
    key: "uchastok",
    title: "Ряд у выхода",
    description:
      "Удобная высота проёмов и спокойный свет в проходе — меньше суеты при выводе и возврате с плаца или манежа.",
    detail:
      "Двери и ворота открываем плавно, без резкого хлопка: лошадь сначала видит просвет, потом выходит под поводом всадника или персонала. В узких местах пропускаем навстречу отряды по правилу «кто стоит — тот ждёт», чтобы не сужать пространство за счёт чужого животного.\n\n" +
      "Рядом с выходом можно ненадолго оставить снаряжение на просушку или чистку, но ценные вещи просим не оставлять без присмотра. После тренировки амуницию протираем в амуничнике, чтобы грязь и пот не попадали обратно в бокс.\n\n" +
      "Если лошадь нервная, заранее предупредите персонал: подберём время выхода и маршрут без скопления лошадей у ворот. В вечерние часы просим двигаться спокойнее и с фонарём — это снижает риск спотыкания и пугает животных меньше, чем резкий свет в лицо.",
  },
] as const;

export function getStaticStablesGalleryCards(): StablesGalleryCard[] {
  return STABLES_INTRO.map((row, i) => {
    const src = stablesCardImageAt(i);
    return {
      id: `static-${row.key}`,
      title: row.title,
      description: row.description,
      detail: row.detail,
      imageUrl: src,
      thumbnailUrl: src,
    };
  });
}

/** Подставляет URL из БД, сохраняя заголовки и описания из вёрстки. */
export function mergeDbStablesGalleryImages(
  dbRows: GalleryDto[],
  fallback: StablesGalleryCard[],
): StablesGalleryCard[] {
  const unique = uniqueGalleryByImageUrl(dbRows).slice(0, 3);
  if (unique.length === 0) return fallback;
  return fallback.map((card, i) => {
    const row = unique[i];
    if (!row) return card;
    return {
      ...card,
      id: row.id,
      imageUrl: row.imageUrl,
      thumbnailUrl: row.thumbnailUrl,
      title: row.title?.trim() ? row.title : card.title,
      description: row.description?.trim() ? row.description : card.description,
      detail: row.detail?.trim() ? row.detail : card.detail,
    };
  });
}
