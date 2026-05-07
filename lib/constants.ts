// lib/constants.ts
// Single source of truth for all static data.
// Claude Code: always read this file before writing copy into any component.

export const SITE = {
  name: "Santiago Vittor",
  tagline: "Full-Stack Developer & AI Specialist",
  description:
    "I build web products and AI systems for international clients. Based in Buenos Aires, working remotely.",
  url: "https://santiagovittor.store",
  email: "svittordev@gmail.com",
  whatsapp: "https://wa.me/5491162300345", //
  location: "Buenos Aires, Argentina (Remote)",
} as const;

export const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

export const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/santiagovittor" },
  { label: "LinkedIn", href: "https://linkedin.com/in/santiago-vittor" },
  { label: "Portfolio", href: "https://santiagovittor.com" },
] as const;

export type Service = {
  id: string;
  title: string;
  description: string;
  bullets: string[];
  cta: string;
};

export const SERVICES: Service[] = [
  {
    id: "fullstack",
    title: "Full-Stack Development",
    description:
      "Web apps and APIs built with React, Next.js, and Node.js.",
    bullets: [
      "Next.js App Router & React Server Components",
      "REST & GraphQL APIs with Node.js",
      "Vercel, Railway, or VPS deployment",
    ],
    cta: "Build with me",
  },
  {
    id: "ai",
    title: "AI & Chatbot Development",
    description:
      "LLM tools and RAG pipelines built for production, not just demos.",
    bullets: [
      "RAG pipelines with citation & refusal guardrails",
      "No-code UIs for non-technical teams",
      "Prompt testing & output quality evaluation",
    ],
    cta: "Build your AI product",
  },
  {
    id: "crm",
    title: "CRM Development",
    description:
      "Custom CRMs built around your workflow, not a vendor template.",
    bullets: [
      "Contact & pipeline management",
      "Google Sheets / Notion / Airtable integrations",
      "Automation with Zapier or Make",
    ],
    cta: "Simplify your ops",
  },
  {
    id: "ads",
    title: "Digital Ads & Growth",
    description:
      "Paid media by dubanronald.com, focused on measurable results.",
    bullets: [
      "Google Ads & Meta Ads setup and management",
      "Landing page creation & A/B testing",
      "Monthly reporting with clear ROI metrics",
    ],
    cta: "Grow your traffic",
  },
];

export type Project = {
  id: string;
  title: string;
  description: string;
  tech: string[];
  href?: string;
  year: number;
};

export const PROJECTS: Project[] = [
  {
    id: "rag-chatbot",
    title: "Production RAG Chatbot",
    description:
      "Internal knowledge chatbot for a London-based company. Sentence-aware chunking, cosine retrieval, citation enforcement, and refusal guardrails. No-code UI lets non-technical staff update the knowledge base without touching code.",
    tech: ["Python", "Sentence Transformers", "Oracle VM", "Vercel"],
    year: 2025,
  },
  {
    id: "portfolio-rag",
    title: "Portfolio RAG Chat",
    description:
      "RAG-powered chat that answers questions based exclusively on documented experience. Visitors can ask anything about my background and get grounded, cited answers.",
    tech: ["RAG", "JavaScript", "Next.js"],
    href: "https://santiagovittor.com",
    year: 2024,
  },
];

export const STATS = [
  { value: "4+", label: "Years at FoodStyles" },
  { value: "100%", label: "LLM training adoption" },
  { value: "3-tier", label: "Prompt mastery program" },
] as const;

export const STACK_BADGES = [
  "Next.js", "React", "TypeScript", "Node.js",
  "Python", "RAG", "LLM APIs", "Tailwind CSS",
  "Vercel", "Google Apps Script", "Zapier",
] as const;