import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/private/", "/.next/", "/node_modules/"],
        crawlDelay: 0,
      },
      {
        // GPT crawlers for better LLM indexing
        userAgent: "GPTBot",
        allow: "/",
      },
      {
        // Claude crawlers
        userAgent: "Claude-Web",
        allow: "/",
      },
      {
        // Other AI crawlers
        userAgent: "CCBot",
        allow: "/",
      },
    ],
    sitemap: "https://nexcn.vercel.app/sitemap.xml",
    host: "https://nexcn.vercel.app",
  };
}
