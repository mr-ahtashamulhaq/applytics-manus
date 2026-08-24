---
version: "1.0.0"
name: applytics-design-system
description: >
  APPLYTICS design system.
  product anchored in a #de0d12 red and #0f0f0f near-black brand palette.
  White canvas base. Zero gradient. No emojis. Geometric, precise, fast.
  Motion via GSAP (ScrollTrigger) + Framer Motion for UI micro-interactions.
  TextPressure component on hero. Pricing section: sharp-edged monochrome.
  Impeccable critical audit required before ship.

# ─────────────────────────────────────────────────────────────────
# COLOR TOKENS
# ─────────────────────────────────────────────────────────────────
colors:
  # Brand primaries (logo-derived)
  brand-red:         "#de0d12"   # Primary CTA, active states, key accents
  brand-red-deep:    "#b30a0f"   # Pressed / hover-dark state
  brand-red-subtle:  "#fdf1f1"   # Light tint backgrounds (error, badge bg)
  brand-black:       "#0f0f0f"   # Near-black — headlines, featured card bg
  brand-black-mid:   "#1a1a1a"   # Secondary deep surfaces

  # Canvas & surface (white + warm off-white)
  canvas:            "#ffffff"   # Page background (pure white)
  surface:           "#f7f6f5"   # Section separators, input bg, alt rows
  surface-soft:      "#fafaf9"   # Quieter section divisions
  surface-dark:      "#0f0f0f"   # Dark hero band / featured pricing card bg

  # Borders
  hairline:          "#e5e3df"   # 1px borders, card dividers
  hairline-soft:     "#edebe7"   # Quieter dividers
  hairline-strong:   "#c8c4be"   # Input borders, strong separators

  # Text hierarchy (charcoal scale)
  ink-deep:          "#0f0f0f"   # Primary headlines — near-black (NOT pure #000)
  ink:               "#1a1a1a"   # Body headings
  charcoal:          "#37352f"   # Body text warm charcoal
  slate:             "#5d5b54"   # Secondary text, labels
  steel:             "#787671"   # Tertiary, placeholders, footer links
  stone:             "#a4a097"   # Muted labels, captions
  muted:             "#bbb8b1"   # Disabled, empty states

  # On-dark surfaces
  on-dark:           "#ffffff"
  on-dark-muted:     "#a4a097"

  # Semantic
  semantic-success:  "#1aae39"
  semantic-warning:  "#dd5b00"
  semantic-error:    "#de0d12"   # Reuses brand-red — intentional

  # Application status chips
  status-draft:      "#f7f6f5"   # bg; ink text
  status-applied:    "#dbeafe"   # blue tint
  status-interview:  "#d1fae5"   # green tint
  status-rejected:   "#fde8e8"   # red tint
  status-accepted:   "#d1fae5"   # green tint (same as interview)

