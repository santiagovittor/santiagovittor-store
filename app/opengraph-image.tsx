import { ImageResponse } from "next/og";
import { SITE } from "@/lib/constants";

export const alt = `${SITE.name}: ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SERVICES = ["Full-Stack Dev", "AI & Chatbots", "CRM Systems", "Digital Ads"];

export default function Image() {
  const tagline = SITE.tagline.toUpperCase() + " · BUENOS AIRES";
  const domain = SITE.url.replace("https://", "");

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0A0A0A",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div style={{ display: "flex", width: "8px", background: "#E8FF00", flexShrink: 0 }} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px 64px",
            flex: 1,
          }}
        >
          <div style={{ display: "flex" }}>
            <div
              style={{
                display: "flex",
                background: "#E8FF00",
                color: "#0A0A0A",
                fontSize: "18px",
                fontWeight: 700,
                padding: "6px 18px",
                fontFamily: "monospace",
                letterSpacing: "0.05em",
              }}
            >
              {domain}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "flex",
                  fontSize: "100px",
                  fontWeight: 900,
                  color: "#F0EDE6",
                  lineHeight: 0.88,
                  letterSpacing: "-0.02em",
                  fontFamily: "Impact, sans-serif",
                  textTransform: "uppercase",
                }}
              >
                SANTIAGO
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: "100px",
                  fontWeight: 900,
                  color: "#E8FF00",
                  lineHeight: 0.88,
                  letterSpacing: "-0.02em",
                  fontFamily: "Impact, sans-serif",
                  textTransform: "uppercase",
                }}
              >
                VITTOR
              </div>
            </div>
            <div
              style={{
                display: "flex",
                fontSize: "20px",
                color: "#555555",
                fontFamily: "monospace",
                letterSpacing: "0.06em",
              }}
            >
              {tagline}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "row", gap: "12px" }}>
            <div style={{ display: "flex", border: "1px solid #222222", color: "#555555", fontSize: "15px", padding: "8px 16px", fontFamily: "monospace" }}>
              {SERVICES[0]}
            </div>
            <div style={{ display: "flex", border: "1px solid #222222", color: "#555555", fontSize: "15px", padding: "8px 16px", fontFamily: "monospace" }}>
              {SERVICES[1]}
            </div>
            <div style={{ display: "flex", border: "1px solid #222222", color: "#555555", fontSize: "15px", padding: "8px 16px", fontFamily: "monospace" }}>
              {SERVICES[2]}
            </div>
            <div style={{ display: "flex", border: "1px solid #222222", color: "#555555", fontSize: "15px", padding: "8px 16px", fontFamily: "monospace" }}>
              {SERVICES[3]}
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
