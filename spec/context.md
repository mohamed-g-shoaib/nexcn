# Forge Context

Last updated: 2026-04-11

## Purpose

This file is the working memory for the Forge rebuild. It exists to keep the project grounded in current facts and reduce drift, stale assumptions, and legacy Nexcn carryover.

## Current Repository State

- The old project has been moved into [deprecated/](/D:/Developer/nexcn/deprecated).
- The active rebuild surface is now the repository root.
- A real single-package Forge generator now exists in the active root under `src/`.
- Forge is now additionally being shaped as a published initializer experience:
  - published package direction: `create-use-forge`
  - direct executable direction: `forge`
  - expected initializer entrypoints:
    - `npm create use-forge@latest`
    - `pnpm create use-forge`
    - `bun create use-forge`
    - `yarn create use-forge`
- The first implemented and verified generation paths are:
  - `next + base + rtl`
  - `next + radix + rtl`
  - `next + base + non-rtl`
  - `next + radix + non-rtl`
  - `vite + base + rtl`
  - `vite + radix + rtl`
  - `vite + base + non-rtl`
  - `vite + radix + non-rtl`
  - `start + base + rtl`
  - `start + radix + rtl`
  - `start + base + non-rtl`
  - `start + radix + non-rtl`
- Forge can now scaffold through shadcn, apply the Next overlay, install the sound feature pack, and verify the generated app with typecheck and build steps.
- The Next overlay implementation has been split into smaller focused modules under `src/overlays/next/` so the overlay coordinator stays small and easier to extend.
- Forge can now generate retained fixtures into `fixtures/` via `forge generate --fixture`.
- Forge now retains verified regression fixtures for Next, Vite, and TanStack Start.
- Retained fixture directory shape is now flat:
  - `fixtures/<fixture-name>/...`
  - the legacy nested wrapper shape (`fixtures/<fixture-name>/<fixture-name>/...`) is deprecated
- Forge now supports three code-quality options in the active Next happy path:
  - `Biome`
  - `ESLint + Prettier`
  - `Oxlint + Oxfmt`
- Forge now normalizes generated projects back to the user-selected package manager after scaffold-time temp commands so internal shadcn execution does not leak the wrong lockfile or install layout into the final app.
- Forge must own the final target-directory UX:
  - if upstream scaffold tooling nests the app one level deeper, Forge should flatten that away before handing the project to the user
  - `forge generate --name .` should target the current empty working directory rather than forcing a second folder
- Generated starter READMEs now reflect the selected package manager instead of assuming `pnpm`.
- Forge package-manager verification is now code-proven for `pnpm`, `npm`, `bun`, and `yarn`.
- Forge dependency freshness is now an active generator concern rather than manual cleanup:
  - generated apps normalize direct dependencies and devDependencies to current npm `latest` dist-tags before final install
  - current latest verification has been exercised across Next, Vite, and TanStack Start
  - compatibility follow-through now includes TypeScript 6 CSS declarations, Vite 8 config cleanup, and TanStack Start tsconfig normalization
- Forge now emits minimal default metadata across Next, Vite, and TanStack Start with zero extra setup:
  - title and description derived from `projectName`
  - robots default `index/follow`
  - baseline Open Graph and Twitter tags
  - no forced canonical URL configuration
  - RTL-enabled apps now include `og:locale` and `og:locale:alternate` tags for improved multilingual social sharing
- Forge branded favicon source is now canonicalized at `assets/branding/favicon.ico` for generation output.
- Vite and TanStack Start generation must emit explicit head links to `/favicon.ico`; Next.js continues to use App Router favicon file conventions.
- Generated apps must ship framework-native fallback handling rather than ad hoc screens only:
  - Next.js should use documented App Router error and not-found file conventions
  - Vite and TanStack Start should generate framework-appropriate error/not-found route surfaces
  - fallback screens should reuse the same app styling language instead of introducing a separate visual treatment
  - fallback actions should avoid history-dependent `Go back`; not-found states should offer `Go home`, and error states should offer `Try again` plus `Go home`
  - RTL fallback copy should be translated into Arabic rather than left in English