# ─────────────────────────────────────────────────────────────────
# TYPOGRAPHY
# ─────────────────────────────────────────────────────────────────
typography:
  # Font decision
  # Primary: "Geist" (via next/font/google) — humanist-geometric, clean,
  #   fast, trusted by Vercel/Linear aesthetic. NOT Inter (banned by taste-skill).
  #   Fallbacks: system-ui, -apple-system, Helvetica, sans-serif.
  # Mono: "Geist Mono" — for code snippets, match scores, status labels,
  #   the pricing label "PRICING", data values on the dashboard.

  font-primary:  "Geist"
  font-mono:     "Geist Mono"

  # Scale (tightening applied)
  hero-display:
    fontSize:      72px         # Desktop (mobile: 40px)
    fontWeight:    700
    lineHeight:    1.05
    letterSpacing: -2.5px
    use: TextPressure hero headline on landing page

  display-lg:
    fontSize:      52px
    fontWeight:    700
    lineHeight:    1.10
    letterSpacing: -1.5px
    use: Section openers ("Tailored. Fast. ATS-safe.")

  heading-1:
    fontSize:      40px
    fontWeight:    700
    lineHeight:    1.15
    letterSpacing: -0.75px
    use: Page-level headlines

  heading-2:
    fontSize:      32px
    fontWeight:    700
    lineHeight:    1.20
    letterSpacing: -0.5px
    use: Subsection titles

  heading-3:
    fontSize:      24px
    fontWeight:    600
    lineHeight:    1.30
    use: Card titles, form section labels

  heading-4:
    fontSize:      18px
    fontWeight:    600
    lineHeight:    1.35
    use: Feature tile titles, sidebar items

  subtitle:
    fontSize:      18px
    fontWeight:    400
    lineHeight:    1.55
    use: Hero subtitle, section intros (max 65ch)

  body-md:
    fontSize:      16px
    fontWeight:    400
    lineHeight:    1.60
    use: Primary body text (max 65ch measure)

  body-md-medium:
    fontSize:      16px
    fontWeight:    500
    lineHeight:    1.55
    use: Body emphasis, active sidebar labels

  body-sm:
    fontSize:      14px
    fontWeight:    400
    lineHeight:    1.50
    use: Secondary body, table cells

  body-sm-medium:
    fontSize:      14px
    fontWeight:    500
    lineHeight:    1.50
    use: Button labels, badge text

  caption:
    fontSize:      13px
    fontWeight:    400
    lineHeight:    1.40
    use: Help text, footnotes

  caption-bold:
    fontSize:      12px
    fontWeight:    600
    lineHeight:    1.40
    letterSpacing: 0.4px
    use: Tags, status chips

  micro-uppercase:
    fontSize:      11px
    fontWeight:    600
    lineHeight:    1.40
    letterSpacing: 1.2px
    textTransform: uppercase
    fontFamily:    "Geist Mono"
    use: Section labels ("PRICING", "HOW IT WORKS"), sidebar nav labels

  score-display:
    fontSize:      48px
    fontWeight:    700
    lineHeight:    1.00
    fontFamily:    "Geist Mono"
    use: Match score number (84%)

  data-value:
    fontSize:      14px
    fontWeight:    500
    fontFamily:    "Geist Mono"
    use: Dashboard stat numbers, dates

# ─────────────────────────────────────────────────────────────────
# BORDER RADIUS
# ─────────────────────────────────────────────────────────────────
rounded:
  # Philosophy: geometric, precise, NOT pill-heavy
  # User wants controlled radius — trustworthy, not bold.
  # Decision: keep sober 8px buttons, 6px cards,
  #   0px for the pricing section only (user-requested sharp geometry).
  none:  0px    # Pricing section cards ONLY
  xs:    3px    # Tag chips, status dots
  sm:    4px    # Inputs, small badges
  md:    6px    # Buttons (primary action)
  lg:    8px    # Cards, modals, dropdowns
  xl:    12px   # Larger containers, sidebar
  full:  9999px # Reserved for progress rings, loader dots ONLY

# ─────────────────────────────────────────────────────────────────
# SPACING
# ─────────────────────────────────────────────────────────────────
spacing:
  xxs:        4px
  xs:         8px
  sm:         12px
  md:         16px
  lg:         20px
  xl:         24px
  xxl:        32px
  xxxl:       48px
  section-sm: 64px
  section:    96px
  section-lg: 128px
  hero:       120px

# ─────────────────────────────────────────────────────────────────
# ELEVATION & SHADOWS
# ─────────────────────────────────────────────────────────────────
elevation:
  # No heavy shadows — clean geometric look
  # Tinted shadows toward warm-tan to match canvas
  0-flat:   "none; border: 1px solid {colors.hairline}"
  1-subtle: "0 1px 3px 0 rgba(15,12,8,0.05)"       # Hover-elevated tiles
  2-card:   "0 4px 12px 0 rgba(15,12,8,0.07)"       # Focused/elevated cards
  3-modal:  "0 16px 48px -8px rgba(15,12,8,0.14)"   # Modals, dropdowns
  # NO deep diffuse shadows — too heavy for MVP

