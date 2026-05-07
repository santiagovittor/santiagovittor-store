import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import SocialProof from "@/components/sections/SocialProof";
import Projects from "@/components/sections/Projects";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main className="w-full">
      <Hero />
      <Services />
      <SocialProof />
      <Projects />
      <About />
      <Contact />
    </main>
  );
}
