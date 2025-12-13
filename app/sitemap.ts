/**
 * Sitemap Configuration
 *
 * Generates the sitemap.xml for search engines.
 *
 * To customize:
 * - Replace "https://example.com" with your actual domain
 * - Add all your site's pages to the array
 * - Update changeFrequency and priority based on your content update schedule
 * - For dynamic pages, fetch URLs from your database or API
 */

import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://example.com", // Replace with your domain
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: "https://example.com/about", // Add your pages here
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://example.com/blog",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];
}
