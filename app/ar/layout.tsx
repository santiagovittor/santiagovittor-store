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
      "x-default": SITE.url,
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE.url}/ar#service`,
  name: "Sitios Web para Negocios — Santiago Vittor",
  description:
    "Diseño y desarrollo de sitios web para negocios argentinos. Lista en 48 horas.",
  url: `${SITE.url}/ar`,
  inLanguage: "es-AR",
  areaServed: { "@type": "Country", name: "Argentina" },
  provider: { "@id": `${SITE.url}/#person` },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Buenos Aires",
    addressCountry: "AR",
  },
  offers: {
    "@type": "Offer",
    name: "Sitio web para tu negocio",
    price: "180000",
    priceCurrency: "ARS",
    description: "Web lista en 48 horas. Sin reuniones largas.",
    availability: "https://schema.org/InStock",
  },
};

export default function ArLayout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="es-AR">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </div>
  );
}
