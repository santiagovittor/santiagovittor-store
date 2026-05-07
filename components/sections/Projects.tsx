"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { PROJECTS, type Project } from "@/lib/constants";
import { useSpotlight } from "@/hooks/useSpotlight";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
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

function ExternalIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M2 12L12 2M12 2H6M12 2V8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}

function ProjectCard({
  project,
  reduce,
}: {
  project: Project;
  reduce: boolean | null;
}) {
  const spotlight = useSpotlight();

  const wrapperHover = reduce
    ? {}
    : {
        whileHover: {
          y: -4,
          boxShadow: "0 0 40px rgba(232, 255, 0, 0.07)",
          transition: { duration: 0.2, ease: "easeOut" as const },
        },
      };

  const innerStyle: React.CSSProperties = {
    border: "none",
  };

  const sharedClassName =
    "spotlight-card group relative flex flex-col gap-6 p-8 bg-[var(--surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]";

  const inner = (
    <>
      {/* Year + external icon */}
      <div className="relative z-[1] flex items-center justify-between">
        <span className="font-body text-xs text-[var(--muted)] tracking-[0.2em] uppercase">
          {project.year}
        </span>
        {project.href && (
          <span className="text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors duration-200">
            <ExternalIcon />
          </span>
        )}
      </div>

      {/* Title */}
      <h3
        className="relative z-[1] font-display leading-none tracking-wide text-[var(--text)]"
        style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)" }}
      >
        {project.title.toUpperCase()}
      </h3>

      {/* Description */}
      <p className="relative z-[1] font-body text-sm leading-relaxed text-[var(--muted)]">
        {project.description}
      </p>

      {/* Tech badges */}
      <div className="relative z-[1] flex flex-wrap gap-2 mt-auto">
        {project.tech.map((t) => (
          <span
            key={t}
            className="font-body text-[0.6rem] tracking-wider uppercase px-2 py-1"
            style={{ border: "1px solid var(--border)", color: "var(--muted)" }}
          >
            {t}
          </span>
        ))}
      </div>
    </>
  );

  if (project.href) {
    return (
      <motion.div
        variants={reduce ? cardVariantsReduced : cardVariants}
        {...wrapperHover}
        className="project-card-wrapper"
      >
        <motion.a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          className={sharedClassName}
          style={innerStyle}
          ref={spotlight.ref as unknown as React.Ref<HTMLAnchorElement>}
          onMouseMove={spotlight.onMouseMove as unknown as React.MouseEventHandler<HTMLAnchorElement>}
          onMouseLeave={spotlight.onMouseLeave}
        >
          {inner}
        </motion.a>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={reduce ? cardVariantsReduced : cardVariants}
      {...wrapperHover}
      className="project-card-wrapper"
    >
      <motion.div
        className={sharedClassName}
        style={innerStyle}
        ref={spotlight.ref}
        onMouseMove={spotlight.onMouseMove}
        onMouseLeave={spotlight.onMouseLeave}
      >
        {inner}
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const reduce = useReducedMotion();

  return (
    <section
      id="projects"
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
            Selected work
          </p>
          <h2
            className="font-display leading-none tracking-wide"
            style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
          >
            PROJECTS
          </h2>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} reduce={reduce} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
