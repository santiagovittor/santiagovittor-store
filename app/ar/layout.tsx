import type { Metadata } from "next";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sitios Web para Negocios Argentinos — Santiago Vittor",
  description:
    "Una web para tu negocio. $180.000 ARS. Lista en 48 horas. Sin reuniones largas. Sin proyectos de meses.",
  alternates: {
    canonical: `${SITE.url}/ar`,
    languages: {
      "en": SITE.url,
      "es-AR": `${SITE.url}/ar`,
    },
  },
  openGraph: {
    title: "Tu local existe. En Google, todavía no.",
    description: "Una web para tu negocio. $180.000 ARS. Lista en 48 horas.",
    locale: "es_AR",
    url: `${SITE.url}/ar`,
    type: "website",
    siteName: SITE.name,
  },
  twitter: {
    card: "summary_large_image",
    title: "Tu local existe. En Google, todavía no.",
    description: "Una web para tu negocio. $180.000 ARS. Lista en 48 horas.",
    creator: "@santiagovittor",
  },
};

export default function ArLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