- TanStack Start not-found handling is route-boundary sensitive:
  - if `notFound()` is thrown inside `/$locale`, that route must define `notFoundComponent`
  - relying only on a root-level `defaultNotFoundComponent` or `notFoundComponent` is insufficient for this path
- Generated starter interaction polish now treats fallback actions like the rest of the app shell:
  - buttons on error/not-found surfaces should use the same click sound behavior
  - home navigation waits briefly after the click sound starts so the interaction does not feel cut off
  - clickable elements should keep pointer affordance in generated CSS (`button`, `[role="button"]`, links, `summary`, and labels with `for`)
- A separate marketing app now exists again at [marketing-site/](/D:/Developer/nexcn/marketing-site), but its direction is intentionally narrow:
  - keep the scaffolded Forge starter style intact
  - add only a header, restrained feature mentions, and an install helper
  - avoid a redesign pass that drifts away from the scaffold baseline
  - the page container should stay centered with a readable max width
  - install helper should be one integrated surface (package-manager tabs + command in one container)
  - avoid glow effects and decorative icon background chips
  - stack mentions should use icons from `marketing-site/components/marketing/icons`
  - the install helper should split into two paths:
    - `CLI create`
    - `Forge command`
  - the app-name field currently belongs only to the `Forge command` path, not the `CLI create` path
  - the install helper should expose app-name entry directly in the UI with live validation feedback for the explicit command path
  - app-name validation should mirror generator-safe naming rules instead of accepting arbitrary folder/package names
  - leading or trailing whitespace in app names should be rejected explicitly rather than silently trimmed away
  - the app-name field should read as the primary control in the helper and the active option state must stay visually obvious
  - final polish direction favors optical alignment, adequate hit areas, restrained depth, and subtle interruptible transitions rather than extra decoration
- Marketing site now has complete SEO implementation:
  - full metadata with Open Graph and Twitter Card tags
  - dynamic OG image with minimal design matching site aesthetic
  - robots.txt, sitemap.xml, and manifest.json
  - llms.txt and llms-full.txt for AI assistant discoverability
  - all content follows humanizer guidelines (no em dashes, no AI vocabulary)
- Marketing site content refinement (2026-04-10):
  - main heading changed to "Start building without the cleanup tax" (clearer value proposition)
  - subheading clarifies technical terms: "click interaction sounds" instead of "sound-ready wiring"
  - subheading mentions "pre-configured linters and formatters" explicitly
  - features list avoids repetition with stack pills and focuses on unique benefits
  - install helper heading changed to "How do you want to forge your app?" (clearer intent)
  - removed "Folder and package name" label from input field (cleaner UI)
  - updated feature icons for semantic accuracy:
    - PackageIcon for minimal/cleanup concept
    - SlidersHorizontalIcon for configuration choices
    - LanguagesIcon for multilingual/RTL support
  - all metadata updated to match new content (layout.tsx, opengraph-image.tsx, llms.txt)
  - removed exaggerating words like "real" throughout
  - replaced unclear technical jargon with plain language
  - all changes follow humanizer skill guidelines
- Marketing site domain is `https://use-forge.vercel.app/`
- Marketing site has been deployed on Vercel at `https://use-forge.vercel.app/`.
- Marketing site has a site header with logo, brand name, and theme toggle icon
- Marketing site install helper terminal mock now shows exact CLI prompts from actual implementation:
  - uses real prompt text from `src/cli/index.ts`
  - displays proper question/answer format matching Clack prompts behavior
  - terminal has macOS-style traffic light controls with accurate colors
  - terminal content uses proper monospace typography with tabular numbers
  - terminal lines animate with staggered entrance (50ms delay, opacity + translate3d)
  - terminal animation is viewport-aware using IntersectionObserver (triggers when scrolling into view)
  - animation respects prefers-reduced-motion
  - no flash of unstyled content (lines start hidden, animate smoothly)
