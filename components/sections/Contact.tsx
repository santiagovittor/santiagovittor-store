"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { SITE } from "@/lib/constants";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type FormValues = z.infer<typeof schema>;

const inputBase =
  "w-full font-body text-sm bg-[var(--surface)] text-[var(--text)] px-4 py-3 outline-none border border-[#222222] focus:border-[#E8FF00] transition-colors duration-200 placeholder:text-[var(--muted)]";

function WhatsAppIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export default function Contact() {
  const reduce = useReducedMotion();
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    setServerError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          website: honeypotRef.current?.value ?? "",
        }),
      });
      if (res.ok) {
        setSubmitted(true);
        reset();
      } else if (res.status === 400) {
        setServerError("Please check your inputs and try again.");
      } else {
        setServerError("Failed to send message. Please try again.");
      }
    } catch {
      setServerError("Something went wrong. Try again.");
    }
  };

  return (
    <section
      id="contact"
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
            Get in touch
          </p>
          <h2
            className="font-display leading-none tracking-wide"
            style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
          >
            CONTACT
          </h2>
        </motion.div>

        {/* Form area */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, ease: "easeOut" as const }}
          className="max-w-2xl"
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" as const }}
                className="p-8 bg-[var(--surface)] flex flex-col gap-4"
                style={{ border: "1px solid var(--accent)" }}
              >
                <span
                  className="font-display leading-none tracking-wide text-[var(--accent)]"
                  style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}
                >
                  MESSAGE RECEIVED.
                </span>
                <p className="font-body text-sm text-[var(--muted)] leading-relaxed">
                  I&apos;ll be in touch shortly. Typical response time: within
                  24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 self-start font-body text-xs tracking-[0.2em] uppercase text-[var(--muted)] hover:text-[var(--text)] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                >
                  Send another →
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit(onSubmit)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
                noValidate
              >
                {/* Name */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="contact-name"
                    className="font-body text-xs tracking-[0.2em] uppercase text-[var(--muted)]"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder="Your name"
                    {...register("name")}
                    className={inputBase}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && (
                    <span
                      id="name-error"
                      className="font-body text-xs text-[var(--accent-2)]"
                      role="alert"
                    >
                      {errors.name.message}
                    </span>
                  )}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="contact-email"
                    className="font-body text-xs tracking-[0.2em] uppercase text-[var(--muted)]"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="your@email.com"
                    {...register("email")}
                    className={inputBase}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <span
                      id="email-error"
                      className="font-body text-xs text-[var(--accent-2)]"
                      role="alert"
                    >
                      {errors.email.message}
                    </span>
                  )}
                </div>

                {/* Message */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="contact-message"
                    className="font-body text-xs tracking-[0.2em] uppercase text-[var(--muted)]"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={6}
                    placeholder="Tell me what you're building..."
                    {...register("message")}
                    className={`${inputBase} resize-none`}
                    aria-invalid={!!errors.message}
                    aria-describedby={
                      errors.message ? "message-error" : undefined
                    }
                  />
                  {errors.message && (
                    <span
                      id="message-error"
                      className="font-body text-xs text-[var(--accent-2)]"
                      role="alert"
                    >
                      {errors.message.message}
                    </span>
                  )}
                </div>

                {/* Honeypot — hidden from real users, catches bots */}
                <input
                  ref={honeypotRef}
                  type="text"
                  name="website"
                  autoComplete="off"
                  tabIndex={-1}
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    opacity: 0,
                    pointerEvents: "none",
                    width: 0,
                    height: 0,
                  }}
                />

                {serverError && (
                  <span
                    className="font-body text-xs text-[var(--accent-2)]"
                    role="alert"
                  >
                    {serverError}
                  </span>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="self-start font-body text-sm tracking-[0.15em] uppercase px-8 py-4 bg-[var(--accent)] text-[var(--bg)] transition-all duration-200 hover:bg-[var(--accent-2)] hover:text-[var(--text)] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                >
                  {isSubmitting ? "Sending..." : "Send message →"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* WhatsApp */}
          <div
            className="mt-12 pt-8"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <p className="font-body text-xs tracking-[0.2em] uppercase text-[var(--muted)] mb-4">
              Prefer to chat directly?
            </p>
            <a
              href={SITE.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 font-body text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors duration-200 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              <WhatsAppIcon />
              Message on WhatsApp
              <span className="inline-block group-hover:translate-x-1 transition-transform duration-200">
                →
              </span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
