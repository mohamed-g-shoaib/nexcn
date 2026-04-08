/**
 * Sitemap Configuration
 *
 * Generates the sitemap.xml for search engines and LLM crawlers.
 *
 * To customize:
 * - Add all your site's pages to the array
 * - Update changeFrequency and priority based on your content update schedule
 * - For dynamic pages, fetch URLs from your database or API
 */

import type { MetadataRoute } from "next";

const BASE_URL = "https://nexcn.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  // Dynamic pages with today's date for frequent updates
  const today = new Date();

  return [
    // Homepage (highest priority)
    {
      url: `${BASE_URL}/en`,
      lastModified: today,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/ar`,
      lastModified: today,
      changeFrequency: "daily",
      priority: 1.0,
      alternates: {
        languages: {
          en: `${BASE_URL}/en`,
          ar: `${BASE_URL}/ar`,
        },
      },
    },
  ];
}