- Marketing site page-level animations:
  - entire page uses staggered reveal animation on load
  - SiteHeader, Header, and InstallHelper sections animate with 50ms stagger
  - uses the same lightweight animation style as terminal (opacity + translate3d)
  - respects prefers-reduced-motion
  - page reveal is CSS-driven from the first server paint instead of waiting for hydration
  - fixed a cold-open issue where the page briefly rendered static before the reveal animation started
  - removed blur from the reveal animations because it made cold loads feel heavy and stuttery
- Marketing site layout includes `suppressHydrationWarning` on body tag to prevent hydration errors from browser extensions
- Marketing site now has framework-native error and not-found pages:
  - error.tsx uses Next.js App Router error boundary convention
  - global-error.tsx catches errors in root layout (includes html/body tags)
  - not-found.tsx uses Next.js App Router not-found convention
  - all pages use shared FallbackScreen component for consistent styling
  - error page includes Try again and Go home actions
  - not-found page includes only Go home action (Go back removed due to edge case where user lands directly on 404 with no history)
  - all buttons respect sound interactions via useUiSound hook with 100ms delay before navigation
  - fallback screens are centered, minimal, and match the established aesthetic
- Generated app fallback templates were aligned with the marketing-site edge-case fix:
  - generated not-found copy is now `This route does not exist yet.` / `هذا المسار غير موجود بعد.`
  - generated not-found pages expose only `Go home`
  - generated error pages expose `Try again` and `Go home`
  - `history.back()` / `router.back()` were removed from generated fallbacks because direct 404/error entries may have no useful browser history
- Published `0.1.0` had a favicon copy bug in bundled CLI mode:
  - shadcn Vite scaffold does not create a favicon by default
  - Forge generated `index.html` and `site.webmanifest` favicon references, but the bundled copy step resolved `assets/branding/favicon.ico` one directory too high
  - hotfix `0.1.1` resolves the asset from both source and published `dist/` layouts
  - `0.1.1` is published and `latest` resolves to it on npm
  - generated `D:\Developer\testforge\public\favicon.ico` was patched manually from `assets/branding/favicon.ico`
- CLI generation output was made quieter for the hotfix:
  - nested subprocess output is captured instead of streamed on successful commands
  - Forge now prints concise step labels and final next steps by default
  - interactive terminals use a restrained Clack spinner for long-running steps
  - active steps show elapsed time and completed steps show duration
  - heavy steps can show broad expectation hints instead of fake percentages
  - non-interactive output stays plain and deterministic
  - failed subprocesses still include the command, exit code, and captured output tail for debugging
  - exact `bunx --bun create-use-forge@0.1.1 generate` smoke test confirmed the quieter generation flow; bare package-manager create commands may need cache refresh after publish
  - follows the same pattern as generated Forge starters
- Release and publishing preparation is now documented in [release-and-publishing.md](/D:/Developer/nexcn/spec/release-and-publishing.md):
  - Vercel deployment should use `marketing-site` as the project root directory
  - npm publishing happens from the repository root as `create-use-forge`
  - public initializer commands should only be promoted after registry verification
  - local tarball smoke tests should use `npm exec --package <tarball>` rather than `npm create <tarball>`
- Root npm package metadata has been prepared for the first public package pass:
  - package name is now `create-use-forge` because npm blocked `create-forge` as too similar to the existing `createforge` package
  - current published version is `0.1.1`
  - package is no longer private
  - license is MIT with a root `LICENSE` file
  - homepage points to `https://use-forge.vercel.app/`
  - repository and issues metadata point to `https://github.com/mohamed-g-shoaib/forge`
  - npm `files` allowlist keeps the package limited to `dist`, `README.md`, `LICENSE`, and the branded favicon asset
  - published binaries are `forge` and `create-use-forge`
- Packaged CLI asset lookup was corrected so the branded favicon is resolved from the installed package root instead of the user's current working directory.
- Release-prep verification completed locally:
  - `pnpm install --frozen-lockfile`
  - `pnpm typecheck`
  - `pnpm test`
  - `pnpm build`
  - `npm pack --dry-run`
  - tarball smoke tests for both `forge --help` and `create-use-forge --help`
