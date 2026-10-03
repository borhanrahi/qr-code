---
name: Precision Vector SaaS
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#3f4850'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#707881'
  outline-variant: '#bfc7d2'
  surface-tint: '#006398'
  primary: '#006194'
  on-primary: '#ffffff'
  primary-container: '#007bb9'
  on-primary-container: '#fdfcff'
  inverse-primary: '#93ccff'
  secondary: '#4e45d5'
  on-secondary: '#ffffff'
  secondary-container: '#6860ef'
  on-secondary-container: '#fffbff'
  tertiary: '#006948'
  on-tertiary: '#ffffff'
  tertiary-container: '#00855d'
  on-tertiary-container: '#f5fff7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cce5ff'
  primary-fixed-dim: '#93ccff'
  on-primary-fixed: '#001d31'
  on-primary-fixed-variant: '#004b73'
  secondary-fixed: '#e3dfff'
  secondary-fixed-dim: '#c3c0ff'
  on-secondary-fixed: '#100069'
  on-secondary-fixed-variant: '#372abf'
  tertiary-fixed: '#85f8c4'
  tertiary-fixed-dim: '#68dba9'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#005137'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-code:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: -0.01em
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.06em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system embodies an ultra-crisp, high-utility workstation aesthetic tailored for professional digital creation and analytical workflows. Built around high-precision tooling, vector customization, and data performance, the interface prioritizes crystal-clear visual hierarchies, tactile control surfaces, and frictionless density.

### Aesthetic Paradigm: Modern Precision SaaS
- **Tone:** Professional, razor-sharp, surgical, modern, dependable.
- **Visual Stance:** Ultra-clean light mode canvas with micro-fine slate borders, crisp typography, and targeted electric cyan and cobalt accents indicating interactive and live states.
- **Emotional Intent:** Instill deep user confidence during high-stakes vector generation and campaign asset management. The workspace balances surgical utility with refined studio elegance.

## Colors

The palette is engineered for high legibility, strict contrast compliance, and vivid interactive cues against a pristine multi-layer neutral foundation.

### Palette Architecture
- **Primary Accent (`#0284c7`):** Electric oceanic cyan. Used for primary calls-to-action, key vector focus nodes, active sliders, and critical workflow triggers.
- **Secondary Accent (`#4338ca`):** Rich cobalt indigo. Anchors complex studio controls, batch operations, dynamic data toggles, and metadata tags.
- **Tertiary Accent (`#059669`):** Emerald telemetry. Reserved for live scan analytics, valid code diagnostics, active API endpoints, and production health indicators.
- **Neutrals Foundation:**
  - Base White (`#ffffff`): Foreground panels, studio preview viewport, modal cards, and floating inspector sheets.
  - Sub-Canvas Slate (`#f8fafc`): Global background, workboard canvas, and page base.
  - Surface Muted (`#f1f5f9`): Inset tracks, inactive tab wells, segmented control rails, and data-table headers.
  - Border Subdued (`#e2e8f0`): Micro-fine separating lines and non-focused container strokes.
  - Slate Dark (`#0f172a`): High-contrast primary copy, headers, and active vector anchor paths.
  - Slate Muted (`#64748b`): Secondary labels, keyboard accelerators, and parameter captions.

## Typography

The type system blends the contemporary, geometric clarity of **Plus Jakarta Sans** for interfaces and narrative typography with the technical rigor of **JetBrains Mono** for payload strings, hex color codes, and precision coordinates.

### Hierarchy & Role Rules
- **Display & Headlines:** Tightly tracked headings (-0.02em to -0.03em) maximize visual punch and authority across workspace headers and modal titles without sacrificing scan speed.
- **Body Text:** Standard zero to slight negative tracking optimizes readability for dense parameter settings and configuration sidebars.
- **Monospace Tooling (`JetBrains Mono`):** Applied exclusively to dynamic QR payloads, shortlinks, color hex values, error-correction level tags (e.g., `ECC: Level H - 30%`), and coordinate inspect tooltips.

## Layout & Spacing

The layout operates on a balanced 8pt baseline rhythm with a strict dual-zone workspace structure: a pinned configuration inspector and an infinite or responsive viewport stage.

