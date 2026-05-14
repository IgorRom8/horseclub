import { yearsRu } from "@/lib/yearsRu";
import type { Trainer } from "@/lib/trainers";

type Props = {
  trainer: Trainer;
};

export function TrainerCard({ trainer }: Props) {
  const { name, age, trainerExperienceYears, achievements } = trainer;

  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-sand/90 bg-gradient-to-br from-white/95 to-sand/40 p-6 shadow-soft ring-1 ring-black/[0.04] backdrop-blur-sm transition-[box-shadow,ring-color] duration-300 ease-smooth hover:shadow-md hover:ring-accent/15 md:p-8"
      aria-labelledby={`trainer-${trainer.id}-name`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-accent/25 to-transparent"
      />

      <h2
        id={`trainer-${trainer.id}-name`}
        className="font-serif text-2xl font-semibold tracking-tight text-accent md:text-[1.65rem]"
      >
        {name}
      </h2>

      <div className="mt-5 flex flex-wrap gap-2">
        <span className="rounded-full border border-white/70 bg-white/75 px-3.5 py-1 text-xs font-medium text-neutral-800 shadow-inner ring-1 ring-black/[0.03] backdrop-blur-sm">
          Возраст · {yearsRu(age)}
        </span>
        <span className="rounded-full border border-accent/25 bg-accent/[0.07] px-3.5 py-1 text-xs font-semibold text-accent shadow-inner backdrop-blur-sm">
          Опыт тренера · {yearsRu(trainerExperienceYears)}
        </span>
      </div>

      <div className="relative mt-6">
        <h3 className="text-xs font-medium uppercase tracking-wide text-neutral-500">Достижения и направление</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-neutral-800 [&>li]:leading-relaxed">
          {achievements.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
