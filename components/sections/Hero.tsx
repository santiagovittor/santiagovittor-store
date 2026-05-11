"use client";

import { motion, useReducedMotion } from "motion/react";
import { SITE } from "@/lib/constants";
import Button from "@/components/ui/Button";

function fadeUp(delay: number, reduce: boolean | null) {
  return {
    initial: { opacity: 0, y: reduce ? 0 : 24 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.5,
      delay: reduce ? 0 : delay,
      ease: "easeOut" as const,
    },
  };
}

export default function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="w-full relative overflow-hidden flex min-h-screen items-center pt-16">
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-[3fr_2fr] md:gap-12 md:items-center">
          {/* Left column */}
          <div className="flex flex-col gap-8">
            <motion.p
              {...fadeUp(0, reduce)}
              className="font-body text-xs tracking-[0.15em] md:tracking-[0.3em] uppercase text-[var(--muted)]"
            >
              Buenos Aires → Remote · Full-Stack & AI
            </motion.p>

            <motion.h1
              {...fadeUp(0.08, reduce)}
              className="font-display leading-none tracking-wide"
              style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
            >
              I BUILD
              <br />
              <span className="text-[var(--accent)]">WEB & AI</span>
              <br />
              PRODUCTS
            </motion.h1>

            <motion.p
              {...fadeUp(0.16, reduce)}
              className="font-body text-sm leading-loose text-[var(--muted)] max-w-md"
            >
              {SITE.description}
            </motion.p>

            <motion.div
              {...fadeUp(0.24, reduce)}
              className="flex flex-wrap gap-4"
            >
              <Button href="#contact" variant="primary">
                Book a call
              </Button>
              <Button href="#projects" variant="ghost">
                See my work
              </Button>
            </motion.div>
          </div>

          {/* Right column */}
          <motion.div
            {...fadeUp(0.32, reduce)}
            className="hidden md:flex items-center justify-center"
          >
            <motion.div
              animate={reduce ? {} : { y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <CodeTerminal reduce={reduce} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CodeTerminal({ reduce }: { reduce: boolean | null }) {
  return (
    <svg
      viewBox="0 0 480 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-lg"
      aria-hidden="true"
    >
      {/* Outer border */}
      <rect x="0.5" y="0.5" width="479" height="339" stroke="var(--border)" strokeWidth="1" />

      {/* Header bar */}
      <rect width="480" height="44" fill="var(--surface)" />
      <line x1="0" y1="44" x2="480" y2="44" stroke="var(--border)" />

      {/* Window controls — squares, not circles */}
      <rect x="16" y="16" width="12" height="12" fill="var(--accent-2)" />
      <rect x="36" y="16" width="12" height="12" fill="var(--border)" />
      <rect x="56" y="16" width="12" height="12" fill="var(--border)" />

      {/* Line number gutter */}
      <rect x="0" y="44" width="44" height="296" fill="var(--surface)" fillOpacity="0.5" />
      <line x1="44" y1="44" x2="44" y2="340" stroke="var(--border)" />

      {/* Code line 1 */}
      <rect x="60" y="64" width="36" height="5" fill="var(--accent)" opacity="0.8" />
      <rect x="104" y="64" width="80" height="5" fill="var(--muted)" />
      <rect x="192" y="64" width="48" height="5" fill="var(--muted)" />

      {/* Code line 2 */}
      <rect x="60" y="82" width="24" height="5" fill="var(--muted)" />
      <rect x="92" y="82" width="120" height="5" fill="var(--muted)" opacity="0.6" />

      {/* Code line 3 */}
      <rect x="76" y="100" width="40" height="5" fill="var(--accent)" opacity="0.5" />
      <rect x="124" y="100" width="64" height="5" fill="var(--muted)" />
      <rect x="196" y="100" width="80" height="5" fill="var(--muted)" opacity="0.4" />

      {/* Code line 4 */}
      <rect x="76" y="118" width="100" height="5" fill="var(--muted)" opacity="0.6" />

      {/* Code line 5 */}
      <rect x="76" y="136" width="60" height="5" fill="var(--muted)" />
      <rect x="144" y="136" width="40" height="5" fill="var(--accent)" opacity="0.4" />

      {/* Active line highlight */}
      <rect x="44" y="150" width="436" height="20" fill="var(--accent)" fillOpacity="0.08" />
      <rect x="60" y="157" width="20" height="5" fill="var(--accent)" opacity="0.9" />
      <rect x="88" y="157" width="72" height="5" fill="var(--accent)" opacity="0.5" />

      {/* Cursor — blinking when motion allowed */}
      {reduce ? (
        <rect x="168" y="153" width="3" height="14" fill="var(--accent)" />
      ) : (
        <motion.rect
          x={168}
          y={153}
          width={3}
          height={14}
          fill="var(--accent)"
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{ duration: 1, repeat: Infinity, times: [0, 0.49, 0.5, 1] }}
        />
      )}

      {/* Code line 7 */}
      <rect x="76" y="186" width="80" height="5" fill="var(--muted)" opacity="0.6" />
      <rect x="164" y="186" width="40" height="5" fill="var(--muted)" />

      {/* Code line 8 */}
      <rect x="76" y="204" width="120" height="5" fill="var(--muted)" opacity="0.4" />

      {/* Code line 9 */}
      <rect x="60" y="222" width="36" height="5" fill="var(--accent)" opacity="0.7" />
      <rect x="104" y="222" width="60" height="5" fill="var(--muted)" />

      {/* Code line 10 */}
      <rect x="60" y="240" width="20" height="5" fill="var(--muted)" opacity="0.3" />

      {/* Status bar */}
      <rect x="0" y="316" width="480" height="24" fill="var(--accent)" fillOpacity="0.1" />
      <line x1="0" y1="316" x2="480" y2="316" stroke="var(--accent)" strokeOpacity="0.2" />
      <rect x="12" y="325" width="60" height="4" fill="var(--accent)" opacity="0.4" />
      <rect x="400" y="325" width="64" height="4" fill="var(--muted)" opacity="0.4" />
    </svg>
  );
}