# ─────────────────────────────────────────────────────────────────
# ANIMATION & MOTION
# ─────────────────────────────────────────────────────────────────
motion:
  # Decision: motion.dev (framer-motion) for UI micro-interactions.
  # GSAP (ScrollTrigger) for scroll-driven landing page reveals.
  # Both are Next.js App Router compatible with 'use client' isolation.
  # NO heavy 3D. NO particle explosions. NO laggy mesh gradients.
  # Goal: elegant, purposeful, FAST-feeling.

  library-ui:     "framer-motion"    # Buttons, modals, page transitions, stagger reveals
  library-scroll: "gsap + ScrollTrigger"  # Landing page scroll animations

  # Durations
  instant:    80ms
  fast:       150ms
  standard:   220ms
  smooth:     350ms
  slow:       500ms

  # Easings (exponential out — no bounce, no elastic per impeccable rules)
  ease-out:     "cubic-bezier(0.16, 1, 0.3, 1)"   # Standard exit ease (expo-out)
  ease-in-out:  "cubic-bezier(0.4, 0, 0.2, 1)"
  spring:       "type: spring, stiffness: 120, damping: 20"  # Framer Motion

  # Allowed animations (performance-safe: transform + opacity ONLY)
  allowed:
    - fade-in (opacity 0 → 1)
    - slide-up (translateY 12px → 0, opacity 0 → 1)
    - slide-in-left (translateX -16px → 0, opacity 0 → 1)
    - scale-up (scale 0.96 → 1, opacity 0 → 1)
    - stagger-children (100ms delay per child)
    - hover-lift (translateY -2px on interactive cards)
    - button-press (scale 0.97 on :active)
    - scroll-reveal (GSAP ScrollTrigger, scrub: false, once: true)
    - text-pressure (cursor-reactive variable font weight on hero)

  # Banned
  banned:
    - Mesh gradient animation (GPU repaint)
    - 3D perspective transforms on scroll
    - window.addEventListener('scroll') polling
    - Particle systems
    - Continuous background loops on scrolling containers
    - Lottie (unless character animation is unavoidable)

  # TextPressure config (hero only)
  text-pressure:
    fontFamily:    "Compressa VF"
    fontUrl:       "https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2"
    weight:        true
    width:         true
    italic:        false    # italic=false for trust/professional feel
    alpha:         false
    textColor:     "#0f0f0f"
    minFontSize:   36

