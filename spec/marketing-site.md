# Forge Marketing Site

Last updated: 2026-04-09

## Purpose

This file locks the current marketing-site direction.

The marketing app should start from Forge's own scaffolded output and keep that baseline style intact.

## Locked Scope

The page should add only:

- a header
- a features section
- an install helper

The rest of the scaffolded visual language should remain intact.

## Visual Rules

- preserve the scaffolded spacing, colors, surfaces, typography, and theme behavior
- do not introduce gradients, loud backgrounds, or alternate visual systems
- do not redesign the page chrome away from the starter baseline
- prefer lists and restrained section rhythm over card-heavy marketing layouts

## Theme Toggle

- keep the existing scaffolded theme control
- if monochrome icons are introduced, they must adapt correctly in light and dark themes

## Install Helper

- include a package-manager switcher
- generate commands that match the current Forge CLI contract
- keep the helper visually aligned with the scaffolded controls instead of introducing a separate design language

## Implementation Notes

- the current marketing app is LTR-only
- use the existing scaffolded provider/theme/sound setup
- keep files small and focused