- Remaining release actions require account or registry access:
  - publish with `npm publish`
  - verify public registry entrypoints after publish
- Yarn behavior is now explicitly understood rather than treated as an anomaly:
  - Corepack resolves the nearest `package.json` with a `packageManager` field
  - modern Yarn should be treated as a Corepack-managed tool, not legacy global Yarn 1
  - Forge-generated Yarn apps should declare their own project boundary and prefer `nodeLinker: node-modules` for starter compatibility
- `nexcn` is now legacy repository naming only and should not appear in new public-facing product copy or specs.
- Forge now normalizes `package.json` name field to match user-provided project name:
  - implemented via `PackageMetadataFeaturePack` that runs early in the feature pack pipeline
  - ensures consistency between package.json and all metadata (title, og:title, twitter:title, descriptions)
  - fixes issue where scaffold tooling would set name to directory name instead of user's intended project name
- Generated app metadata improvements for multilingual SEO:
  - RTL-enabled apps now include `og:locale` and `og:locale:alternate` tags
  - Next.js: uses `openGraph.locale` and `openGraph.alternateLocale` in Metadata API
  - Vite: adds `<meta property="og:locale">` and `<meta property="og:locale:alternate">` to index.html
  - TanStack Start: adds og:locale properties to head() meta array
  - non-RTL apps remain unchanged (no locale tags for single-language starters)
  - follows 2026 multilingual SEO best practices with `en_US` / `ar_AR` format
  - documented in [metadata-improvements.md](/D:/Developer/nexcn/spec/metadata-improvements.md)

## Product Identity

- Product name: `Forge`
- Legacy name: `Nexcn`
- Public-facing and spec-facing language should use `Forge`.

## Scope

Forge is a generator/starter product that will support:

- frameworks:
  - Next.js
  - Vite
  - TanStack Start
- primitive bases:
  - Base UI
  - Radix UI
- direction modes:
  - RTL
  - non-RTL

Internal framework ids are:

- `next`
- `vite`
- `start`

User-facing label for `start` is `TanStack Start`.

## Architecture Direction

Forge should not be implemented as 6 or 12 complete template folders.

The preferred architecture is a layered generator:

1. scaffold adapter
2. framework overlay
3. feature packs

Preferred implementation direction:

- rely on current official framework tooling as much as possible
- rely on current shadcn tooling as much as possible
- let shadcn own framework/base/RTL scaffold complexity where it already does the job well
- let Forge own:
  - minimal starter experience
  - runtime provider and layout wiring
  - README and user-facing docs
  - opinionated structure
  - sound setup
  - code-quality tooling setup
  - user-facing polish

Repository structure decision:

- Forge itself starts as a single-package repo
- Forge does not use Turborepo in the first pass
- Forge stays monorepo-ready for a future `pnpm` workspace migration if it grows into multiple active apps/packages
- The current CLI experience contract is locked in [cli-experience.md](/D:/Developer/nexcn/spec/cli-experience.md).

## shadcn Baseline

Default shadcn preset:

- family: `luma`
- preset code: `b1VlIwYS`

Preset characteristics:

- base color: `neutral`
- theme: `neutral`
- chart color: `neutral`
- heading/font: `geist`
- icon library: `lucide`
- radius: `default`
- menu: `default/solid`

Command shapes currently assumed by the generator contract:

- Base UI:
  - `pnpm dlx shadcn@latest init --preset b1VlIwYS --base base --template next --rtl`
  - `npx shadcn@latest init --preset b1VlIwYS --base base --template next --rtl`
  - `yarn dlx shadcn@latest init --preset b1VlIwYS --base base --template next --rtl`
  - `bunx --bun shadcn@latest init --preset b1VlIwYS --base base --template next --rtl`