# ─────────────────────────────────────────────────────────────────
# COMPONENTS
# ─────────────────────────────────────────────────────────────────
components:

  # ── BUTTONS ─────────────────────────────────────────────────────
  button-primary:
    bg:        "{colors.brand-red}"
    text:      "{colors.on-dark}"
    border:    "none"
    rounded:   "{rounded.md}"
    padding:   "10px 20px"
    fontSize:  "{typography.body-sm-medium}"
    hover:     "bg: {colors.brand-red-deep}"
    active:    "scale: 0.97"
    use: Primary CTA (Generate Resume, Sign Up, Save)

  button-dark:
    bg:        "{colors.brand-black}"
    text:      "{colors.on-dark}"
    border:    "none"
    rounded:   "{rounded.md}"
    padding:   "10px 20px"
    fontSize:  "{typography.body-sm-medium}"
    hover:     "bg: {colors.brand-black-mid}"
    active:    "scale: 0.97"
    use: Secondary dark action (Download PDF, Save to Tracker)

  button-secondary:
    bg:        "transparent"
    text:      "{colors.ink}"
    border:    "1px solid {colors.hairline-strong}"
    rounded:   "{rounded.md}"
    padding:   "10px 20px"
    fontSize:  "{typography.body-sm-medium}"
    hover:     "border-color: {colors.ink}, bg: {colors.surface}"
    use: Secondary outlined action

  button-ghost:
    bg:        "transparent"
    text:      "{colors.slate}"
    border:    "none"
    rounded:   "{rounded.sm}"
    padding:   "8px 12px"
    fontSize:  "{typography.body-sm}"
    hover:     "bg: {colors.surface}, text: {colors.ink}"
    use: Tertiary, nav links, cancel actions

  # ── CARDS ──────────────────────────────────────────────────────
  card-base:
    bg:        "{colors.canvas}"
    border:    "1px solid {colors.hairline}"
    rounded:   "{rounded.lg}"
    padding:   "{spacing.xl}"
    shadow:    "{elevation.0-flat}"
    hover:     "shadow: {elevation.1-subtle}, translateY: -2px"
    use: General content cards (tracker rows, feature tiles)

  card-featured:
    bg:        "{colors.surface-dark}"
    text:      "{colors.on-dark}"
    border:    "none"
    rounded:   "{rounded.lg}"
    padding:   "{spacing.xxl}"
    use: Dark-surface featured content (pricing "Professional" card)

  card-result:
    bg:        "{colors.canvas}"
    border:    "1px solid {colors.hairline}"
    rounded:   "{rounded.lg}"
    padding:   "{spacing.xxl}"
    accent:    "3px solid {colors.brand-red} left border — EXCEPTION to side-stripe ban: functional ATS pass indicator only"
    use: Generated resume result card on dashboard

  # ── INPUTS & FORMS ─────────────────────────────────────────────
  input-default:
    bg:        "{colors.canvas}"
    text:      "{colors.ink}"
    border:    "1px solid {colors.hairline-strong}"
    rounded:   "{rounded.sm}"
    padding:   "10px 14px"
    height:    44px
    fontSize:  "{typography.body-md}"
    placeholder: "{colors.stone}"

  input-focused:
    border:    "2px solid {colors.brand-red}"
    outline:   "none"

  input-error:
    border:    "2px solid {colors.semantic-error}"

  textarea:
    extends:   "input-default"
    height:    "auto (min 120px)"
    resize:    "vertical"

  # ── BADGES & STATUS ─────────────────────────────────────────────
  badge-red:
    bg:        "{colors.brand-red}"
    text:      "{colors.on-dark}"
    rounded:   "{rounded.xs}"
    padding:   "3px 8px"
    fontSize:  "{typography.caption-bold}"
    use: "MOST POPULAR" on pricing, match score high (>80%)

  badge-tag:
    bg:        "{colors.surface}"
    text:      "{colors.charcoal}"
    border:    "1px solid {colors.hairline}"
    rounded:   "{rounded.xs}"
    padding:   "3px 8px"
    fontSize:  "{typography.caption-bold}"
    use: Keyword chips, skill tags on result page

  badge-missing:
    bg:        "{colors.brand-red-subtle}"
    text:      "{colors.brand-red-deep}"
    rounded:   "{rounded.xs}"
    padding:   "3px 8px"
    fontSize:  "{typography.caption-bold}"
    use: Missing keyword chips

  status-pill:
    rounded:   "{rounded.xs}"
    padding:   "3px 10px"
    fontSize:  "{typography.caption-bold}"
    variants:
      Draft:     "bg: #f7f6f5; text: {colors.slate}"
      Applied:   "bg: #dbeafe; text: #1d4ed8"
      Interview: "bg: #d1fae5; text: #065f46"
      Rejected:  "bg: #fde8e8; text: {colors.brand-red-deep}"
      Accepted:  "bg: #d1fae5; text: #065f46"

  # ── MATCH SCORE RING ────────────────────────────────────────────
  score-ring:
    type: "SVG circle progress ring"
    size: 96px
    strokeWidth: 6px
    trackColor: "{colors.hairline}"
    fillColor:
      high (>= 80%): "{colors.brand-red}"
      mid (50-79%): "#dd5b00"
      low (< 50%): "{colors.steel}"
    labelFont: "{typography.score-display}"
    animation: "stroke-dashoffset transition 600ms {motion.ease-out}"

  # ── NAVIGATION (App Shell) ──────────────────────────────────────
  sidebar:
    width:       240px
    bg:          "{colors.canvas}"
    border:      "1px solid {colors.hairline} right"
    padding:     "{spacing.md}"
    nav-item:
      fontSize:  "{typography.body-sm-medium}"
      color:     "{colors.slate}"
      padding:   "8px 12px"
      rounded:   "{rounded.sm}"
      active:    "bg: {colors.brand-red-subtle}; color: {colors.brand-red}; font-weight: 600"
      hover:     "bg: {colors.surface}"
    logo-area:
      padding:   "{spacing.xl} {spacing.md}"

  top-nav-marketing:
    height:      64px
    bg:          "{colors.canvas}"
    border:      "1px solid {colors.hairline} bottom"
    sticky:      true
    position:    "wordmark left | nav-links center | CTA right"

  # ── PRICING SECTION (from components.md) ────────────────────────
  pricing-section:
    note: "Adapted from components.md reference. Sharp geometry (0px radius). Monochrome. No payment buttons — display only."
    layout: "Full-width, max-w-[1280px], py-[120px]"
    header:
      label: "PRICING"
      labelFont: "{typography.micro-uppercase}"
      labelStyle: "with thin horizontal divider line spanning remaining width"
      title: "Simple, transparent pricing"
      titleFont: "{typography.display-lg}"
      subtitle: "Choose the plan that fits your journey — payments launch with the full product."
      subtitleFont: "{typography.subtitle}"
      subtitleColor: "{colors.slate}"
    cards:
      grid: "3 columns desktop, 1 column mobile"
      gap: "0px (cards touch — divided by border)"
      border: "1px solid {colors.hairline}"
      outer-border: "1px solid {colors.brand-black}"
      radius: "{rounded.none} — 0px for all pricing cards"
    card-starter:
      bg: "{colors.canvas}"
      padding: "36px 40px"
      title-size: "{typography.heading-3}"
    card-professional:
      bg: "{colors.brand-black}"
      text: "{colors.on-dark}"
      padding: "56px 40px"
      extends-vertically: true
      badge: "MOST POPULAR — outlined badge, {rounded.none}"
    card-enterprise:
      bg: "{colors.canvas}"
      padding: "36px 40px"
    buttons:
      note: "Buttons shown but NON-FUNCTIONAL — no payment gateway in MVP"
      label-override: "Coming soon — buttons disabled (opacity 0.5, cursor not-allowed)"
    footer-note: "All plans include a 14-day free trial. No credit card required. (Placeholder — future pricing)"

  # ── SPECIAL COMPONENTS ──────────────────────────────────────────
  text-pressure-hero:
    component: "TextPressure (from components.md)"
    placement: "Landing page hero — primary headline only"
    config:
      text: "APPLYTICS"
      fontFamily: "Compressa VF"
      weight: true
      width: true
      italic: false
      textColor: "{colors.ink-deep}"
      minFontSize: 36
    container: "height: 200px desktop, 120px mobile; position: relative"
    note: "Variable font weight responds to cursor proximity — elegant, not gimmicky"

  progress-indicator:
    type: "4-step horizontal stepper"
    use: "Resume generation pipeline (Parsing → Tailoring → Compiling → Done)"
    step-active: "color: {colors.brand-red}; icon: animated pulse dot"
    step-done: "color: {colors.semantic-success}; icon: checkmark"
    step-pending: "color: {colors.muted}"
    connector: "1px solid {colors.hairline}"

  skeleton-loader:
    bg: "{colors.surface}"
    shimmer: "linear-gradient(90deg, {surface} 25%, {hairline-soft} 50%, {surface} 75%) — animated"
    rounded: "{rounded.sm}"
    note: "Match layout of actual content (no generic spinner)"