### Layout Principles
- **Global Studio Grid:** Fluid 12-column layout on desktop viewports (1280px+), scaling into fixed-width inspector docks (360px sidebar) flanking an auto-expanding preview viewport.
- **Tablet (768px – 1279px):** Inspector collapses to an off-canvas drawer or collapsible bottom sheet, while preserving the canvas focal ratio.
- **Mobile (<768px):** Single-column stacked workflow. The dynamic output card is pinned to the upper screen half, with parameter controls scrolling fluidly underneath.
- **Component Density:** Form controls and parameter rows utilize tight micro-spacing (`space-xs` and `space-sm`) to maximize visible controls above the fold, while container boundaries leverage `space-lg` to prevent visual fatigue.

## Elevation & Depth

Visual hierarchy relies on crisp, hairline structural boundaries combined with diffuse, cool-tinted ambient illumination. Neomorphic or heavy drop-shadows are avoided in favor of surgical panel separation.

### Surface Tiers & Depth Metaphor
- **Layer 0 (Canvas Base - `#f8fafc`):** The non-interactive infinite backdrop beneath artboards and work surface grids.
- **Layer 1 (Standard Card & Toolbar - `#ffffff`):** Framed by a solid 1px stroke of `#e2e8f0`. Casts an ultra-diffused shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)`.
- **Layer 2 (Floating Popovers & Flyout Menus):** Pure white container with a 1px border of `#cbd5e1`. Elevated using `0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.03)`.
- **Layer 3 (Modal Dialogs & Export Overlays):** Pinned high with backdrop scrim of `rgba(15, 23, 42, 0.35)` with a 4px blur (`backdrop-blur-sm`). Card shadow: `0 20px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`.

## Shapes

The design system employs a **Rounded** geometric rhythm (`roundedness: 2`), delivering professional software refinement without visual toyishness.

### Corner Radius Standards
- **Buttons, Form Inputs, Segment Toggles:** `0.5rem` (8px). Matches control bounds tightly to vector manipulation handles.
- **Panels, Workstation Cards, Modal Containers:** `1rem` (16px, `rounded-lg`). Creates distinct structural silhouettes against the base slate backdrop.
- **Flyouts, Dropdowns, Tooltips:** `0.5rem` (8px). Ensures crisp visual anchors next to triggering icons.
- **Status Pills, Tag Badges, Interactive Swatches:** Fully circular (`rounded-full` or 9999px) to communicate non-rectangular, atomic metadata.

## Components

### Buttons
- **Primary:** Solid `#0284c7` fill, white `#ffffff` text, subtle top inset highlight (`box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.2)`). On hover, color transitions to `#0369a1`.
- **Secondary/Outline:** Crisp `#ffffff` background with 1px `#e2e8f0` border, `#0f172a` text. On hover, background shifts to `#f8fafc` and border darkens to `#cbd5e1`.
- **Ghost:** Transparent background, slate `#475569` text, transitioning to `#f1f5f9` background on hover.

### Inputs & Vector Controls
- **Field Base:** `#ffffff` surface, 1px border of `#e2e8f0`, text in `#0f172a`. Height standard: 38px for workstation density.
- **Focus State:** 1px stroke of `#0284c7` accompanied by an electric halo: `0 0 0 3px rgba(2, 132, 199, 0.15)`.
- **Monospace Value Inputs:** Paired with unit tags (`px`, `deg`, `%`) right-aligned in `JetBrains Mono` at `#64748b`.

### Sliders & Steppers (Studio Customization)
- **Track:** 4px thickness in `#e2e8f0` with active span filled in `#0284c7`.
- **Thumb:** 16px circular disk in `#ffffff` with a 2px `#0284c7` border and elevation shadow `0 2px 4px rgba(15, 23, 42, 0.15)`.

### Cards & Inspector Panels
- **Container Structure:** `#ffffff` background, `rounded-lg` (16px), 1px `#e2e8f0` stroke. Internal padding standard: `space-lg` (20px).
- **Inspector Section Header:** Border-bottom of 1px `#f1f5f9`, padding-bottom of `space-sm`, featuring uppercase label styling (`label-caps`) in `#64748b`.

### Checkboxes & Segmented Controls
- **Checkboxes:** 18px square, `0.25rem` radius, `#e2e8f0` boundary. Selected state fills with `#0284c7` featuring a crisp white SVG check.
- **Segmented Segment Rail:** Padded track in `#f1f5f9`, containing pill toggles that switch to pure white cards with soft drop shadows when active.

### Data Metrics & Analytics Badges
- **Scan Metric Display:** Heavy `#0f172a` numeral typography paired with a mini trending chip (`#ecfdf5` background, `#059669` copy).
- **Diagnostics Tag:** Monospace status pill indicating export format (`SVG`, `PDF`, `PNG`) and payload integrity.