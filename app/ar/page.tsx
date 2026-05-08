"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import StarField from "@/components/StarField";
import Button from "@/components/ui/Button";
import { useSpotlight } from "@/hooks/useSpotlight";
import { SITE } from "@/lib/constants";

// ─── Animation helpers ───────────────────────────────────────────────────────

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

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

function itemV(reduce: boolean | null): Variants {
  return {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };
}

// ─── HERO ────────────────────────────────────────────────────────────────────

function ArHero() {
  const reduce = useReducedMotion();
  return (
    <section className="w-full bg-[var(--bg)] relative overflow-hidden flex min-h-screen items-center pt-16">
      <StarField />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-6 py-16 md:py-24">
        <div className="max-w-3xl flex flex-col gap-8">
          <motion.p
            {...fadeUp(0, reduce)}
            className="font-body text-xs tracking-[0.2em] uppercase text-[var(--muted)]"
          >
            Buenos Aires · Para negocios argentinos
          </motion.p>

          <motion.h1
            {...fadeUp(0.08, reduce)}
            className="font-display leading-none tracking-wide"
            style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
          >
            TU LOCAL EXISTE.
            <br />
            <span className="text-[var(--accent)]">EN GOOGLE,</span>
            <br />
            TODAVÍA NO.
          </motion.h1>

          <motion.p
            {...fadeUp(0.16, reduce)}
            className="font-body text-sm leading-loose text-[var(--muted)] max-w-lg"
          >
            Una web para tu negocio.{" "}
            <span className="text-[var(--text)]">$180.000 ARS.</span>{" "}
            Lista en 48 horas.
          </motion.p>

          <motion.div {...fadeUp(0.24, reduce)} className="flex flex-wrap gap-4">
            <Button href={SITE.whatsapp} variant="primary">
              Escribime por WhatsApp
            </Button>
            <Button href="#precios" variant="ghost">
              Ver precios →
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── PROBLEM ─────────────────────────────────────────────────────────────────

function ArProblem() {
  const reduce = useReducedMotion();
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 py-24 md:py-32">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-3xl"
      >
        <motion.h2
          variants={itemV(reduce)}
          className="font-display leading-none mb-10"
          style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
        >
          LO QUE PASA MIENTRAS
          <br />
          <span className="text-[var(--accent)]">SOLO TENÉS INSTAGRAM</span>
        </motion.h2>

        <div className="flex flex-col gap-6 font-body text-sm leading-loose text-[var(--muted)]">
          <motion.p variants={itemV(reduce)}>
            Son las 21. Alguien en tu barrio quiere comer algo distinto, necesita
            un turno para el lunes, o busca una veterinaria que atienda guardia.
            Escribe en Google el nombre de tu local, o escribe &ldquo;peluquería
            canina en [barrio]&rdquo;.
          </motion.p>
          <motion.p variants={itemV(reduce)}>
            Si no tenés web, no aparecés. Aparece el local de enfrente, que sí
            tiene.
          </motion.p>
          <motion.p variants={itemV(reduce)}>
            Esa persona no sabe quién es mejor. Elige al que tiene más pinta de
            estar abierto la semana que viene, al que parece más establecido.
            Una web no les dice que sos el mejor;{" "}
            <span className="text-[var(--text)]">les dice que sos real.</span>
          </motion.p>
          <motion.p variants={itemV(reduce)}>
            Instagram no reemplaza eso. Google no muestra tus posts cuando alguien
            busca por rubro y zona. Si no tenés sitio propio, fuera de la app no
            existís.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}

// ─── SOLUTION ────────────────────────────────────────────────────────────────

const SOLUTION_BULLETS = [
  "Nombre, logo y descripción de tu negocio",
  "Dirección, horarios y zona de atención",
  "Fotos de tu local o tus productos",
  "Botón directo a WhatsApp",
  "Dominio propio (.com.ar o .com) y hosting por un año",
] as const;

function ArSolution() {
  const reduce = useReducedMotion();
  return (
    <section className="bg-[var(--surface)] border-y border-[var(--border)]">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-24 md:py-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl"
        >
          <motion.p
            variants={itemV(reduce)}
            className="font-body text-xs tracking-[0.2em] uppercase text-[var(--muted)] mb-4"
          >
            La solución
          </motion.p>
          <motion.h2
            variants={itemV(reduce)}
            className="font-display leading-none mb-4"
            style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
          >
            UNA WEB LISTA EN{" "}
            <span className="text-[var(--accent)]">48 HORAS.</span>
            <br />
            $180.000 ARS.
          </motion.h2>
          <motion.p
            variants={itemV(reduce)}
            className="font-body text-sm text-[var(--muted)] mb-10"
          >
            Sin reuniones largas. Sin proyectos de meses.
          </motion.p>

          <motion.ul variants={containerVariants} className="flex flex-col gap-3 mb-10">
            {SOLUTION_BULLETS.map((b) => (
              <motion.li
                key={b}
                variants={itemV(reduce)}
                className="flex items-start gap-3 font-body text-sm text-[var(--text)]"
              >
                <span className="text-[var(--accent)] mt-0.5 shrink-0" aria-hidden="true">
                  ›
                </span>
                {b}
              </motion.li>
            ))}
          </motion.ul>

          <motion.p variants={itemV(reduce)} className="font-body text-sm text-[var(--muted)]">
            No hay costos mensuales obligatorios el primer año. No hay contrato.
            Si necesitás cambiar algo después de la entrega, lo vemos.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── PRICING ─────────────────────────────────────────────────────────────────

type Tier = {
  name: string;
  price: string;
  tagline: string;
  featured: boolean;
  bullets: string[];
};

const TIERS: Tier[] = [
  {
    name: "Landing básica",
    price: "$180.000 ARS",
    tagline: "Lo que tu negocio necesita para existir en Google.",
    featured: false,
    bullets: [
      "Una página",
      "Datos de contacto, horarios, dirección",
      "Fotos de tu local o productos",
      "Botón directo a WhatsApp",
      "Dominio y hosting por un año",
    ],
  },
  {
    name: "Presencia web",
    price: "$320.000 ARS",
    tagline: "Para los que quieren que Google los encuentre antes que a la competencia.",
    featured: true,
    bullets: [
      "Todo lo de Landing básica",
      "Hasta 5 páginas",
      "SEO configurado",
      "Diseño personalizado",
      "Fácil de actualizar vos mismo",
    ],
  },
  {
    name: "Pack completo",
    price: "$700.000 ARS",
    tagline: "Sitio web más chatbot con IA que responde consultas, las 24 horas.",
    featured: false,
    bullets: [
      "Todo lo de Presencia web",
      "Chatbot entrenado con la info de tu negocio",
      "Panel de control simple",
    ],
  },
];

function PricingCard({ tier, reduce }: { tier: Tier; reduce: boolean | null }) {
  const { ref, onMouseMove, onMouseLeave } = useSpotlight();
  return (
    <motion.div variants={itemV(reduce)} className={`project-card-animated${tier.featured ? " featured" : ""}`}>
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="spotlight-card bg-[var(--surface)] p-8 flex flex-col gap-6 h-full"
      >
        <div className="flex flex-col gap-2">
          {tier.featured && (
            <span className="font-body text-xs tracking-[0.15em] uppercase text-[var(--accent)] mb-1">
              ★ Más elegido
            </span>
          )}
          <h3 className="font-display text-2xl">{tier.name.toUpperCase()}</h3>
          <p className="font-display text-3xl text-[var(--accent)] glow-accent-pulse">{tier.price}</p>
          <p className="font-body text-xs text-[var(--muted)] leading-relaxed">{tier.tagline}</p>
        </div>

        <ul className="flex flex-col gap-2 flex-1">
          {tier.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 font-body text-sm text-[var(--text)]">
              <span className="text-[var(--accent)] shrink-0" aria-hidden="true">›</span>
              {b}
            </li>
          ))}
        </ul>

        <Button href={SITE.whatsapp} variant={tier.featured ? "primary" : "ghost"}>
          Escribime por WhatsApp
        </Button>
      </div>
    </motion.div>
  );
}

function ArPricing() {
  const reduce = useReducedMotion();
  return (
    <section id="precios" className="mx-auto max-w-7xl px-4 md:px-6 py-24 md:py-32">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.p
          variants={itemV(reduce)}
          className="font-body text-xs tracking-[0.2em] uppercase text-[var(--muted)] mb-4"
        >
          Precios
        </motion.p>
        <motion.h2
          variants={itemV(reduce)}
          className="font-display leading-none mb-3"
          style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
        >
          TRES OPCIONES.{" "}
          <span className="text-[var(--accent)]">SIN LETRA CHICA.</span>
        </motion.h2>
        <motion.p
          variants={itemV(reduce)}
          className="font-body text-sm text-[var(--muted)] mb-14"
        >
          Las agencias cobran desde $800.000 por lo mismo.
        </motion.p>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {TIERS.map((tier) => (
            <PricingCard key={tier.name} tier={tier} reduce={reduce} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── PROCESS ─────────────────────────────────────────────────────────────────

const STEPS = [
  {
    n: "01",
    text: "Me escribís por WhatsApp con los datos básicos: nombre del negocio, qué ofrecés, dirección.",
  },
  {
    n: "02",
    text: "Te hago preguntas puntuales — fotos que tengas, horarios, si querés que la gente te llame, te escriba, o llegue al local.",
  },
  {
    n: "03",
    text: "En 48 horas te mando el link de vista previa. Podés verla antes de que esté publicada y pedir cambios.",
  },
  {
    n: "04",
    text: "Queda online. Con tu dominio propio, lista para que te encuentren.",
  },
] as const;

function ArProcess() {
  const reduce = useReducedMotion();
  return (
    <section className="bg-[var(--surface)] border-y border-[var(--border)]">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-24 md:py-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            variants={itemV(reduce)}
            className="font-display leading-none mb-14"
            style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
          >
            CUATRO PASOS,{" "}
            <span className="text-[var(--accent)]">NADA MÁS</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {STEPS.map((s) => (
              <motion.div key={s.n} variants={itemV(reduce)} className="flex gap-6 items-start">
                <span
                  className="font-display text-5xl text-[var(--border)] leading-none shrink-0"
                  aria-hidden="true"
                >
                  {s.n}
                </span>
                <p className="font-body text-sm text-[var(--muted)] leading-loose pt-2">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── SOCIAL PROOF ─────────────────────────────────────────────────────────────

const AR_STATS = [
  { value: "4+", label: "Años en FoodStyles" },
  { value: "100%", label: "Adopción LLM" },
  { value: "48hs", label: "Entrega" },
] as const;

function ArSocialProof() {
  const reduce = useReducedMotion();
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 py-24 md:py-32">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.p
          variants={itemV(reduce)}
          className="font-body text-xs tracking-[0.2em] uppercase text-[var(--muted)] mb-4"
        >
          Con quién trabajé antes
        </motion.p>
        <motion.h2
          variants={itemV(reduce)}
          className="font-display leading-none mb-14"
          style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
        >
          EXPERIENCIA{" "}
          <span className="text-[var(--accent)]">REAL</span>
        </motion.h2>

        {/* Stats grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)" }}
        >
          {AR_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={itemV(reduce)}
              className="flex flex-col gap-4 p-10"
              style={{ borderRight: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
              transition={{ delay: i * 0.12 }}
            >
              <span
                className="font-display leading-none text-[var(--accent)] stat-number"
                style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)" }}
                aria-label={stat.value}
              >
                {stat.value}
              </span>
              <p className="font-body text-xs tracking-[0.15em] uppercase text-[var(--muted)]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bio */}
        <motion.div
          variants={containerVariants}
          className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-10"
        >
          <div className="flex flex-col gap-6 font-body text-sm leading-loose text-[var(--muted)]">
            <motion.p variants={itemV(reduce)}>
              Pasé más de cuatro años como desarrollador en FoodStyles, una app de
              recomendaciones gastronómicas usada en varios países. Construí y mantuve
              sistemas que usan equipos de producto reales, no demos.
            </motion.p>
            <motion.p variants={itemV(reduce)}>
              Empecé a ofrecer este servicio en Argentina porque vi que muchos comercios
              locales invierten en publicidad sin tener un lugar al que mandar a la
              gente. Un perfil de Instagram no es suficiente.
            </motion.p>
          </div>

          {/* Testimonial placeholder */}
          <motion.blockquote
            variants={itemV(reduce)}
            className="border border-dashed border-[var(--accent)] p-8 flex flex-col gap-4"
          >
            <p className="font-body text-sm text-[var(--muted)] italic leading-loose">
              &ldquo;[Primer testimonio de cliente argentino — próximamente]&rdquo;
            </p>
            <footer className="font-body text-xs tracking-[0.15em] uppercase text-[var(--accent)]">
              — En espera
            </footer>
          </motion.blockquote>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────

function ArAbout() {
  const reduce = useReducedMotion();
  return (
    <section className="bg-[var(--surface)] border-y border-[var(--border)]">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-24 md:py-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl"
        >
          <motion.h2
            variants={itemV(reduce)}
            className="font-display leading-none mb-10"
            style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
          >
            ¿QUIÉN{" "}
            <span className="text-[var(--accent)]">TE ESCRIBE?</span>
          </motion.h2>

          <div className="flex flex-col gap-4 font-body text-sm leading-loose text-[var(--muted)]">
            <motion.p variants={itemV(reduce)}>
              Soy Santiago Vittor, desarrollador web y de IA con base en Buenos
              Aires. No soy una agencia, no uso plantillas descargadas de internet,
              y no hay un equipo externo haciendo el trabajo. Soy yo.
            </motion.p>
            <motion.p variants={itemV(reduce)}>
              Si tenés dudas antes de escribirme, puedo mostrarte trabajos
              anteriores. Si ya sabés que querés avanzar, escribime directamente y
              empezamos esta semana.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── OTHER SERVICES ───────────────────────────────────────────────────────────

const EXTRAS = [
  {
    title: "Chatbot para tu negocio",
    desc: "Un asistente que responde preguntas frecuentes en WhatsApp o Instagram, entrenado con la info de tu local. Sin que vos tengas que estar.",
  },
  {
    title: "CRM simple",
    desc: "Para llevar registro de clientes, turnos y pedidos sin depender de anotaciones y grupos de WhatsApp.",
  },
  {
    title: "Publicidad digital",
    desc: "Campañas en Meta e Instagram. Lo maneja dubanronald.com; yo los integro con tu web.",
  },
] as const;

function ArOtherServices() {
  const reduce = useReducedMotion();
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 py-24 md:py-32">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2
          variants={itemV(reduce)}
          className="font-display leading-none mb-14"
          style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
        >
          SI DESPUÉS DE LA WEB{" "}
          <span className="text-[var(--accent)]">QUERÉS MÁS</span>
        </motion.h2>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {EXTRAS.map((e) => (
            <motion.div
              key={e.title}
              variants={itemV(reduce)}
              className="border border-[var(--border)] p-6 hover:border-[var(--accent)] transition-colors duration-200"
            >
              <h3 className="font-display text-xl mb-3">{e.title.toUpperCase()}</h3>
              <p className="font-body text-xs text-[var(--muted)] leading-loose">{e.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── CTA FINAL ────────────────────────────────────────────────────────────────

function ArCtaFinal() {
  const reduce = useReducedMotion();
  return (
    <section id="final-cta" className="bg-[var(--surface)] border-t border-[var(--border)]">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-24 md:py-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-2xl"
        >
          <motion.h2
            variants={itemV(reduce)}
            className="font-display leading-none mb-6"
            style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
          >
            ¿NO ESTÁS SEGURO SI ESTO
            <br />
            <span className="text-[var(--accent)]">SIRVE PARA TU NEGOCIO?</span>
          </motion.h2>
          <motion.p
            variants={itemV(reduce)}
            className="font-body text-sm text-[var(--muted)] leading-loose mb-10"
          >
            Escribime por WhatsApp. Te respondo yo mismo, te digo con honestidad si
            tiene sentido para tu caso, y si no lo tiene, te lo digo igual.
          </motion.p>
          <motion.div variants={itemV(reduce)}>
            <Button href={SITE.whatsapp} variant="primary">
              Escribime por WhatsApp →
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── STICKY WHATSAPP ─────────────────────────────────────────────────────────

function StickyWhatsApp() {
  const [visible, setVisible] = useState(true);
  const observedRef = useRef<Element | null>(null);

  useEffect(() => {
    const el = document.getElementById("final-cta");
    if (!el) return;
    observedRef.current = el;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <a
      href={SITE.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribime por WhatsApp"
      className={[
        "fixed z-50 bottom-6",
        /* mobile: centered */
        "left-1/2 -translate-x-1/2",
        /* desktop: right-anchored */
        "md:left-auto md:translate-x-0 md:right-8",
        "flex items-center gap-2 px-5 py-3",
        "bg-[var(--accent)] text-[var(--bg)]",
        "font-body text-xs tracking-widest uppercase",
        "hover:bg-[var(--accent-2)] hover:text-[var(--text)]",
        "transition-colors duration-150 whitespace-nowrap",
      ].join(" ")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-4 h-4 shrink-0"
        aria-hidden="true"
      >
        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.418A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm4.93 14.07c-.207.583-1.21 1.114-1.657 1.18-.447.065-.868.031-1.313-.162-.453-.196-1.04-.456-1.87-.894-2.337-1.27-3.862-3.65-3.98-3.82-.117-.17-.944-1.257-.944-2.397 0-1.14.6-1.7.81-1.93.21-.23.46-.285.614-.285.155 0 .308.002.443.008.143.006.334-.054.524.4.194.46.66 1.6.717 1.715.057.115.097.25.02.403-.078.154-.116.25-.23.387-.114.136-.24.304-.343.408-.114.115-.232.24-.1.47.134.23.593.978 1.273 1.584.874.78 1.61 1.02 1.838 1.135.228.116.36.097.493-.058.134-.155.57-.665.723-.893.152-.228.305-.19.514-.114.21.076 1.33.627 1.558.742.228.114.38.17.437.266.057.095.057.55-.15 1.133z" />
      </svg>
      Escribime por WhatsApp
    </a>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function ArPage() {
  return (
    <main>
      <ArHero />
      <ArProblem />
      <ArSolution />
      <ArPricing />
      <ArProcess />
      <ArSocialProof />
      <ArAbout />
      <ArOtherServices />
      <ArCtaFinal />
      <StickyWhatsApp />
    </main>
  );
}