# ─────────────────────────────────────────────────────────────────
# PAGE-LEVEL LAYOUT
# ─────────────────────────────────────────────────────────────────
layout:
  max-width:   1280px
  gutter:      32px
  base-unit:   4px    # 4pt grid

  # App shell (authenticated)
  shell:
    sidebar:   240px
    content:   "flex-1, overflow-y: auto"
    top-bar:   "none on app pages (sidebar only)"

  # Landing page sections
  landing:
    hero:
      structure: "Split-screen: left text block + right product mockup card"
      note: "NOT centered hero (anti-slop rule from taste-skill). Left-aligned headline."
      bg: "{colors.canvas}"
    how-it-works:
      structure: "3-step horizontal (icon + label + body), dividers between"
      bg: "{colors.surface}"
    features:
      structure: "2-column zig-zag alternating (text left/image right, then image left/text right)"
      note: "NOT 3-equal-card layout (banned by taste-skill)"
    pricing:
      structure: "See pricing-section component above"
      bg: "{colors.canvas}"
    cta-banner:
      structure: "Full-width dark band ({colors.brand-black}), centered headline + red button"
    footer:
      structure: "3-column: brand+tagline | links | social/contact"
      bg: "{colors.canvas}"
      border-top: "1px solid {colors.hairline}"

