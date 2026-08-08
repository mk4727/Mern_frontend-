import { useDocumentTitle } from "@/lib/use-document-title";

import { Droplets, Sun, Sprout, Repeat, type LucideIcon } from "lucide-react";
import { useStore } from "@/lib/store";
import type { CareIcon } from "@/lib/products";


const iconMap: Record<CareIcon, LucideIcon> = {
  droplets: Droplets,
  sun: Sun,
  sprout: Sprout,
  repeat: Repeat,
};

function Care() {
  useDocumentTitle("Plant Care — Cactus World", undefined);
  const { careTips } = useStore();
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="text-center animate-fade-up">
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">Plant care, made simple</h1>
        <p className="mt-3 text-muted-foreground">Follow these basics and your plants will thrive.</p>
      </div>
      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {careTips.map((t, i) => {
          const Icon = iconMap[t.icon] ?? Sprout;
          return (
            <div key={t.id} className="rounded-2xl border border-border bg-card p-7 transition-smooth hover:-translate-y-1 hover:shadow-soft" style={{ animation: `fade-up 0.6s ${i * 80}ms both` }}>
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold">{t.title}</h3>
              <p className="mt-2 text-muted-foreground">{t.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Care;
