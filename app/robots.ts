import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV === "production";

  return {
    rules: isProduction
      ? [
          { userAgent: "*", allow: "/", disallow: "/api/" },
        ]
      : [{ userAgent: "*", disallow: "/" }],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
