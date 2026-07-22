import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import SocialProof from "@/components/sections/SocialProof";
import Projects from "@/components/sections/Projects";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";
import CosmicBackground from "@/components/CosmicBackground";
import { SITE, SOCIAL_LINKS } from "@/lib/constants";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE.url}/#person`,
      name: SITE.name,
      jobTitle: SITE.tagline,
      url: SITE.url,
      email: SITE.email,
      sameAs: SOCIAL_LINKS.filter((l) =>
        ["GitHub", "LinkedIn"].includes(l.label)
      ).map((l) => l.href),
      knowsAbout: [
        "Next.js",
        "React",
        "Node.js",
        "Python",
        "RAG pipelines",
        "LLM workflows",
        "prompt engineering",
      ],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Buenos Aires",
        addressCountry: "AR",
      },
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE.url}/#service`,
      name: SITE.name,
      description: SITE.description,
      url: SITE.url,
      provider: { "@id": `${SITE.url}/#person` },
      areaServed: "Worldwide",
      availableLanguage: ["en", "es"],
      knowsAbout: [
        "web development",
        "AI chatbots",
        "RAG pipelines",
        "CRM development",
      ],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Buenos Aires",
        addressCountry: "AR",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CosmicBackground />
      <main className="w-full" style={{ position: "relative", zIndex: 1 }}>
        <Hero />
        <Services />
        <SocialProof />
        <Projects />
        <About />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