- Radix UI:
  - `pnpm dlx shadcn@latest init --preset b1VlIwYS --template next --rtl`
  - `npx shadcn@latest init --preset b1VlIwYS --template next --rtl`
  - `yarn dlx shadcn@latest init --preset b1VlIwYS --template next --rtl`
  - `bunx --bun shadcn@latest init --preset b1VlIwYS --template next --rtl`

## Starter UX Decisions

Generated starter apps must be intentionally minimal.

Users should be able to clean the starter in under 1 minute.

The starter page should include only:

- a small heading
- one short description explaining exactly where to start editing, with explicit file references when helpful for low-knowledge users
- theme switch control
- language switch control when RTL mode is enabled

When RTL mode is disabled, generated starters should stay clearly single-language:

- no language switch control
- no dead locale helpers or route segments
- no hidden multilingual state that survives from the RTL path

The starter should avoid:

- large marketing copy
- feature grids
- heavy demo layouts
- unnecessary sections

## Runtime RTL and Layout Decisions

RTL is not only a scaffold-time flag.

Forge-generated apps must handle direction at runtime in the app shell:

- dynamic `lang`
- dynamic `dir`
- persisted locale/direction across refreshes
- root-level provider composition
- correct portal direction behavior
- font switching where needed

Preferred long-term direction:

- locale should be represented in the route for frameworks that support routing well
- persistence helpers such as cookies or storage may remember preference, but should not be the primary source of locale truth

Current Next.js implementation direction:

- use route-based locale handling
- use all-prefixed locale routes:
  - `/en`
  - `/ar`
- use `/` only as an entry path that redirects to the preferred locale
- follow official Next.js App Router documentation instead of custom workarounds when conventions exist
- use documented file conventions for:
  - `not-found`
  - `error`
  - `global-error`
- prefer the documented theme integration path over custom replacements when working with App Router
- when RTL mode is disabled:
  - generate a single-language LTR app shell
  - do not generate locale routes or language switching UI
  - keep `lang="en"` and `dir="ltr"` stable without locale-routing overhead
  - keep provider wiring minimal for LTR (no locale-sync runtime helpers that only serve multilingual flows)

Current Vite implementation direction:

- use route-based locale handling with React Router declarative mode
- use all-prefixed locale routes:
  - `/en`
  - `/ar`
- use `/` only as an entry path that redirects to the default locale
- derive runtime `document.documentElement.lang` and `dir` from the active route locale
- when RTL mode is disabled:
  - generate a single-language LTR app shell
  - do not install or depend on React Router only for locale handling
  - keep `document.documentElement.lang="en"` and `dir="ltr"` stable through the root provider layer
  - keep provider wiring minimal for LTR (no locale-sync runtime helpers that only serve multilingual flows)

Current TanStack Start implementation direction:

- use route-based locale handling
- use all-prefixed locale routes:
  - `/en`
  - `/ar`
- use `/` only as an entry path that redirects to the default locale
- derive `html lang` and `html dir` from the active route locale in the root document shell
- when RTL mode is disabled:
  - generate a single-language LTR app shell
  - do not generate locale-param routes or language switching UI
  - keep `html lang="en"` and `html dir="ltr"` stable from the root document shell
  - keep provider wiring minimal for LTR (no locale-sync runtime helpers that only serve multilingual flows)

This must be handled in framework-specific root shells:

- Next.js:
  - `layout.tsx` and the root document shell
- Vite:
  - document shell and root app entry
- TanStack Start:
  - root document/app shell equivalent

Provider composition must account for:

- theme provider
- tooltip provider
- direction provider where needed
- any other provider or component that affects `html`, `children`, or portal behavior

Direction should not rely only on inheritance when official docs indicate explicit direction handling is safer.

Theme-dependent UI in generated apps must not render server/client-varying labels or icon states before mount when the active theme cannot be known during SSR.
For SSR frameworks, locale switches must not cause a temporary theme flash. The document shell should preserve the active explicit theme across locale navigations instead of repainting the default theme first.
For Vite and TanStack Start starters, the document shell should apply the stored explicit theme before React mounts so a dark/light flash does not appear on initial load or refresh.
For Next.js starters, implementation choices should remain aligned with official Next.js and package documentation rather than custom patterns that only happen to work locally.

