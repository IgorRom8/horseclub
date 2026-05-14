"use client";

import { useEffect, useRef, useState } from "react";

type Variant = "up" | "fade" | "zoom";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Задержка старта анимации после попадания в зону (мс) */
  delay?: number;
  /** Длительность перехода (мс) */
  durationMs?: number;
  /** up — сдвиг снизу; fade — только прозрачность; zoom — лёгкое увеличение */
  variant?: Variant;
};

const variantHidden: Record<Variant, string> = {
  up: "motion-safe:translate-y-10 motion-safe:opacity-0",
  fade: "motion-safe:opacity-0",
  zoom:
    "motion-safe:translate-y-6 motion-safe:scale-[0.96] motion-safe:opacity-0 motion-safe:blur-sm",
};

const variantVisible: Record<Variant, string> = {
  up: "motion-safe:translate-y-0 motion-safe:opacity-100",
  fade: "motion-safe:opacity-100",
  zoom:
    "motion-safe:translate-y-0 motion-safe:scale-100 motion-safe:opacity-100 motion-safe:blur-none",
};

export function FadeIn({
  children,
  className = "",
  delay = 0,
  durationMs = 900,
  variant = "up",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        obs.unobserve(el);
      },
      {
        /** Немного «раньше» нижней границы — блок начинает проявляться до полного входа в кадр */
        rootMargin: "0px 0px 12% 0px",
        threshold: [0, 0.06, 0.12],
      },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const hidden = variantHidden[variant];
  const shown = variantVisible[variant];

  return (
    <div
      ref={ref}
      suppressHydrationWarning
      className={`${visible ? shown : hidden} ${className}`}
      style={{
        transitionProperty: "transform, opacity, filter",
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        transitionDuration: visible ? `${durationMs}ms` : "0ms",
        transitionDelay: visible && delay > 0 ? `${delay}ms` : "0ms",
        willChange: visible ? undefined : "transform, opacity, filter",
      }}
    >
      {children}
    </div>
  );
}
