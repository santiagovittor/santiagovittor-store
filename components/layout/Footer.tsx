import { NAV_LINKS, SOCIAL_LINKS, SITE } from "@/lib/constants";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[var(--bg)]" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="mx-auto w-full max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <a
              href="/"
              className="font-display text-lg tracking-widest text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              {SITE.name.toUpperCase()}
            </a>
            <p className="font-body text-xs leading-relaxed text-[var(--muted)]">
              {SITE.tagline}.
              <br />
              {SITE.location}.
            </p>
          </div>

          {/* Nav links */}
          <nav aria-label="Footer navigation">
            <p className="font-body text-xs tracking-[0.2em] uppercase text-[var(--muted)] mb-5">
              Navigation
            </p>
            <ul className="flex flex-col gap-3 list-none p-0 m-0">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-body text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social links */}
          <nav aria-label="Social links">
            <p className="font-body text-xs tracking-[0.2em] uppercase text-[var(--muted)] mb-5">
              Connect
            </p>
            <ul className="flex flex-col gap-3 list-none p-0 m-0">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                  >
                    {link.label} →
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-16 pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <p className="font-body text-xs text-[var(--muted)]">
            © {year} {SITE.name}. All rights reserved.
          </p>
          <p className="font-body text-xs text-[var(--muted)]">
            Digital ads via{" "}
            <a
              href="https://dubanronald.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              dubanronald.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
