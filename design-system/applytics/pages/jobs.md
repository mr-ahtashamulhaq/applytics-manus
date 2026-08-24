# Jobs Catalog Surface

## Design read

Reading this as: an authenticated job-discovery workspace for Pakistani job seekers, with a precise and trustworthy SaaS language, leaning toward an operate-first catalog rather than a marketing dashboard.

## Authority and overrides

The user-provided `DESIGN.md` is the source of truth for Applytics colors, typography, radius, spacing, and motion. The generated master recommendation suggested a blue and green dashboard palette with Fira fonts. Do not use that palette or typography here. Use `#de0d12`, near-black, white, warm neutral surfaces, Geist, and Geist Mono from `DESIGN.md`.

## Surface dials

Use `DESIGN_VARIANCE: 5`, `MOTION_INTENSITY: 3`, and `VISUAL_DENSITY: 6`. This is a functional catalog. Scanability and clear data states are more important than decoration.

## Layout

Use a two-column desktop layout: a narrow filter rail and a primary results column. Collapse to a single column below 768px. Keep filters visible on desktop and provide an explicit mobile filter drawer or disclosure. Use CSS Grid, not percentage flex math. Keep the main content inside a centered max-width container.

## Data behavior

Show source board, freshness, location, employment type, salary text, experience, and match explanation only when data exists. Never invent a score, salary, company logo, or posting date. Distinguish `active`, `stale`, and `expired` records with text plus color. Provide loading skeletons, a no-results state with a clear next action, a source-health notice when a feed is limited, and a retryable error state.

## Interaction

Use keyboard-accessible filter controls, visible focus rings, 44px minimum touch targets, debounced search, and server-side pagination. The primary action is one clear label per intent. Job cards must offer a direct source link and a separate action to tailor a resume. Explain recommendations with short evidence labels such as matched skills or experience alignment. Do not use hover-only information.

## Visual language

Use hairline borders, restrained surface changes, and the documented radius scale. Avoid gradients, emoji icons, fake metrics, pill-heavy layouts, heavy shadows, and decorative animation. Use one consistent icon family already present in the project or an approved icon library. Respect `prefers-reduced-motion`.

## Pre-flight

Before committing this surface, run the required Impeccable critical audit at desktop and mobile widths. Check contrast, focus order, mobile filter access, pagination state, long company names, missing fields, stale source messaging, and no horizontal overflow. Update this brief if the real catalog behavior requires a durable rule change.