For Next.js starters, locale-driven `lang` and `dir` should be initialized from the route locale itself.
For TanStack Start starters, locale-driven `lang` and `dir` should be initialized from the route locale itself.

## Sound and Polish Decisions

Forge should use `soundcn`.

Install commands:

- `pnpm dlx shadcn@latest add @soundcn/use-sound @soundcn/click-soft`
- `pnpm dlx shadcn@latest add @soundcn/use-sound @soundcn/switch-off`
- `pnpm dlx shadcn@latest add @soundcn/use-sound @soundcn/switch-on`

Theme mapping:

- `switch-on` for light mode
- `switch-off` for dark mode

Sound implementation requirements:

- shared
- high performance
- easy to remove
- centralized instead of duplicated across components

Generated apps should also be:

- dark/light ready
- UI sound ready
- keyboard shortcut ready if needed
- pre-customized for scrollbar and text-selection styling in CSS

## Generated App Boundaries

Generated starter apps should not include:

- internal skill setup
- internal skill routing docs
- internal `spec/` files

Generated starter apps should include:

- a clear `README.md`
- only necessary user-facing docs or guides
- the selected code-quality tooling setup when that option is enabled by the generator contract

Forge itself should use the local installed skills during development, but generated apps should stay clean and user-facing.

Forge implementation should treat the relevant local skills as the default source of engineering and design craft:

- `shadcn`
- `emil-design-eng`
- `make-interfaces-feel-better`
- `userinterface-wiki`
- `next-best-practices`
- `react-useeffect`
- `vercel-react-best-practices`
- `tanstack-start-best-practices`
- `vercel-composition-patterns`

Vite preparation should start from [vite-implementation.md](/D:/Developer/nexcn/spec/vite-implementation.md), not from a blank planning pass.
Dependency version freshness and deprecation handling should follow [dependency-freshness.md](/D:/Developer/nexcn/spec/dependency-freshness.md).
Forge should normalize generated app direct dependencies and devDependencies to current npm `latest` dist-tags before the final install so scaffold drift does not become product drift.
Freshness normalization must stay verification-backed: current generated apps should remain compatible with TypeScript 6, Next 16.2, Vite 8, and the latest TanStack Start-compatible dependency set after Forge applies its overlay patches.
The active marketing-site direction is locked in [marketing-site.md](/D:/Developer/nexcn/spec/marketing-site.md).

## Research Handling

Research in [research.md](/D:/Developer/nexcn/spec/research.md) should be treated as current enough for the current planning pass unless a genuinely new ambiguity appears.

Do not re-browse by default just because a spec edit is being made.

## Delivery Priorities

- Build the generator first.
- Generate examples later as fixtures from the generator.
- Do not hand-maintain a farm of example starters.
- Keep code-quality tooling choice aligned with the generator roadmap rather than letting it become a separate product track.

## Locked Defaults

- RTL starter language pair: `en` + `ar`
- Forge repository package manager: `pnpm`
- Example apps are generated fixtures, not hand-maintained apps
- Generated apps will support a user-facing code-quality choice:
  - `Biome`
  - `ESLint + Prettier`
  - `Oxlint + Oxfmt`

## Next Implementation Tasks

- keep the retained Next fixtures healthy as regression targets
- keep the retained Vite fixtures healthy as regression targets
- keep the retained TanStack Start fixtures healthy as regression targets
- keep code-quality behavior aligned across all three frameworks, especially where framework tooling generates files during build
- keep the retained non-RTL fixtures healthy now that the full direction matrix is implemented
- keep dependency freshness normalization aligned with current npm `latest` dist-tags for direct generated-app dependencies
- regenerate fixtures at the end of the current pass so they reflect:
  - favicon + minimal metadata defaults
  - framework-native error/not-found generation
  - latest Next/Vite/Start routing and provider fixes
- marketing site SEO is complete and production-ready
