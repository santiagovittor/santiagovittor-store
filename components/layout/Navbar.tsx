"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { NAV_LINKS, SITE } from "@/lib/constants";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const pathname = usePathname();
  const navHref = (href: string) => pathname.startsWith("/ar") ? "/" + href : href;

  const close = () => setIsOpen(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <a
            href="/"
            className="font-display text-xl tracking-widest text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-150"
          >
            {SITE.name.toUpperCase()}
          </a>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={navHref(link.href)}
                className="font-body text-sm tracking-widest uppercase text-[var(--muted)] hover:text-[var(--text)] transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                {link.label}
              </a>
            ))}
            <Button href="#contact" variant="primary">
              Book a call
            </Button>
          </div>

          <button
            className="md:hidden p-2 text-[var(--text)] flex flex-col gap-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            <span
              className={`block h-0.5 w-6 bg-current transition-all duration-200 origin-center ${
                isOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-current transition-opacity duration-200 ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-current transition-all duration-200 origin-center ${
                isOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            className="fixed inset-0 z-40 bg-[var(--bg)] flex flex-col items-center justify-center md:hidden"
          >
            <ul className="flex flex-col items-center gap-10 list-none p-0 m-0">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.3,
                    delay: shouldReduceMotion ? 0 : 0.1 + i * 0.08,
                  }}
                >
                  <a
                    href={navHref(link.href)}
                    onClick={close}
                    className="font-display text-6xl text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-150 tracking-widest focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
                  >
                    {link.label.toUpperCase()}
                  </a>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.3,
                  delay: shouldReduceMotion ? 0 : 0.1 + NAV_LINKS.length * 0.08,
                }}
              >
                <Button
                  href="#contact"
                  variant="primary"
                  onClick={close}
                  className="text-base px-8 py-4"
                >
                  Book a call
                </Button>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
