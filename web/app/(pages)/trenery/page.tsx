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
      <h1 className="font-serif text-4xl text-accent">Тренеры</h1>
      <p className="mt-4 max-w-3xl leading-relaxed text-neutral-700">
        Познакомьтесь с инструкторами базы: указаны возраст, стаж работы тренером и основные достижения и направление
        работы. При записи на тренировку можно уточнить, кто принимает новых всадников в текущий период.
      </p>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
        {trainers.map((t) => (
          <TrainerCard key={t.id} trainer={t} />
        ))}
      </div>

      <ManagerContactBlock className="mt-16" />
    </div>
  );
}
