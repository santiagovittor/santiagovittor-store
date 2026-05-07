"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const itemVariantsReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

export default function About() {
  const reduce = useReducedMotion();

  return (
    <section
      id="about"
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
          className="mb-16"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase text-[var(--accent)] mb-4">
            Who I am
          </p>
          <h2
            className="font-display leading-none tracking-wide"
            style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
          >
            ABOUT
          </h2>
        </motion.div>

        {/* Asymmetric 2-col layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-16"
        >
          {/* Left — bio */}
          <motion.div
            variants={reduce ? itemVariantsReduced : itemVariants}
            className="flex flex-col gap-6"
          >
            <p
              className="font-body text-base leading-relaxed text-[var(--text)]"
              style={{ maxWidth: "60ch" }}
            >
              Full-stack developer and AI specialist, based in Buenos Aires. I
              build web apps, AI tools, and CRMs for international clients.
            </p>
            <a
              href="https://santiagovittor.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors duration-200 flex items-center gap-2 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              More at santiagovittor.com
              <span className="inline-block group-hover:translate-x-1 transition-transform duration-200">
                →
              </span>
            </a>
          </motion.div>

          {/* Right — scrolling tech tags */}
          <motion.div
            variants={reduce ? itemVariantsReduced : itemVariants}
            className="flex flex-col gap-6"
          >
            <p className="font-body text-xs tracking-[0.3em] uppercase text-[var(--muted)]">
              Tech stack
            </p>
            <div className="flex flex-col gap-4">
              <div className="marquee-container">
                <div className="marquee-track marquee-left">
                  <span className="font-body text-xs tracking-wider uppercase text-[var(--muted)] whitespace-nowrap">
                    NEXT.JS · REACT · TYPESCRIPT · NODE.JS · PYTHON · RAG · VERCEL ·&nbsp;
                  </span>
                  <span className="font-body text-xs tracking-wider uppercase text-[var(--muted)] whitespace-nowrap">
                    NEXT.JS · REACT · TYPESCRIPT · NODE.JS · PYTHON · RAG · VERCEL ·&nbsp;
                  </span>
                </div>
              </div>
              <div className="marquee-container">
                <div className="marquee-track marquee-right">
                  <span className="font-body text-xs tracking-wider uppercase text-[var(--muted)] whitespace-nowrap">
                    LLM APIS · TAILWIND CSS · ZAPIER · GOOGLE APPS SCRIPT · PROMPT ENGINEERING · RAG PIPELINES ·&nbsp;
                  </span>
                  <span className="font-body text-xs tracking-wider uppercase text-[var(--muted)] whitespace-nowrap">
                    LLM APIS · TAILWIND CSS · ZAPIER · GOOGLE APPS SCRIPT · PROMPT ENGINEERING · RAG PIPELINES ·&nbsp;
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
