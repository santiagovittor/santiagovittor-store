"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { SITE } from "@/lib/constants";
import Cal, { getCalApi } from "@calcom/embed-react";

// ── helpers ─────────────────────────────────────────────────────────────────

type LoosePart = { type: string; [k: string]: unknown };

const RAY_ENDPOINTS = [
  { x2: 26,  y2: 14     }, // 0°
  { x2: 20,  y2: 24.392 }, // 60°
  { x2: 8,   y2: 24.392 }, // 120°
  { x2: 2,   y2: 14     }, // 180°
  { x2: 8,   y2: 3.608  }, // 240°
  { x2: 20,  y2: 3.608  }, // 300°
];

function extractText(parts: LoosePart[]): string {
  return parts
    .filter(
      (p): p is { type: "text"; text: string } & LoosePart =>
        p.type === "text" && typeof p.text === "string",
    )
    .map((p) => p.text)
    .join("");
}

// ── sub-components ───────────────────────────────────────────────────────────

function StarSVG() {
  const c = 14;
  const r = 12;
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      aria-hidden="true"
      className="star-svg"
    >
      {RAY_ENDPOINTS.map(({ x2, y2 }, i) => (
        <line
          key={i}
          x1={c}
          y1={c}
          x2={x2}
          y2={y2}
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

function NoiseGrain() {
  return (
    <svg
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity: 0.04,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <filter id="chat-grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.65"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#chat-grain)" />
    </svg>
  );
}

function WordReveal({ text, reduced }: { text: string; reduced: boolean }) {
  if (reduced) return <span>{text}</span>;
  const tokens = text.split(/(\s+)/);
  return (
    <>
      {tokens.map((token, i) =>
        /^\s+$/.test(token) ? (
          token
        ) : (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{ display: "inline-block" }}
          >
            {token}
          </motion.span>
        ),
      )}
    </>
  );
}

function CalEmbed() {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi();
      cal("ui", { theme: "dark" });
    })();
  }, []);

  return (
    <div
      style={{
        height: "520px",
        overflowY: "auto",
        border: "1px solid var(--accent)",
        position: "relative",
        flexShrink: 0,
      }}
    >
      <Cal
        calLink="santiago-vittor-4ozbwu/30min"
        config={{ theme: "dark", layout: "column_view" }}
        style={{ width: "100%", display: "block" }}
      />
    </div>
  );
}

function ThinkingIndicator({ reduced }: { reduced: boolean }) {
  return (
    <div style={{ display: "flex", gap: "6px" }}>
      <span aria-hidden="true" style={{ color: "var(--accent)", flexShrink: 0 }}>
        ▸
      </span>
      <div
        aria-label="Thinking"
        style={{ display: "flex", gap: "5px", alignItems: "center", padding: "4px 0" }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            style={{
              color: "var(--muted)",
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              lineHeight: 1,
            }}
            animate={reduced ? { opacity: 0.6 } : { opacity: [0.3, 1, 0.3] }}
            transition={
              reduced
                ? {}
                : { duration: 1.4, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }
            }
          >
            •
          </motion.span>
        ))}
      </div>
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────

