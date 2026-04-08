# 07. SEO Optimization Guide

This guide covers all SEO configurations in Nexcn and how to optimize for Google ranking and LLM crawling.

## Overview

Nexcn comes with comprehensive SEO setup out of the box:

- ✅ **Metadata** - Title, description, keywords, Open Graph, Twitter cards
- ✅ **Sitemap** - Auto-generated `sitemap.xml` for search engines
- ✅ **Robots.txt** - Crawler rules for Google, Bing, and LLM crawlers
- ✅ **JSON-LD Schema** - Structured data for rich snippets
- ✅ **Alternate Languages** - hreflang tags for multi-language SEO
- ✅ **Canonical URLs** - Prevents duplicate content issues
- ✅ **Open Graph** - Social media sharing optimization

## Key Files

### 1. Metadata Configuration

**File:** [app/[locale]/layout.tsx](../app/[locale]/layout.tsx)

Controls all SEO metadata including:

- Page titles and descriptions
- Keywords
- Open Graph images
- Twitter card settings
- Google Search Console verification
- Language alternates

**Example:**

```tsx
export const metadata: Metadata = {
  title: "Your Site Name",
  description: "Your site description (150-160 characters)",
  keywords: ["keyword1", "keyword2"],
  openGraph: {
    title: "Your Site Name",
    description: "Your description",
    images: [{ url: "image.png" }],
  },
};
```

### 2. Sitemap Generation

**File:** [app/sitemap.ts](../app/sitemap.ts)

Auto-generates `sitemap.xml` at `https://nexcn.vercel.app/sitemap.xml`

**Key settings:**

- `priority` - Importance of page (0-1, higher = more important)
- `changeFrequency` - How often content updates (daily, weekly, monthly)
- `lastModified` - When page was last updated

**Customize for your pages:**

```typescript
return [
  {
    url: `${BASE_URL}/en`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0, // Homepage priority
  },
  {
    url: `${BASE_URL}/about`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  },
];
```

### 3. Robots Configuration

**File:** [app/robots.ts](../app/robots.ts)

Controls which crawlers can access your site.

**Current setup:**

- ✅ Allows all crawlers to index your site
- ✅ Explicitly allows GPTBot, Claude-Web, CCBot (LLM crawlers)
- ✅ Points to your sitemap
- ✅ Sets crawl delay for performance

**To block LLM crawlers** (if needed):

```typescript
{
  userAgent: "GPTBot",
  disallow: "/",
},
```

### 4. JSON-LD Schema Markup

**File:** [app/schema.ts](../app/schema.ts)

Provides structured data so Google and AI models understand your content better.

**Includes:**

- Organization schema
- Website schema
- Software Application schema
- FAQ schema

Used in [app/[locale]/page.tsx](../app/[locale]/page.tsx) with:

```tsx
<Script
  id="organization-schema"
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
/>
```

## SEO Checklist

### Before Deploying

- [ ] Update domain in `robots.ts`

  ```typescript
  host: "https://yourdomain.com",
  sitemap: "https://yourdomain.com/sitemap.xml",
  ```

- [ ] Update domain in `sitemap.ts`

  ```typescript
  const BASE_URL = "https://yourdomain.com";
  ```

- [ ] Update domain in `layout.tsx`

  ```typescript
  metadataBase: new URL("https://yourdomain.com"),
  ```

- [ ] Update metadata in `layout.tsx`
  - Site title and description
  - Keywords
  - Open Graph image
  - Twitter handle

- [ ] Create/upload Open Graph image (1200x630px)
  - Path: `/public/opengraph-image.png`

- [ ] Create favicon (32x32px)
  - Path: `/public/icon.svg`

### After Deploying

1. **Submit Sitemap to Google Search Console**
   - Go to [Google Search Console](https://search.google.com/search-console)
   - Add your domain
   - Submit your sitemap: `https://yourdomain.com/sitemap.xml`

2. **Add Google Analytics (Optional)**

   ```tsx
   // In layout.tsx, add Google Analytics script
   ```

3. **Add Google Search Console Verification**

   ```tsx
   // In layout.tsx metadata
   verification: {
     google: "your-verification-code",
   }
   ```

4. **Test SEO**
   - [Google Rich Results Test](https://search.google.com/test/rich-results) - Validates schema markup
   - [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly) - Check mobile experience
   - [Core Web Vitals Report](https://search.google.com/search-console) - Performance metrics

## LLM Crawling Optimization

Nexcn is configured to be LLM-friendly:

✅ **Clear metadata** - Descriptive titles and descriptions help LLMs understand content  
✅ **Structured data** - JSON-LD schema provides machine-readable content  
✅ **Fast page loads** - Better crawlability and ranking  
✅ **Semantic HTML** - Proper heading hierarchy and semantic elements  
✅ **Sitemap** - Helps LLM crawlers discover all pages  
✅ **robots.txt** - Explicitly allows LLM crawlers (GPTBot, Claude-Web, etc.)

### To block LLM crawlers:

Edit [app/robots.ts](../app/robots.ts):

```typescript
{
  userAgent: "GPTBot|Claude-Web|CCBot",
  disallow: "/",
}
```

## Page-Specific Metadata

For custom metadata per page, create a `page.tsx` with:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Custom Page",
  description: "Page-specific description",
  openGraph: {
    title: "My Custom Page",
    description: "Page-specific description",
    images: [{ url: "image.png" }],
  },
};

export default function Page() {
  return <div>Content</div>;
}
```

## Advanced SEO Topics

### Canonical URLs

Prevents Google from treating similar pages as duplicates:

```tsx
alternates: {
  canonical: "https://yourdomain.com/en",
}
```

### Hreflang Tags (Multi-language)

Helps Google understand language versions:

```tsx
alternates: {
  languages: {
    en: "https://yourdomain.com/en",
    ar: "https://yourdomain.com/ar",
  },
}
```

### Open Graph Images

Social media preview optimization (1200x630px PNG/JPG):

```tsx
openGraph: {
  images: [
    {
      url: "https://yourdomain.com/og-image.png",
      width: 1200,
      height: 630,
      alt: "Description",
    },
  ],
}
```

## Performance Tips

SEO depends on site performance:

1. **Image Optimization** - Use Next.js `Image` component
2. **Code Splitting** - Lazy load components with `dynamic()`
3. **Caching** - Set appropriate cache headers
4. **CSS-in-JS** - Use Tailwind CSS (already configured)
5. **Minification** - Next.js handles this automatically

## Common Mistakes to Avoid

❌ **Keyword stuffing** - Use keywords naturally  
❌ **Duplicate content** - Use canonical URLs  
❌ **Poor mobile experience** - Test on mobile devices  
❌ **Slow page load** - Optimize images and scripts  
❌ **Missing meta tags** - Always include description  
❌ **Outdated sitemap** - Update when adding pages  
❌ **Broken links** - Check for 404 errors

## Resources

- [Google Search Central](https://developers.google.com/search)
- [Next.js SEO Guide](https://nextjs.org/learn-react/seo)
- [Vercel SEO Best Practices](https://vercel.com/guides/nextjs-seo)
- [Schema.org](https://schema.org)
- [JSON-LD.org](https://json-ld.org)

## Support

For questions or issues:

1. Check the [testing guide](./06-testing-guide.md)
2. Review Next.js documentation
3. Test with Google Search Console