# ─────────────────────────────────────────────────────────────────
# RESPONSIVE BREAKPOINTS
# ─────────────────────────────────────────────────────────────────
breakpoints:
  mobile-sm:  "<480px"
  mobile:     "480-767px"
  tablet:     "768-1023px"
  desktop:    "1024-1279px"
  wide:       "≥1280px"

responsive-rules:
  - hero font: "72px → 52px → 40px → 32px"
  - sidebar: "hidden on mobile (hamburger menu)"
  - pricing: "3-col → 1-col mobile (stacked, featured card first)"
  - feature-grid: "2-col → 1-col mobile"
  - full-height: "use min-h-[100dvh] NOT h-screen (iOS Safari bug)"
  - overflow: "html + body: overflow-x: clip (NOT hidden)"
  - long-words: "overflow-wrap: anywhere; min-width: 0 on headers"

# ─────────────────────────────────────────────────────────────────
# ICON SYSTEM
# ─────────────────────────────────────────────────────────────────
icons:
  library: "@phosphor-icons/react"
  style: "Light or Regular weight (NOT Bold — too heavy)"
  size-sm: 16px
  size-md: 20px
  size-lg: 24px
  stroke-width: "use Phosphor's built-in weight prop (not strokeWidth)"
  color: "inherit from text color unless semantic"
  banned: "Lucide 'egg' user avatar icons, emoji substitutes"

# ─────────────────────────────────────────────────────────────────
# HARD CONSTRAINTS (never violate)
# ─────────────────────────────────────────────────────────────────
constraints:
  no-gradients: true        # Zero gradient fills anywhere
  no-emojis: true           # Zero emojis in any code or copy
  no-pure-black: true       # Use #0f0f0f not #000000
  no-inter-font: true       # Use Geist, not Inter
  no-3-equal-cards: true    # Use zig-zag or asymmetric grids
  no-centered-hero: true    # Landing hero is left-aligned split-screen
  no-heavy-animation: true  # Nothing that drops FPS or causes jank
  no-window-scroll: true    # Use GSAP ScrollTrigger, not scroll listeners
  no-glassmorphism: true    # Unless purposeful (rare)
  no-gradient-text: true    # No background-clip text
  no-pill-buttons: true     # Buttons are {rounded.md} (6px), NOT full pill
  no-sidebar-stripe: "Only exception: card-result left border (functional indicator)"
  radius-pricing: "0px ONLY for pricing section cards"
  payment-buttons-disabled: true  # No active payment CTAs in MVP

# ─────────────────────────────────────────────────────────────────
# TECH IMPLEMENTATION NOTES
# ─────────────────────────────────────────────────────────────────
implementation:
  motion:
    framer-motion:
      version: "latest (v11+)"
      client-isolation: "'use client' on every animated component"
      page-transitions: "use app/template.tsx not layout.tsx"
      perpetual-animations: "isolate in React.memo leaf components"
    gsap:
      plugins: "ScrollTrigger"
      once: true          # Scroll animations play once (not repeat)
      scrub: false        # Not scrubbed — snap-in reveals
      cleanup: "strict useEffect cleanup in every useGSAP hook"
    text-pressure:
      placement: "Landing page hero section only"
      isolation: "'use client' component, loaded lazily"

  shadcn:
    customize: true       # Never use shadcn defaults — always restyle
    radius-override: "4px (--radius CSS var)"
    color-override: "brand-red for primary, charcoal for text"

  performance:
    animate-only: "transform + opacity (never width/height/top/left)"
    will-change: "sparingly, only on known-animate elements"
    grain-overlays: "fixed, pointer-events-none pseudo-elements only"
    skeleton-shimmer: "CSS animation on pseudo-element, not JS loop"
    image-format: "Next.js <Image> for all images"

