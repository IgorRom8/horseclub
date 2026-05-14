import Image from "next/image";
import Link from "next/link";

type Props = {
  title: string;
  description: string;
  imageSrc: string;
  href: string;
  imageAlt: string;
};

/** Тизер на главной: фото + оверлей + кнопка */
export function ServiceTeaser({ title, description, imageSrc, href, imageAlt }: Props) {
  return (
    <article className="group relative flex min-h-[280px] flex-col overflow-hidden rounded-2xl border border-sand/80 bg-sand shadow-soft ring-0 transition-shadow duration-500 ease-smooth hover:shadow-lift hover:ring-2 hover:ring-accent/15">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover transition-transform duration-[600ms] ease-smooth motion-safe:group-hover:scale-[1.04]"
        priority={false}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/38 to-transparent transition-opacity duration-500 group-hover:from-black/85" />
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-end gap-2 p-6 text-white">
        <h3 className="font-serif text-2xl font-semibold leading-snug tracking-tight drop-shadow-md transition-transform duration-500 ease-smooth motion-safe:group-hover:-translate-y-1">
          {title}
        </h3>
        <p className="max-w-prose text-sm leading-relaxed text-white/92 drop-shadow">{description}</p>
        <Link
          href={href}
          className="pointer-events-auto mt-2 inline-flex w-fit shrink-0 rounded-full border border-white/65 bg-white/15 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition duration-300 hover:border-white hover:bg-white/25 hover:shadow-lg motion-safe:hover:-translate-y-0.5"
        >
          Подробнее
        </Link>
      </div>
    </article>
  );
}
