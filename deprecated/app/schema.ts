/**
 * JSON-LD Schema Generator
 *
 * Generates structured data for search engines and LLM crawlers.
 * This helps Google and AI models better understand your site's content.
 */

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Nexcn",
    url: "https://nexcn.vercel.app",
    description:
      "Production-ready Next.js 16 starter with TypeScript, Tailwind CSS, and internationalization",
    image: "https://nexcn.vercel.app/opengraph-image.png",
    sameAs: [
      // Add your social media URLs here
      // "https://twitter.com/your-handle",
      // "https://github.com/your-repo",
    ],
  };
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Nexcn",
    url: "https://nexcn.vercel.app",
    description:
      "Production-ready Next.js 16 starter with everything you need to ship fast",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://nexcn.vercel.app/search?q={search_term_string}",
      },
      query_input: "required name=search_term_string",
    },
  };
}

export function generateSoftwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Nexcn",
    description: "A production-ready Next.js 16 starter template",
    url: "https://nexcn.vercel.app",
    applicationCategory: "DeveloperApplication",
    image: "https://nexcn.vercel.app/opengraph-image.png",
    author: {
      "@type": "Organization",
      name: "Nexcn",
      url: "https://nexcn.vercel.app",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

export function generateFAQSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Nexcn?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nexcn is a production-ready Next.js 16 starter with TypeScript, Tailwind CSS v4, Base UI, shadcn/ui, internationalization, testing, and code quality tools configured out of the box.",
        },
      },
      {
        "@type": "Question",
        name: "What technologies does Nexcn include?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nexcn includes Next.js 16, React 19, TypeScript, Tailwind CSS v4, Base UI components, shadcn/ui, next-intl for i18n, Vitest for unit testing, Playwright for E2E testing, ESLint, Prettier, and Husky for code quality.",
        },
      },
      {
        "@type": "Question",
        name: "Does Nexcn support multiple languages?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, Nexcn includes built-in internationalization with next-intl supporting English and Arabic with full RTL support.",
        },
      },
      {
        "@type": "Question",
        name: "Is Nexcn free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, Nexcn is an open-source project that you can use for free.",
        },
      },
    ],
  };
}
