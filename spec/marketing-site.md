# Forge Marketing Site Spec

Last updated: 2026-04-09

## Purpose

This file locks the v1 marketing page direction for Forge.

It exists to keep the landing page:

- clear
- minimal
- credible
- visually strong
- free of generic AI-style page structure and copy

## Product Role

The marketing site is not a docs portal and not a dashboard.

For v1 it should do one job well:

- explain Forge quickly
- show what users can generate
- let users configure the starter
- output a copyable install command

## Scope

v1 is a single landing page built in Next.js.

Implementation starting point:

- use Forge itself to scaffold the marketing site starter
- start from the `next + base + non-rtl` path unless a later implementation reason forces `radix`
- the marketing site is LTR-only in v1
- do not carry the RTL runtime or language-switching contract into the marketing site

Required sections:

1. hero
2. features
3. configurator
4. copyable install command

Do not add:

- multi-page docs
- blog
- testimonials
- pricing
- changelog page
- complex examples gallery
- fake social proof

## Page Character

The page should feel:

- direct
- calm
- premium
- modern
- intentional

It should not feel:

- loud
- startup-cliche
- over-explained
- decorative for its own sake
- generated from a generic AI landing-page pattern

## Visual Direction

The design should follow a restrained high-end aesthetic:

- strong typography hierarchy
- generous spacing
- sharp section structure
- minimal color clutter
- careful motion
- very few visual motifs, used consistently

The page should win through proportion, rhythm, and clarity rather than volume of content.

## Content Direction

Copy should be plain, specific, and believable.

The page should read like deliberate product writing, not generated filler.

Avoid:

- inflated claims
- vague productivity language
- filler adjectives
- “best-in-class” style phrasing
- paragraphs that say little
- generic AI landing-page copy patterns
- invented claims that are not grounded in the current Forge product

Preferred copy style:

- short
- concrete
- technically literate
- product-aware
- easy to scan
- written as if it will ship, not as placeholder marketing text

## Hero

The hero should communicate:

- what Forge is
- who it is for
- what it generates

Locked headline direction:

- primary headline: `Generate the starter you actually want.`

Recommended supporting direction:

- explain that Forge generates clean starters for Next.js, Vite, and TanStack Start with Base UI or Radix, RTL or non-RTL, and opinionated setup already handled

Hero requirements:

- one clear headline
- one short supporting paragraph
- one primary action tied to the configurator/install flow
- one secondary action only if it materially helps

CTA behavior:

- primary CTA should scroll directly to the configurator
- do not make the primary CTA open external pages or split attention
- secondary CTA is optional and should only exist if it adds real trust or orientation

Recommended CTA decision:

- include a secondary CTA only if GitHub is ready to be shown publicly
- otherwise ship with a single primary CTA

Hero should not contain:

- multiple stacked CTAs
- dense trust bars
- rotating words
- feature checklist overload
- terminal mockups unless they are genuinely useful and clean

## Features Section

The features section should stay concise.

Its role is to explain Forge’s real value:

- layered generator architecture
- support for Next.js, Vite, and TanStack Start
- Base UI and Radix support
- RTL and non-RTL support
- minimal starter output
- sound/theme/code-quality readiness

Feature presentation should avoid:

- large marketing cards with vague slogans
- too many feature tiles
- redundant copy

Recommended section structure:

- use a more designed asymmetric layout rather than a flat repeated card row
- each feature should prove a real reason to trust Forge
- if a visitor reaches the end of this section without understanding why Forge is better than manual setup, the section has failed
- prioritize concrete strengths:
  - layered generator architecture
  - framework and base flexibility without template sprawl
  - real RTL/runtime handling
  - minimal output that is easy to clean
  - opinionated tooling, theme, sound, and polish

## Configurator

The configurator is a primary part of the page, not a side widget.

It should expose only meaningful choices:

- framework
- base
- RTL yes/no
- code-quality tooling

Default marketing-site state:

- framework: `Next.js`
- base: `Base UI`
- RTL: `No`
- code-quality: `Oxlint + Oxfmt`

Package manager should not be a primary v1 marketing control.

However, the install command block should include a package-manager switcher:

- `pnpm`
- `npm`
- `yarn`
- `bun`

The configurator output should be:

- easy to understand
- visually grounded
- clearly connected to the generated command

## Install Command

The page should show a copyable install command generated from the selected options.

Rules:

- command must reflect the locked Forge generator contract
- command area must feel deliberate and trustworthy
- copy interaction should be immediate and clear
- do not overload the command area with decorative terminal chrome
- package-manager switching should be part of the command area itself, not promoted to a primary product choice above the configurator
- package-manager preference may persist locally for convenience, but should not distort the page hierarchy

## Icons and Logos

If stack icons are needed:

- do not hand-draw or manually recreate them
- use provided assets/components from the user when needed
- prefer user-provided `.tsx` icon components when available
- do not block the page direction on missing icons

Recommended placement for user-provided icon files:

- store them in `src/components/marketing/icons/`
- keep each icon as its own small `.tsx` component
- keep an index/export file so the marketing page can swap between real icons and text fallbacks cleanly

If icons are not available yet:

- use text labels or minimal neutral placeholders during implementation

## Motion

Motion should be restrained and meaningful.

Allowed:

- subtle reveal/stagger on load
- precise hover/press behavior
- crisp copy-button feedback
- small configurator transitions

Avoid:

- constant floating motion
- large parallax effects
- excessive blur animations
- overly playful transitions

## Layout Rules

- desktop and mobile must both feel intentional
- mobile should not become a collapsed afterthought
- section spacing should stay generous
- the configurator should remain easy to use on smaller screens

## Accessibility

The page must maintain:

- clear contrast
- keyboard access
- visible focus states
- semantic heading order
- reduced-motion tolerance where relevant

## Engineering Rules

- use Next.js best practices
- keep the implementation tidy and componentized
- avoid giant files
- avoid placeholder sections that exist only to fill space
- keep content easy to revise later
- keep icon usage swappable so user-provided TSX assets can drop in cleanly later

## Locked Tone Decision

The page should lean:

- premium and product-focused
- technically literate
- restrained rather than theatrical

It should not lean:

- overly editorial
- overly developer-toy
- overstyled just to look expensive

## Skill Routing

Primary skills for this work:

- `high-end-visual-design`
- `design-taste-frontend`
- `minimalist-ui`

Supporting skills:

- `emil-design-eng`
- `make-interfaces-feel-better`
- `userinterface-wiki`
- `next-best-practices`
- `vercel-react-best-practices`
- `full-output-enforcement`

## Non-Goals

This spec does not yet cover:

- docs IA
- blog system
- analytics
- CMS
- pricing
- account flows

## Next Step

After this spec is locked:

1. define the landing-page section structure in code
2. implement the visual system and layout
3. wire the configurator to the current Forge command contract
4. refine copy only after the page structure is strong
