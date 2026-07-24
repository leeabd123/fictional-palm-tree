# Handoff: Practice Mode Page Layouts (Tariga)

## Overview
Tariga is a Sudanese Arabic learning app. The **Flashcards** page already looks and behaves the way we want — including its floating, glassy 3D-ish card and its animations. The *other* practice modes listed in the sidebar (Deep cards, Guided practice, Shadowing, Sentence builder, Speak & respond, Conversation, Tune your ear, Your journey, Starred items) currently look unpolished.

This bundle contains an HTML **design reference** (`Tariga Shell.dc.html`) that shows a clean, cohesive layout for every one of those pages, all built on the same glass surface + theme system as Flashcards.

## ⚠️ What we actually want you to do (read this carefully)

**Copy the LAYOUT and high-level visual structure — NOT the functionality.**

- Take the **layout, composition, spacing, and visual treatment** from each mode in the reference file and apply it to the corresponding page in the real app.
- **Do NOT** wire up / replace the real app's logic. The real app already has the actual functionality (audio playback, speech recognition, deck data, spaced-repetition, etc.). Keep all of that exactly as it is.
- Think of it as: *"re-skin these pages to match this layout and the Flashcards quality bar"* — reorganize the markup/containers and styling to match the reference, then plug the app's existing data and handlers back into the new layout.
- The interactive bits in the reference (tile-picking in Sentence builder, option feedback in Tune your ear, mode routing, the Begin button) are just there to demonstrate the layout in motion. They are **illustrative**, not a spec for behavior.

## Keep the existing app animations
The real app already has nice animations (e.g. the Flashcards floating/flip card). **Keep those.** Do not strip or replace them. The reference adds some lightweight entrance animations (staggered fade/rise, badge pop, growing bars) — you may adopt those as a nice-to-have where they don't conflict, but the priority is: **existing app animations stay, layout gets fixed to match the reference.**

## About the Design File
`Tariga Shell.dc.html` is a **design reference created in HTML** — a prototype showing intended look and layout, not production code to copy line-for-line. It's authored as a "Design Component" (a `<x-dc>` template + a `Component` logic class) which is our internal prototyping format. **Do not try to port that format.** Recreate the layouts in the real app's existing environment (React/Vue/whatever the codebase uses), following the codebase's established component patterns.

## Fidelity
**High-fidelity.** Colors, typography, spacing, radii, and shadows are final. Recreate the layouts pixel-accurately using the codebase's existing components and styling approach, then reconnect real data/logic.

---

