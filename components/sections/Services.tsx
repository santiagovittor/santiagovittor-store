"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { SERVICES, type Service } from "@/lib/constants";
import { useSpotlight } from "@/hooks/useSpotlight";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const cardVariantsReduced: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

function ServiceCard({
  service,
  index,
  reduce,
}: {
  service: Service;
  index: number;
  reduce: boolean | null;
}) {
  const isAds = service.id === "ads";
  const num = String(index + 1).padStart(2, "0");
  const spotlight = useSpotlight();

  return (
    <motion.div
      ref={spotlight.ref}
      onMouseMove={spotlight.onMouseMove}
      onMouseLeave={spotlight.onMouseLeave}
      variants={reduce ? cardVariantsReduced : cardVariants}
      whileHover={
        reduce
          ? {}
          : {
              y: -4,
              borderColor: "#E8FF00",
              transition: { duration: 0.2, ease: "easeOut" },
            }
      }
      className="spotlight-card relative flex flex-col gap-6 p-8 bg-[var(--surface)]"
      style={{ border: "1px solid #222222" }}
    >
      {/* Faded background number: editorial accent */}
      <span
        className="absolute top-3 right-5 z-[1] font-display leading-none select-none pointer-events-none"
        style={{
          fontSize: "clamp(4rem, 8vw, 7rem)",
          color: "var(--text)",
          opacity: 0.055,
        }}
        aria-hidden="true"
      >
        {num}
      </span>

      {/* Header */}
      <div className="relative z-[1] flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <h3
          className="font-display leading-none tracking-wide text-[var(--text)]"
          style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)" }}
        >
          {service.title.toUpperCase()}
        </h3>
        {isAds && (
          <a
            href="https://dubanronald.com"
            target="_blank"
            rel="noopener noreferrer"
            className="self-start shrink-0 font-body text-[0.6rem] tracking-wider uppercase px-2 py-1 border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            via dubanronald.com
          </a>
        )}
      </div>

      {/* Description */}
      <p className="relative z-[1] font-body text-sm leading-relaxed text-[var(--muted)]">
        {service.description}
      </p>

      {/* Bullets */}
      <ul className="relative z-[1] flex flex-col gap-2">
        {service.bullets.map((bullet) => (
          <li
            key={bullet}
            className="font-body text-xs flex gap-3 text-[var(--text)] leading-relaxed"
          >
            <span className="text-[var(--accent)] shrink-0">›</span>
            {bullet}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href="#contact"
        className="service-cta relative z-[1] mt-auto font-body text-xs tracking-[0.2em] uppercase text-[var(--accent)] hover:text-[var(--accent-2)] transition-colors duration-200 flex items-center gap-2 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      >
        {service.cta}
        <span className="inline-block group-hover:translate-x-1 transition-transform duration-200">
          →
        </span>
      </a>
    </motion.div>
  );
}

export default function Services() {
  const reduce = useReducedMotion();

  return (
    <section id="services" className="w-full relative py-16 md:py-24 lg:py-32">
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
            What I do
          </p>
          <h2
            className="font-display leading-none tracking-wide"
            style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
          >
            SERVICES
          </h2>
        </motion.div>

        {/* Cards grid — stagger triggered on viewport entry */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {SERVICES.map((service, i) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={i}
              reduce={reduce}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
