"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, animate } from "motion/react";
import { STATS } from "@/lib/constants";

function parseValue(value: string): { num: number; suffix: string } {
  const match = value.match(/^(\d+)(.*)$/);
  if (!match) return { num: 0, suffix: value };
  return { num: parseInt(match[1], 10), suffix: match[2] };
}

function StatCounter({
  value,
  reduce,
}: {
  value: string;
  reduce: boolean | null;
}) {
  const { num, suffix } = parseValue(value);
  const [display, setDisplay] = useState(reduce ? num : 0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView || reduce) return;
    const controls = animate(0, num, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [isInView, num, reduce]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export default function SocialProof() {
  const reduce = useReducedMotion();

  return (
    <section
      id="social-proof"
      className="w-full bg-[var(--bg)] relative py-16 md:py-24 lg:py-32"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <div className="mx-auto w-full max-w-7xl px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, ease: "easeOut" as const }}
          className="mb-20"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase text-[var(--accent)] mb-4">
            By the numbers
          </p>
          <h2
            className="font-display leading-none tracking-wide"
            style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
          >
            PROOF
          </h2>
        </motion.div>

        {/* Stats grid: bordered cells, neubrutalist grid lines */}
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{
            borderTop: "1px solid var(--border)",
            borderLeft: "1px solid var(--border)",
          }}
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: reduce ? 0 : 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{
                duration: 0.5,
                ease: "easeOut" as const,
                delay: i * 0.12,
              }}
              className="flex flex-col gap-5 p-10"
              style={{
                borderRight: "1px solid var(--border)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <span
                className="font-display leading-none text-[var(--accent)] stat-number"
                style={{ fontSize: "clamp(4rem, 9vw, 8rem)" }}
                aria-label={stat.value}
              >
                <StatCounter value={stat.value} reduce={reduce} />
              </span>
              <p className="font-body text-xs tracking-[0.15em] uppercase text-[var(--muted)]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
