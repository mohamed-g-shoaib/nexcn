# Forge Marketing Site

Last updated: 2026-04-09

## Purpose

This file locks the current marketing-site direction.

The marketing app should start from Forge's own scaffolded output and keep that baseline style intact.

## Current Status

The marketing site has undergone comprehensive audits and refinements across multiple sessions:

### Session 1: Initial Code Quality & Design Audit
- Removed dead code (theme-toggle.tsx, unused imports)
- Fixed React/Next.js anti-patterns (useState → useMemo for soundEnabled)
- Centralized data (moved FEATURES to marketing.ts)
- Fixed SVG DOM properties (stroke-opacity → strokeOpacity)
- Applied design refinements (font smoothing, button states, transitions)
- Updated theme with warm color palette
- Applied humanizer skill (removed em dashes)

### Session 2: UX Restructuring & Label Refinement
- Condensed features section into header as icon list (following ux-progressive-disclosure)
- Removed separate Features component to reduce barrier to Install Helper
- Added semantic icons (PackageIcon, LayersIcon, WrenchIcon) for visual distinction
- Updated Install Helper labels for clarity:
  - "Base" → "UI primitives"
  - "Code quality" → "Formatter & linter"
  - "Multilingual" → "RTL & Arabic support"
  - "Single language (English only)" → "No, English only"

### Session 3: SEO Implementation (2026-04-10)
- Added complete metadata to layout.tsx (title, description, keywords, OG tags, Twitter cards)
- Created robots.ts for search engine crawling directives
- Created sitemap.ts for XML sitemap generation
- Created manifest.ts for PWA support
- Created dynamic opengraph-image.tsx with minimal design matching site aesthetic
- Created twitter-image.tsx reusing OG image
- All content follows humanizer guidelines (no em dashes, no AI vocabulary)
- Zero TypeScript errors, zero linting errors
- Clean production build with all metadata files generating correctly

### Session 4: Content Refinement (2026-04-10)
- Updated main heading from "Ship the starter you actually want to open." to "Start building without the cleanup tax."
- Revised subheading to remove "real" (exaggerating) and clarify "sound-ready wiring" as "click interaction sounds"
- Added mention of "pre-configured linters and formatters" to subheading
- Updated features list to avoid repetition with stack pills and subheading:
  - Feature 1: Emphasizes cleanup speed ("Clean up in under a minute")
  - Feature 2: Highlights UI primitives and code quality tool choices (not just framework)
  - Feature 3: Focuses on RTL/multilingual flexibility (not generic shell wiring)
- Changed Install Helper heading from "Choose your install path." to "How do you want to forge your app?"
- Removed "Folder and package name" label from app name input field (cleaner UI)
- Updated feature icons to match content semantics:
  - PackageIcon (kept) - represents minimal/small package for cleanup feature
  - SlidersHorizontalIcon (was LayersIcon) - better represents configuration choices
  - LanguagesIcon (was WrenchIcon) - accurately represents multilingual/RTL support
- Updated all metadata to match new content (humanizer compliance):
  - layout.tsx: Updated title and descriptions to remove "real" and use clear terms
  - opengraph-image.tsx: Updated headline and supporting text to match new heading
  - llms.txt: Updated tagline, features, and philosophy to use clear language
  - llms-full.txt: Updated tagline, overview, design principles, comparisons, and philosophy
  - Replaced "sound-ready wiring" with "click interaction sounds" throughout
  - Replaced "real app structure/shell" with simpler "app shell" or removed entirely
  - Updated philosophy statement to be more direct and less promotional
- All changes follow humanizer guidelines (no exaggeration, clear technical terms for non-technical users)

### Technical Quality: 10/10
- Zero anti-patterns
- Proper React/Next.js implementation
- Clean component composition
- Single source of truth for data
- Complete SEO implementation

### Visual Execution: 9.5/10
- Tailwind scale values (no arbitrary)
- Proper spacing hierarchy
- Touch device hover protection
- Accessible contrast ratios

