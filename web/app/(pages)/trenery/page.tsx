import { FadeIn } from "@/components/FadeIn";
import { ManagerContactBlock } from "@/components/ManagerContactBlock";
import { TrainerCard } from "@/components/TrainerCard";
import { trainers } from "@/lib/trainers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Тренеры",
  description:
    "Инструкторы конного клуба: опыт работы тренерами, специализация и ключевые достижения.",
};

export default function TrainersPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <FadeIn>
        <h1 className="font-serif text-4xl text-accent">Тренеры</h1>
        <p className="mt-4 max-w-3xl leading-relaxed text-neutral-700">
          Познакомьтесь с инструкторами базы: указаны возраст, стаж работы тренером и основные достижения и направление
          работы. При записи на тренировку можно уточнить, кто принимает новых всадников в текущий период.
        </p>
      </FadeIn>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
        {trainers.map((t, i) => (
          <FadeIn key={t.id} delay={i * 70}>
            <TrainerCard trainer={t} />
          </FadeIn>
        ))}
      </div>

      <FadeIn className="mt-16">
        <ManagerContactBlock />
      </FadeIn>
    </div>
  );
}
