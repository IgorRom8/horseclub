import Link from "next/link";

type Props = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  altHref: string;
  altLabel: string;
};

export function AuthFormShell({ title, subtitle, children, altHref, altLabel }: Props) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-16">
      <div className="rounded-2xl border border-sand/90 bg-white p-8 shadow-soft ring-1 ring-black/[0.04]">
        <h1 className="font-serif text-2xl font-semibold text-accent">{title}</h1>
        <p className="mt-2 text-sm text-neutral-600">{subtitle}</p>
        <div className="mt-6">{children}</div>
        <p className="mt-6 text-center text-sm text-neutral-600">
          <Link href={altHref} className="font-medium text-accent hover:underline">
            {altLabel}
          </Link>
        </p>
      </div>
      <p className="mt-4 text-center text-xs text-neutral-500">
        Данные хранятся только в браузере (localStorage), без сервера и базы данных.
      </p>
    </div>
  );
}