# ─────────────────────────────────────────────────────────────────
# PAGE COMPONENT MAP (where each special component lives)
# ─────────────────────────────────────────────────────────────────
component-placement:
  TextPressure:        "Landing page → Hero section (headline)"
  PricingSection:      "Landing page → Pricing section (display only)"
  MatchScoreRing:      "Generate result page → top of result card"
  KeywordChips:        "Generate result page → suggested + missing keywords"
  ProgressStepper:     "Generate page → during AI pipeline execution"
  SkeletonLoader:      "All data-fetching pages while loading"
  StatusPill:          "Tracker page → every application row"
  SidebarNav:          "App shell → all /app/* routes"
  ScoreRingMini:       "Dashboard → recent resumes table"

# ─────────────────────────────────────────────────────────────────
# IMPECCABLE AUDIT PROTOCOL
# ─────────────────────────────────────────────────────────────────
audit:
  when: "After every page is built, before committing"
  command: "$impeccable critical"
  checks:
    - No gradient fills
    - No emoji in DOM
    - No Inter font
    - No 3-equal-card layouts
    - Buttons are NOT pill-shaped
    - Motion only on transform + opacity
    - Pricing buttons are disabled/visual-only
    - TextPressure only on hero headline
    - Sidebar nav has brand-red active state
    - Match score ring animates on load
    - All pages responsive at 375px
    - No horizontal overflow

# ─────────────────────────────────────────────────────────────────
# DO's
# ─────────────────────────────────────────────────────────────────
dos:
  - Use brand-red (#de0d12) as the ONLY accent — primary CTAs, active states, score ring
  - Use Geist as the primary font across every surface
  - Use Geist Mono for numbers, scores, status labels, the PRICING tag
  - Keep buttons at {rounded.md} — sober geometric, not pill
  - Use 0px radius ONLY on pricing cards (component.md spec)
  - Separate sections with surface (#f7f6f5) bg or thin hairline border
  - Keep hero split-screen: text left, product preview right
  - Use GSAP ScrollTrigger for landing scroll reveals (once, not scrubbed)
  - Use Framer Motion for UI interactions (buttons, modals, list stagger)
  - Use TextPressure on hero headline as the ONE signature interactive moment
  - Use Phosphor icons (Light weight) throughout
  - Use slide-up + stagger on list/grid reveals
  - Keep body text max 65ch
  - Use skeleton loaders that match content layout

# ─────────────────────────────────────────────────────────────────
# DON'Ts
# ─────────────────────────────────────────────────────────────────
donts:
  - Never use gradients (background, border, text)
  - Never use emojis anywhere
  - Never use Inter font
  - Never use pure #000000 or pure #ffffff without tint
  - Never use centered hero layout
  - Never use 3 equal horizontal feature cards
  - Never use pill-shaped buttons
  - Never animate layout properties (width, height, top, left)
  - Never use window.scroll event listeners — use GSAP ScrollTrigger
  - Never use heavy 3D or particle effects
  - Never put perpetual animation loops on scrolling containers
  - Never enable payment/plan buttons in MVP pricing section
  - Never use Lottie unless character animation truly requires it
  - Never use border-radius > 8px on buttons or > 12px on cards (except full for rings)
  - Never use glassmorphism decoratively
  - Never use gradient text (background-clip)
  - Never use AI cliché copy ("Seamless", "Elevate", "Next-Gen", "Unleash")
  - Never show fake stats or invented metrics
  - Never use generic "egg" avatar SVG icons