export default function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [sessionId] = useState<string>(() => crypto.randomUUID());
  const [input, setInput] = useState("");

  const pathname = usePathname();
  const lang: "en" | "es" = pathname?.startsWith("/ar") ? "es" : "en";

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const prefersReduced = useReducedMotion() ?? false;

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { sessionId },
    }),
  });

  // ── side-effects ─────────────────────────────────────────────────────────

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(
        () => textareaRef.current?.focus(),
        prefersReduced ? 50 : 500,
      );
      return () => clearTimeout(t);
    } else {
      triggerRef.current?.focus();
    }
  }, [open, prefersReduced]);

  // Proximity glow on trigger star
  useEffect(() => {
    if (prefersReduced) return;
    const btn = triggerRef.current;
    if (!btn) return;

    const onMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const dist = Math.hypot(
        e.clientX - (rect.left + rect.width / 2),
        e.clientY - (rect.top + rect.height / 2),
      );
      const t = Math.max(0, 1 - dist / 120);
      btn.style.transform = `scale(${1 + t * 0.3})`;
      const svg = btn.querySelector<SVGSVGElement>(".star-svg");
      if (svg) {
        svg.style.filter =
          t > 0.01
            ? `drop-shadow(0 0 ${3 + t * 10}px var(--accent)) drop-shadow(0 0 ${6 + t * 18}px rgba(232,255,0,${(0.15 + t * 0.45).toFixed(2)}))`
            : "";
      }
    };

    const onLeave = () => {
      btn.style.transform = "";
      const svg = btn.querySelector<SVGSVGElement>(".star-svg");
      if (svg) svg.style.filter = "";
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [prefersReduced]);

  // Focus trap + ESC
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key === "Tab") {
        const panel = panelRef.current;
        if (!panel) return;
        const els = Array.from(
          panel.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], textarea, [tabindex]:not([tabindex="-1"])',
          ),
        );
        if (els.length < 2) return;
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // ── handlers ───────────────────────────────────────────────────────────────

  const isStreaming = status === "streaming" || status === "submitted";

  const handleSend = useCallback(() => {
    if (!input.trim() || isStreaming) return;
    sendMessage({ text: input.trim() });
    setInput("");
  }, [input, isStreaming, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── strings ─────────────────────────────────────────────────────────────────

  const S = {
    greeting:
      lang === "es"
        ? "Hola, soy Santiago. ¿Cómo te puedo ayudar?"
        : "Hey, I'm Santiago. How can I help you?",
    placeholder: lang === "es" ? "Escribí un mensaje" : "Send a message",
    errorMsg:
      lang === "es"
        ? "Tengo problemas para conectarme. Mandame un mensaje por WhatsApp."
        : "Having trouble connecting. Send me a message on WhatsApp instead.",
    ariaOpen:
      lang === "es" ? "Abrir chat con Santiago" : "Open chat with Santiago",
    ariaChat: lang === "es" ? "Chat con Santiago" : "Chat with Santiago",
    chips:
      lang === "es"
        ? ["¿Qué hacés?", "Reservar una llamada", "Ver mi trabajo"]
        : ["What do you build?", "Book a call", "See my work"],
  };

  // ── animation ──────────────────────────────────────────────────────────────

  const clipOrigin = "circle(0% at calc(100% - 48px) calc(100% - 48px))";
  const clipFull = "circle(150% at calc(100% - 48px) calc(100% - 48px))";

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        @keyframes star-rotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes star-filter {
          0%, 100% { filter: drop-shadow(0 0 6px var(--accent)) drop-shadow(0 0 14px rgba(232,255,0,0.25)); }
          35%      { filter: drop-shadow(0 0 16px var(--accent)) drop-shadow(0 0 32px rgba(232,255,0,0.55)); }
          71%      { filter: drop-shadow(0 0 6px var(--accent)) drop-shadow(0 0 14px rgba(232,255,0,0.25)); }
          74%      { filter: drop-shadow(0 0 22px var(--accent)) drop-shadow(0 0 44px rgba(232,255,0,0.75)); }
          77%      { filter: drop-shadow(0 0 6px var(--accent)) drop-shadow(0 0 14px rgba(232,255,0,0.25)); }
        }
        @keyframes dot-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        .star-trigger { transition: transform 0.1s ease, opacity 0.15s ease; }
        .star-trigger:focus-visible { outline: 1px solid var(--accent); outline-offset: 4px; }
        .star-svg { animation: star-rotate 12s linear infinite, star-filter 7s ease-in-out infinite; }
        .online-dot { animation: dot-blink 2s ease-in-out infinite; }
        .chat-textarea::placeholder { color: var(--muted); opacity: 1; }
        .chat-close { transition: color 0.15s; }
        .chat-close:hover { color: var(--accent) !important; }
        .chip-btn { transition: border-color 0.15s, color 0.15s; }
        .chip-btn:hover, .chip-btn:focus-visible { border-color: var(--accent) !important; color: var(--accent) !important; }
        .chip-btn:focus-visible { outline: 1px solid var(--accent); outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) {
          .star-svg  { animation: star-filter 4s ease-in-out infinite !important; }
          .online-dot { animation: none !important; }
        }
      `}</style>

      {/* ── Star trigger ── */}
      <button
        ref={triggerRef}
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close chat" : S.ariaOpen}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="star-trigger"
        style={{
          position: "fixed",
          bottom: "32px",
          right: "32px",
          zIndex: 50,
          width: "44px",
          height: "44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          opacity: open ? 0.3 : 1,
        }}
      >
        <StarSVG />
      </button>

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={S.ariaChat}
            initial={
              prefersReduced ? { opacity: 0 } : { clipPath: clipOrigin }
            }
            animate={
              prefersReduced ? { opacity: 1 } : { clipPath: clipFull }
            }
            exit={
              prefersReduced ? { opacity: 0 } : { clipPath: clipOrigin }
            }
            transition={
              prefersReduced
                ? { duration: 0.2 }
                : {
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                  }
            }
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              width: "min(420px, 100vw)",
              height: "100dvh",
              zIndex: 40,
              display: "flex",
              flexDirection: "column",
              background:
                "color-mix(in srgb, var(--surface) 85%, transparent)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderLeft: "1px solid var(--accent)",
              overflow: "hidden",
            }}
          >
            <NoiseGrain />

            {/* Content layer above grain */}
            <div
              style={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 20px",
                  borderBottom: "1px solid var(--border)",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span
                    className="online-dot"
                    aria-hidden="true"
                    style={{
                      display: "block",
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#22c55e",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(1.1rem, 4vw, 1.6rem)",
                      letterSpacing: "0.03em",
                      color: "var(--text)",
                      lineHeight: 1,
                    }}
                  >
                    SANTIAGO VITTOR
                  </span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close chat"
                  className="chat-close"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text)",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.8125rem",
                    letterSpacing: "0.05em",
                    padding: "8px 10px",
                    minWidth: "40px",
                    minHeight: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  [CLOSE]
                </button>
              </div>

              {/* Transcript */}
              <div
                ref={scrollRef}
                aria-live="polite"
                aria-atomic="false"
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "24px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                {/* Greeting */}
                {messages.length === 0 && !error && (
                  <div style={{ display: "flex", gap: "6px" }}>
                    <span
                      aria-hidden="true"
                      style={{ color: "var(--accent)", flexShrink: 0 }}
                    >
                      ▸
                    </span>
                    <span
                      style={{
                        color: "var(--text)",
                        fontFamily: "var(--font-body)",
                        lineHeight: 1.7,
                      }}
                    >
                      <WordReveal text={S.greeting} reduced={prefersReduced} />
                    </span>
                  </div>
                )}

                {/* Quick action chips */}
                {messages.length === 0 && !error && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {S.chips.map((label) => (
                      <button
                        key={label}
                        onClick={() => sendMessage({ text: label })}
                        aria-label={label}
                        className="chip-btn"
                        style={{
                          background: "none",
                          border: "1px solid var(--border)",
                          color: "var(--muted)",
                          fontFamily: "var(--font-body)",
                          fontSize: "0.8125rem",
                          padding: "8px 12px",
                          cursor: "pointer",
                          borderRadius: 0,
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Message turns */}
                {messages.map((msg) => {
                  const text = extractText(msg.parts as LoosePart[]);
                  const bookingPart = (msg.parts as LoosePart[]).find(
                    (p) => p.type === "tool-request_booking",
                  );
                  if (!text && !bookingPart) return null;

                  if (msg.role === "assistant") {
                    return (
                      <div key={msg.id} style={{ display: "flex", gap: "6px" }}>
                        <span
                          aria-hidden="true"
                          style={{ color: "var(--accent)", flexShrink: 0 }}
                        >
                          ▸
                        </span>
                        <div
                          style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                          }}
                        >
                          {text && (
                            <span
                              style={{
                                color: "var(--text)",
                                fontFamily: "var(--font-body)",
                                lineHeight: 1.7,
                              }}
                            >
                              <WordReveal text={text} reduced={prefersReduced} />
                            </span>
                          )}
                          {bookingPart &&
                            (bookingPart.state === "output-error" ? (
                              <div
                                style={{
                                  fontFamily: "var(--font-body)",
                                  color: "var(--text)",
                                  lineHeight: 1.7,
                                }}
                              >
                                Couldn&apos;t load the calendar.{" "}
                                <a
                                  href={SITE.whatsapp}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    color: "var(--accent)",
                                    textDecoration: "underline",
                                    textUnderlineOffset: "3px",
                                  }}
                                >
                                  → WhatsApp
                                </a>
                              </div>
                            ) : (
                              <CalEmbed />
                            ))}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id}
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <span
                        style={{
                          color: "var(--accent)",
                          fontFamily: "var(--font-body)",
                          lineHeight: 1.7,
                          textAlign: "right",
                          maxWidth: "85%",
                        }}
                      >
                        {text}
                        <span
                          aria-hidden="true"
                          style={{ color: "var(--muted)" }}
                        >
                          {" "}
                          _
                        </span>
                      </span>
                    </div>
                  );
                })}

                {/* Thinking indicator */}
                {status === "submitted" && (
                  <ThinkingIndicator reduced={prefersReduced} />
                )}

                {/* Error */}
                {error && (
                  <div style={{ display: "flex", gap: "6px" }}>
                    <span
                      aria-hidden="true"
                      style={{ color: "var(--accent-2)", flexShrink: 0 }}
                    >
                      !
                    </span>
                    <span
                      style={{
                        color: "var(--text)",
                        fontFamily: "var(--font-body)",
                        lineHeight: 1.7,
                      }}
                    >
                      {S.errorMsg}{" "}
                      <a
                        href={SITE.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "var(--accent)",
                          textDecoration: "underline",
                          textUnderlineOffset: "3px",
                        }}
                      >
                        → WhatsApp
                      </a>
                    </span>
                  </div>
                )}
              </div>

              {/* Input */}
              <div
                style={{
                  borderTop: "1px solid var(--border)",
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "8px",
                  flexShrink: 0,
                }}
              >
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={S.placeholder}
                  rows={1}
                  className="chat-textarea"
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9375rem",
                    color: "var(--accent)",
                    caretColor: "var(--accent)",
                    resize: "none",
                    lineHeight: 1.5,
                    padding: "8px 0",
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={isStreaming || !input.trim()}
                  aria-label="Send message"
                  style={{
                    background: "none",
                    border: "none",
                    cursor:
                      isStreaming || !input.trim() ? "default" : "pointer",
                    color: "var(--accent)",
                    fontSize: "1.1rem",
                    opacity: isStreaming || !input.trim() ? 0.4 : 1,
                    transition: "opacity 0.15s",
                    padding: "8px",
                    minWidth: "32px",
                    minHeight: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  ▸
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
