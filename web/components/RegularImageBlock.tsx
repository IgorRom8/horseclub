import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
};

/** Внутренние страницы: ровное фото + подпись, без оверлея */
export function RegularImageBlock({ src, alt, caption, className }: Props) {
  return (
    <figure className={className}>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md border border-sand bg-sand">
        <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 480px" />
      </div>
      {caption ? <figcaption className="mt-2 text-sm text-neutral-600">{caption}</figcaption> : null}
    </figure>
  );
}