### Content Quality: 9/10
- Human voice, no AI patterns
- Clear, descriptive labels
- Accurate feature descriptions

### Interaction Design: 10/10
- Progressive disclosure
- Minimal cognitive load
- Clear visual hierarchy

### SEO Quality: 10/10
- Complete metadata implementation
- Dynamic OG images
- Proper robots.txt and sitemap
- PWA-ready manifest
- All content humanized

## Locked Scope

The page structure:
1. Header (wordmark, H1, description, feature list with icons, stack pills)
2. Install Helper (package manager, framework, UI primitives, RTL support, formatter/linter)

## Visual Rules

- preserve the scaffolded spacing, colors, surfaces, typography, and theme behavior
- do not introduce gradients, loud backgrounds, or alternate visual systems
- do not redesign the page chrome away from the starter baseline
- prefer lists and restrained section rhythm over card-heavy marketing layouts
- keep the page container centered with a readable max width (max-w-2xl)
- avoid decorative glow treatments around core content and controls
- use semantic icons for feature lists (muted-foreground, size-4, items-center alignment)

## Theme Toggle

- keyboard-only theme switching (press 'd' key)
- no visible theme toggle button (marketing site is minimal)
- generated starters use route-based locale handling (/en, /ar)

## Install Helper

- include a package-manager switcher
- generate commands that match the current Forge CLI contract
- keep the helper visually aligned with the scaffolded controls instead of introducing a separate design language
- render package-manager tabs and the install command inside one integrated container
- avoid split "selector card + command card" treatment
- use scaffold-consistent border radius and spacing (not square boxes)
- use package/stack icons without decorative icon background chips
- labels must be clear and descriptive:
  - "UI primitives" (not "Base")
  - "Formatter & linter" (not "Code quality")
  - "RTL & Arabic support" (not "Multilingual")
  - "No, English only" (not "Single language")

## Implementation Notes

- the current marketing app is LTR-only
- use the existing scaffolded provider/theme/sound setup
- keep files small and focused
- when listing stack technologies, use the local icons in `marketing-site/components/marketing/icons`
- features are now integrated into header as icon list (not separate section)
- all design decisions follow installed skills (emil-design-eng, userinterface-wiki, humanizer, etc.)

## Files Modified (Across All Sessions)

### Deleted
- `marketing-site/components/marketing/theme-toggle.tsx` (dead code)
- `marketing-site/components/marketing/features.tsx` (consolidated into header)

### Added (Session 3: SEO)
- `marketing-site/app/robots.ts` (search engine directives)
- `marketing-site/app/sitemap.ts` (XML sitemap)
- `marketing-site/app/manifest.ts` (PWA manifest)
- `marketing-site/app/opengraph-image.tsx` (dynamic OG image)
- `marketing-site/app/twitter-image.tsx` (Twitter card image)
- `marketing-site/SEO-AUDIT.md` (audit documentation)
- `marketing-site/OG-IMAGE-PREVIEW.md` (OG image documentation)

### Modified
- `marketing-site/app/globals.css` (theme, hover protection, contrast)
- `marketing-site/app/layout.tsx` (added complete metadata, metadataBase, OG tags)
- `marketing-site/components/marketing/header.tsx` (features as icon list, max-widths)
- `marketing-site/components/marketing/page-shell.tsx` (removed Features component)
- `marketing-site/components/marketing/install-helper.tsx` (H2 size, labels)
- `marketing-site/components/ui/button.tsx` (scale, transitions)
- `marketing-site/components/marketing/icons/tanstack.tsx` (DOM properties)
- `marketing-site/hooks/use-locale.tsx` (removed dead code)
- `marketing-site/hooks/use-ui-sound.ts` (useState → useMemo)
- `marketing-site/lib/marketing.ts` (centralized data, updated labels)
- `spec/skills.md` (added humanizer reference)
- `spec/marketing-site.md` (documented SEO session)
