# Metadata Improvements Spec

Last updated: 2026-04-10

## Purpose

This spec documents potential improvements to the minimal SEO metadata implementation in Forge-generated starters. The current implementation follows the "minimal without forcing configuration" principle from the generator contract, but there are optional enhancements that could improve social sharing and multilingual SEO without adding complexity.

## Current State

Forge generates minimal default metadata across all three frameworks (Next.js, Vite, TanStack Start):

### What's Currently Included

- `title`: Derived from `projectName`
- `description`: Template string using `projectName`
- `robots`: Default `index, follow`
- `viewport`: Standard mobile-responsive viewport
- `charset`: UTF-8 encoding
- Open Graph basics:
  - `og:title`
  - `og:description`
  - `og:type: "website"`
- Twitter Card basics:
  - `twitter:card: "summary_large_image"`
  - `twitter:title`
  - `twitter:description`
- Favicon links (framework-appropriate)
- Manifest link

### What's Intentionally Omitted

Per the generator contract, these are deliberately not included to avoid forcing configuration:

- `og:url` / canonical URL (requires site URL configuration)
- `og:image` (requires image asset and URL configuration)
- `og:site_name` (optional, not critical for starters)
- Site-specific structured data
- Analytics tags
- Custom meta tags

## Identified Improvements

### 1. Add `og:locale` for Multilingual RTL Apps

**Status:** Optional enhancement  
**Priority:** Low  
**Complexity:** Low

#### Problem

For RTL-enabled multilingual starters (en + ar), social platforms cannot determine the content language from Open Graph metadata alone. While the HTML `lang` attribute is set correctly, Open Graph has its own locale specification.

#### Current Behavior

RTL apps generate routes like `/en` and `/ar` with correct `html lang` attributes, but Open Graph metadata is identical across both locales and lacks `og:locale`.

#### Proposed Solution

For RTL-enabled apps, add locale-aware Open Graph metadata:

**English pages (`/en`):**
```html
<meta property="og:locale" content="en_US" />
<meta property="og:locale:alternate" content="ar_AR" />
```

**Arabic pages (`/ar`):**
```html
<meta property="og:locale" content="ar_AR" />
<meta property="og:locale:alternate" content="en_US" />
```

#### Implementation Notes

- Format: Use underscore separator (e.g., `en_US`, `ar_AR`) per Open Graph protocol
- `og:locale`: Current page locale
- `og:locale:alternate`: Other available locales
- Only applies when `rtl: true` in generator config
- Non-RTL apps should omit these tags (single-language apps don't need locale specification)

#### Framework-Specific Considerations

**Next.js:**
- Add to `metadata.openGraph.locale` and `metadata.openGraph.alternateLocale`
- Derive from route locale in RTL layout

**Vite:**
- Add meta tags to `index.html` template
- For RTL apps, these would need to be static (both locales listed) or dynamically updated via client-side routing

**TanStack Start:**
- Add to `head()` meta array in root route
- Derive from route params in RTL document shell

#### Benefits

- Improved social sharing for multilingual content
- Better language targeting on Facebook, LinkedIn, and other platforms that respect Open Graph
- Clearer signal to social platforms about available translations
- Aligns with 2026 multilingual SEO best practices

#### Risks

- Minimal: This is purely additive metadata
- No breaking changes to existing functionality
- Social platforms gracefully handle missing `og:locale` (they infer from other signals)

### 2. Charset Normalization (Cosmetic)

**Status:** Non-issue  
**Priority:** None  
**Complexity:** Trivial

#### Current State

- Vite: `<meta charset="UTF-8" />`
- TanStack Start: `charSet: "utf-8"` in meta array
- Next.js: Relies on framework defaults

#### Analysis

Both `UTF-8` and `utf-8` are valid and equivalent (charset is case-insensitive per HTML spec). No action needed.

### 3. Missing `og:site_name`

**Status:** Optional, low value for starters  
**Priority:** None  
**Complexity:** Low

#### Analysis

`og:site_name` helps distinguish the site name from the page title on social platforms. However:

- For starters, `projectName` serves as both site name and page title
- Users will likely customize this anyway
- Not critical for minimal metadata approach
- Adds another field users need to understand/configure

**Recommendation:** Keep omitted per minimal approach.

### 4. Missing `og:image`

**Status:** Acceptable per contract  
**Priority:** None  
**Complexity:** Medium (requires asset + URL configuration)

#### Analysis

Social platforms will use fallback images if `og:image` is not provided. Adding a default would require:

- Generating or including a default OG image asset
- Configuring site URL (breaks "no forced configuration" principle)
- Handling different deployment scenarios (Vercel, Netlify, custom domains)

**Recommendation:** Keep omitted. Users can add when they have a deployed URL.

### 5. Missing `og:url`

**Status:** Acceptable per contract  
**Priority:** None  
**Complexity:** Medium (requires site URL configuration)

#### Analysis

`og:url` specifies the canonical URL for social sharing. However:

- Requires knowing the production domain
- Starters are often developed locally first
- Would need environment variable configuration
- Breaks "minimal without forcing configuration" principle

**Recommendation:** Keep omitted per contract.

## Implementation Priority

If any improvements are pursued:

1. **`og:locale` for RTL apps** - Only meaningful enhancement that doesn't require configuration
2. All others - Keep omitted per minimal approach

## Research References

Based on 2026 multilingual SEO best practices:

- Open Graph locale format uses underscore separator (e.g., `en_US`, not `en-US`)
- `og:locale:alternate` signals available translations to social platforms
- Multilingual sites benefit from explicit locale declaration for social sharing
- Modern social platforms (Facebook, LinkedIn, Twitter/X) respect Open Graph locale tags
- Google Search relies on `hreflang` tags (not Open Graph) for multilingual SEO

## Decision Log

### 2026-04-10: Initial Analysis

- Reviewed current metadata implementation across all three frameworks
- Confirmed alignment with generator contract (minimal approach)
- Identified `og:locale` as the only enhancement that doesn't require user configuration
- All other potential improvements either require configuration or provide minimal value for starters

### 2026-04-10: Implementation Complete

- Implemented `og:locale` and `og:locale:alternate` for RTL-enabled apps across all three frameworks
- Next.js: Added `locale` and `alternateLocale` to `openGraph` metadata object
- Vite: Added `og:locale` and `og:locale:alternate` meta tags to index.html template
- TanStack Start: Added `og:locale` and `og:locale:alternate` to head() meta array
- Non-RTL apps remain unchanged (no locale tags added for single-language apps)
- Implementation verified with test generation and build validation

## Open Questions

1. Should `og:locale` be added automatically for RTL apps, or should it remain optional?
2. If added, should it be part of the framework overlay or a separate feature pack?
3. Should non-RTL apps include `og:locale: "en_US"` for consistency, or omit it entirely?

## Related Specs

- [generator-contract.md](./generator-contract.md) - Metadata contract section
- [context.md](./context.md) - Current metadata implementation notes