## The theme system (applies to every page)
The whole shell is driven by CSS custom properties scoped to `body`, with a light/dark toggle that flips a class on `<body>` and persists to `localStorage`. **Every page must read from these tokens** so one toggle governs the entire app (this was the original problem — sidebar and pages didn't respond to the toggle).

```
:root, body.tariga-theme-dark {
  --bg:#0f0d0b;
  --surface:rgba(255,250,242,0.04);
  --surface-border:rgba(255,255,255,0.08);
  --surface-hover:rgba(255,250,242,0.07);
  --gold:#c9a96e;  --gold-light:#e8c99a;
  --gold-border:rgba(201,169,110,0.35);
  --gold-ghost-bg:rgba(201,169,110,0.12);
  --teal:#4fd8c4; --green:#56c98f; --purple:#a78bfa; --coral:#e08a7a;
  --text-primary:#f6f1e8; --text-secondary:#a09e9a; --text-muted:#7a756e;
  --glass-shadow:0 20px 44px -26px rgba(0,0,0,0.85);
  --ambient-gold:rgba(201,169,110,0.13);
  --ring-bg:rgba(255,255,255,0.06);
  --card-blur:blur(16px);
}
body.tariga-theme-light {
  --bg:#f7f2e8;
  --surface:rgba(255,255,255,0.55);
  --surface-border:rgba(169,128,62,0.2);
  --surface-hover:rgba(255,255,255,0.85);
  --gold:#a9803e; --gold-light:#8a662e;
  --gold-border:rgba(169,128,62,0.4);
  --gold-ghost-bg:rgba(169,128,62,0.1);
  --teal:#14a38f; --green:#2c9f65; --purple:#7b57db; --coral:#c96a58;
  --text-primary:#2d2926; --text-secondary:#6e6962; --text-muted:#969088;
  --glass-shadow:0 10px 30px -10px rgba(169,128,62,0.15);
  --ambient-gold:rgba(169,128,62,0.08);
  --ring-bg:rgba(169,128,62,0.15);
  --card-blur:blur(20px);
}
```
Body transitions `background-color` and `color` over `.5s ease`. Two fixed, blurred radial "candlelight" glows (`--ambient-gold`) sit behind everything at `z-index:0`; content sits above at `z-index:2`.

## Shared building blocks (reuse these everywhere)

**Glass card (`.ts-card`)** — the base surface for almost every panel:
`background:var(--surface); border:1px solid var(--surface-border); border-radius:18px; backdrop-filter:var(--card-blur); box-shadow:var(--glass-shadow);`

**Content column** — `max-width:840px; margin:0 auto; padding:36px 32px 64px`.

**Top bar** — glass strip, `padding:18px 32px`, bottom border `--surface-border`; left-aligned italic serif page title (`Instrument Serif`, 26px, `--gold`).

**Mode intro header** (top of each mode page): a row with a round gold badge + text block, followed by a hairline divider.
- `.mode-badge`: 44×44, `border-radius:50%`, `background:var(--gold-ghost-bg)`, `color:var(--gold)`, `box-shadow:0 0 0 1px var(--gold-border), 0 8px 18px -10px var(--gold-border)`; 20px icon.
- `.mode-kicker`: 10px, `letter-spacing:.16em`, uppercase, `--gold`, weight 600.
- `.mode-lede`: 15px, `--text-secondary`, `line-height:1.65`, `max-width:580px`.
- Divider: `border-bottom:1px solid var(--surface-border); padding-bottom:22px; margin-bottom:30px`.

**Chips (`.m-chip`)** — 12px pill, `--surface-hover` bg, `--surface-border`; `.gold` variant uses `--gold-ghost-bg` / `--gold` / `--gold-border`.

**Fonts**
- UI: `DM Sans` (300–700).
- Arabic + display: `Instrument Serif` (italic used for titles), with `Noto Naskh Arabic` fallback for Arabic glyphs. Arabic text is always `direction:rtl` and right-aligned.

---

## Typography
| Use | Font | Size | Weight | Notes |
|---|---|---|---|---|
| Page title (top bar) | Instrument Serif italic | 26px | — | color `--gold` |
| Big Arabic headword | Instrument Serif / Noto Naskh | 40–58px | — | rtl, right-aligned |
| Transliteration | DM Sans italic | 14–16px | 400 | color `--purple` |
| English gloss | DM Sans | 14–19px | 400 | `--text-primary` |
| Kicker / label | DM Sans | 10–11px | 600 | uppercase, letter-spacing .12–.18em, `--text-muted`/`--gold` |
| Body / lede | DM Sans | 14–15px | 400 | `--text-secondary`, line-height 1.6–1.7 |

## Border radius / shadow tokens
- Cards: `18px`. Inner panels/tiles: `10–14px`. Chips/pills: `20px`. Round badges/mic/rings: `50%`.
- Card shadow: `--glass-shadow`. CTA shadow: `0 12px 28px -12px var(--gold)`.

---

## Screens / Views

Each **activity mode** (Deep, Guided, Shadowing, Sentence builder, Speak & respond, Conversation, Tune your ear) opens on a **Start / onboarding screen**, then reveals the activity when the user hits Begin.

### Start / onboarding screen (shared pattern for the 7 activity modes)
- **Purpose**: a calm intro before the activity starts.
- **Layout**: centered column, `max-width:520px`, text-align center.
- **Components** (top to bottom):
  - Round play badge: 78×78, `border-radius:50%`, `--gold-ghost-bg` bg, `--gold` icon, layered ring shadow `0 0 0 1px var(--gold-border), 0 0 0 10px var(--gold-ghost-bg), 0 18px 40px -16px var(--gold-border)`.
  - Kicker (uppercase, `--text-muted`).
  - Title — Instrument Serif italic, 40px, `--gold`.
  - Lede — 15.5px, `--text-secondary`, max-width 420px.
  - **3-step row** — three equal `.ts-card`-style tiles side by side (`gap:10px`), each with a numbered gold circle (30×30) + short label. Steps differ per mode (see reference).
  - **CTA button** — solid `--gold` bg, `--bg` text, `border-radius:12px`, `padding:13px 32px`, weight 600, arrow icon; hover `brightness(1.07) translateY(-1px)`.
  - Meta line — 12px `--text-muted` (e.g. "Deck source · Solja episode · 32 items").

> Whether to keep this Start screen in the real app is the team's call — it's a layout suggestion. If a mode in the app jumps straight into the activity, that's fine; the important deliverable is the **activity layout** below.

### Flashcards — DO NOT CHANGE
Already correct. Listed only for reference: stat strip (4 columns in a `.ts-card`), the floating vocab card, and Got it / Still learning / Next buttons. **Leave this page and its animations exactly as they are.**

### Deep cards + synonyms
- Single `.ts-card`, `padding:36px 40px`.
- Big headword (58px rtl) → row of transliteration + gloss + a small "noun · very Sudanese" tag pill.
- Description paragraph.
- Hairline divider → "Near-words & synonyms" label → row of `.m-chip` chips (first is `.gold`), each showing Arabic + translit.
- "In the wild" label → stacked example rows (`--surface-hover` panels): Arabic line + English under it.

### Starred items
- Intro header, then a **2-column grid** (`gap:14px`) of `.star-card`s.
- Each card: `.ts-card` styling, gold star icon pinned top-right, big Arabic word, translit (`--purple`), English gloss. Hover lifts `translateY(-3px)`.

### Guided practice
- Intro header → a **step-dot row** (small rounded bars, filled = `--gold`).
- Centered `.ts-card`: "Step 3 of 6" label, the English task prompt (22px), a hint chip, divider, then the Arabic answer (40px) + translit.
- Back / Next prompt buttons below (outline + gold-ghost).

### Shadowing
- `.ts-card` with an **audio row**: play button (round gold) + animated **waveform** (thin bars) + track meta (title/time, speed).
- Divider → a short transcript: previous/next lines dimmed (opacity .4), the **current line** highlighted in a `--gold-ghost-bg` panel with Arabic + English + translit.
- Speed chips (0.5× / 0.75× / 1×) + a record mic button.

### Sentence builder
- `.ts-card`: "Build this" label + English target.
- A **drop area** (dashed `--gold-border`, `--surface-hover`) where picked Arabic **tiles** land, right-aligned (rtl).
- Divider → a **tile bank** of tappable Arabic word tiles (`.tile`: Instrument Serif 24px, rounded, lifts on hover; used tiles fade to opacity .28).
- Clear / Check answer buttons.

### Speak & respond
- `.ts-card`: small "Scenario" header row + a **chat bubble** from the app (them) showing Arabic + translit + English.
- Below the card, centered: a large **record mic** (96px, pulsing `--coral` when recording) + "Listening…" status text.

### Conversation mode
- `.ts-card` holding a **chat thread** of bubbles: `.bubble.them` (left, `--surface-hover`) and `.bubble.me` (right, `--gold-ghost-bg`), each Arabic (22px rtl) with a quiet translit/English `.tl` line underneath.
- A composer row at the bottom: rtl placeholder + a keyboard/text mic + a gold send button.

### Tune your ear
- Intro header → centered **play button** + "Tap to play / replay" hint.
- "What did you hear?" label → a vertical list of **option rows** (`.opt`): big Arabic + faint translit. On answer, correct row → green tint, wrong pick → coral tint (this feedback is illustrative).

### Your journey — *light cleanup only*
The team likes how this looks in the **current app** — keep that. In the reference we only:
- Removed the 🔥 emoji from the streak stat.
- Made the three stats (streak / cards reviewed / recall) all use `--text-primary` instead of coral/teal/green, so they read as one calm row.
Layout otherwise: level ring (conic-gradient progress) + copy at top, a weekly **bar chart** card, and a **milestones** list (check / half / empty status dots). Apply the same two small cleanups to the real page; don't rebuild it.

### How Tariga works / Contribute / archived items
Simple centered `.ts-card` info page on the shared glass surface — no special layout needed.

---

## Interactions & Behavior (reference-only — reconnect real logic)
- **Sidebar nav**: clicking a mode swaps the page and resets its Start screen. In the real app this is your existing router.
- **Entrance animations** (safe to adopt): `.mode-anim > *` staggered rise (`modeRise .5s cubic-bezier(.22,1,.36,1)`, delays .02–.3s); badge pop (`cubic-bezier(.34,1.56,.64,1)`); journey bars grow from bottom (`barGrow .7s`); tiles/bubbles/options stagger in; answer feedback pop. All wrapped in `@media (prefers-reduced-motion: reduce)`.
- **App animations** (must keep): Flashcards floating/flip card and any existing motion — do not remove.
- Everything else (audio, mic/STT, real deck data, scoring, persistence) is **already in the app** — keep it.

## State Management (in the real app, not from the reference)
- Global: current theme (`tariga-theme-light`/`-dark` on `<body>`, persisted to `localStorage` key `tariga_shell_theme`).
- Per activity mode: `started` boolean if you keep the Start screen.
- All learning state (deck, progress, audio) stays wherever it currently lives.

## Design Tokens
See the two `:root` / `body.tariga-theme-light` blocks above — that is the complete token set (colors, blur, shadows, ring bg). Spacing is an 8-ish scale: 6/8/10/14/18/22/26/30/36/40px. Radii: 10/12/14/18px + 50%.

## Assets
- **Fonts** (Google Fonts): Instrument Serif, DM Sans, Noto Naskh Arabic.
- **Icons**: inline SVG (Heroicons-style solid), currentColor. No image assets.
- **Podcast/YouTube thumbnails** in the sidebar are CSS gradient placeholders — swap for real artwork in the app.
- No raster/image assets are required by these layouts.

## Files
- `Tariga Shell.dc.html` — the full design reference (sidebar + all mode layouts + theme system + Start screens). Open in a browser to see it live; toggle the theme with the Appearance switch in the sidebar.
- `screenshots/` — reference captures of a couple of screens (included on request).
