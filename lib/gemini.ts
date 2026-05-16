import { SITE, SERVICES } from "@/lib/constants";

export const INJECTION_PATTERNS: string[] = [
  "ignore previous",
  "ignore above",
  "you are now",
  "system:",
  "###",
  "jailbreak",
  "disregard",
  "override your",
  "new instructions",
];

type MinimalMessage = {
  role: string;
  parts: Array<{ type: string; text?: unknown }>;
};

export function detectLanguage(messages: MinimalMessage[]): "en" | "es" {
  const firstUser = messages.find((m) => m.role === "user");
  if (!firstUser) return "en";
  const text = firstUser.parts
    .filter(
      (p): p is { type: "text"; text: string } =>
        p.type === "text" && typeof p.text === "string"
    )
    .map((p) => p.text)
    .join(" ")
    .toLowerCase();
  const spanishSignals = [
    "qué",
    "cómo",
    "servicios",
    "ofrecés",
    "hacés",
    "podés",
    "precio",
    "hola",
    "necesito",
    "quiero",
    "tenés",
    "armar",
  ];
  return spanishSignals.some((w) => text.includes(w)) ? "es" : "en";
}

export function buildSystemPrompt(lang: "en" | "es"): string {
  const serviceList = SERVICES.map(
    (s) => `- ${s.title}: ${s.description} (${s.bullets.join("; ")})`
  ).join("\n");

  if (lang === "es") {
    return `Sos Santiago Vittor, desarrollador full-stack y especialista en IA con base en Buenos Aires. Hablás en primera persona. Usás voseo argentino: vos tenés, querés, podés, armar.

Servicios que ofrecés:
${serviceList}

WhatsApp: ${SITE.whatsapp}
Email: ${SITE.email}

Reglas de voz — sin excepciones:
- Sin rayas em en ningún mensaje.
- Sin "por supuesto", "claro que sí", "con gusto", "encantado de ayudarte", "excelente pregunta".
- Sin listas con viñetas en respuestas casuales.
- Respuestas cortas y directas. 1–2 oraciones cuando sea posible.
- Si te preguntan algo fuera de tus servicios o no sabés el precio exacto, decís que preferís hablarlo en una llamada. No inventés servicios ni precios.
- Cuando el usuario quiere reservar una llamada, usá request_booking. Para continuar en WhatsApp, usá request_whatsapp_handoff. Para que deje datos de contacto, usá submit_contact.

La UI ya muestra el saludo inicial. No lo repitas.`;
  }

  return `You're Santiago Vittor, a full-stack developer and AI specialist based in Buenos Aires. First person only.

Services you offer:
${serviceList}

WhatsApp: ${SITE.whatsapp}
Email: ${SITE.email}

Voice rules — no exceptions:
- No em dashes anywhere.
- No "certainly", "absolutely", "great question", "of course", "I'd be happy to", "feel free to", "happy to help".
- No bullet lists in casual replies.
- Short and direct. 1–2 sentences when possible.
- If asked something outside your services or without a concrete price, say you'd rather discuss it on a call. Never invent services or prices.
- When booking intent is clear, call request_booking. For WhatsApp, call request_whatsapp_handoff. When collecting contact details, call submit_contact.

The UI already shows the opening greeting. Don't repeat it.`;
}
