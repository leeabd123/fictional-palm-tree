# Tariga — Full UI Implementation Guide for Claude Code

## What you are building

**Tariga** is a Sudanese Arabic learning app. You are implementing a redesigned home screen (dashboard) into the existing codebase. The visual language has three key parts, all specified below with exact code references:

1. **Homepage dashboard** — warm candlelit, parchment-and-gold palette, glassmorphic cards, 3D-tilt on hover, a WebGL orb, and a tapered SVG tree with falling ember particles. Source: `source-files/HomePage.tsx`.
2. **Tree branch detail view** — when the user taps a branch on the tree, the app navigates (or sheets in) a full-screen CSS 3D draggable/orbitable tree. Source: `source-files/tree-branch-detail/Parallax.tsx`.
3. **Background & header chrome** — dark near-black warm background (`#120a05`), an ambient radial gold glow, atmospheric fog/sparkle particle effect, and a specific top-left wordmark + top-right XP pill HUD. Reference: `source-files/Orbit.tsx` (top section only).

You do **not** need Three.js/WebGL for the branch detail view. `Parallax.tsx` is pure CSS 3D transforms — no extra dependencies beyond React.

---

## Fonts

Import via your index HTML or global CSS:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500;600;700&family=Noto+Naskh+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

- **`Instrument Serif`** — Arabic display headings (e.g. يا هلا بيك تاني, طريقة wordmark, The Tree title), italic for transliterations
- **`DM Sans`** — all body copy, labels, buttons, metadata
- **`Noto Naskh Arabic`** — Arabic labels on tree nodes and branch detail cards

---

## Colour system — CSS custom properties

Apply these as a `<style>` block or via your CSS-in-JS system. Two themes: `dark` (default) and `light`. The class `tariga-theme-dark` or `tariga-theme-light` should sit on the root wrapper.

```css
.tariga-theme-dark {
  --bg: #0f0d0b;
  --surface: rgba(255, 250, 242, 0.04);
  --surface-border: rgba(255, 255, 255, 0.08);
  --surface-hover: rgba(255, 250, 242, 0.07);
  --gold: #c9a96e;
  --gold-light: #e8c99a;
  --gold-border: rgba(201, 169, 110, 0.35);
  --gold-ghost-bg: rgba(201, 169, 110, 0.12);
  --teal: #4fd8c4;
  --green: #56c98f;
  --purple: #a78bfa;
  --coral: #e08a7a;
  --text-primary: #f6f1e8;
  --text-secondary: #a09e9a;
  --text-muted: #7a756e;
  --glass-shadow: 0 20px 44px -26px rgba(0,0,0,0.85);
  --ambient-gold: rgba(201, 169, 110, 0.13);
  --tree-trunk-start: #7d6544;
  --tree-trunk-end: #c9a96e;
  --tree-dim: rgba(255, 250, 242, 0.15);
  --card-blur: blur(16px);
  --ring-bg: rgba(255,255,255,0.06);
  --glow-green: 0 0 12px rgba(86, 201, 143, 0.4);
  --glow-gold: 0 0 12px rgba(232, 201, 154, 0.4);
  --glow-teal: 0 0 12px rgba(79, 216, 196, 0.4);
}

.tariga-theme-light {
  --bg: #f7f2e8;
  --surface: rgba(255, 255, 255, 0.5);
  --surface-border: rgba(169, 128, 62, 0.2);
  --surface-hover: rgba(255, 255, 255, 0.8);
  --gold: #a9803e;
  --gold-light: #8a662e;
  --gold-border: rgba(169, 128, 62, 0.4);
  --gold-ghost-bg: rgba(169, 128, 62, 0.1);
  --teal: #14a38f;
  --green: #2c9f65;
  --purple: #7b57db;
  --coral: #c96a58;
  --text-primary: #2d2926;
  --text-secondary: #6e6962;
  --text-muted: #969088;
  --glass-shadow: 0 10px 30px -10px rgba(169, 128, 62, 0.15);
  --ambient-gold: rgba(169, 128, 62, 0.08);
  --tree-trunk-start: #8a662e;
  --tree-trunk-end: #a9803e;
  --tree-dim: rgba(169, 128, 62, 0.2);
  --card-blur: blur(20px);
  --ring-bg: rgba(169, 128, 62, 0.15);
  --glow-green: none;
  --glow-gold: none;
  --glow-teal: none;
}
```

---

## Ambient background

Behind **all** content on the homepage, render three blurred radial gradient orbs (fixed, pointer-events-none, z-index 0) plus a subtle SVG noise overlay:

```
Orb 1: top: -20%, left: 0%, size 80%×80%, colour var(--ambient-gold), blur 100px, opacity 0.8
Orb 2: top: 20%, right: -10%, size 60%×70%, colour rgba(201,169,110,0.06), blur 90px
Orb 3: bottom: -10%, left: -10%, size 70%×60%, colour rgba(224,138,122,0.05), blur 120px
Noise: SVG feTurbulence fractalNoise, baseFrequency 0.85, numOctaves 3, opacity 0.03, mix-blend-mode overlay
```

See `source-files/HomePage.tsx` lines 916–954 for the exact JSX.

---

## TOP NAV

```
Layout: full-width flex row, space-between, border-bottom (var(--surface-border))

LEFT — wordmark:
  طريقة   ← Instrument Serif, 32px, colour var(--gold), text-shadow 0 0 8px var(--gold-border)
  TARIGA   ← DM Sans, 13px, uppercase, letter-spacing 0.2em, colour var(--text-muted), font-weight bold
  (Positioned as baseline-aligned flex row, gap 12px)

RIGHT — nav links + theme toggle:
  Links (hidden on mobile): Dashboard · Curriculum · Library
    DM Sans 14px, font-weight 500, colour var(--text-secondary)
    Active link colour: var(--gold)
  
  Theme toggle: pill-shaped toggle 56×30px, background var(--surface), border var(--surface-border)
    Thumb: 22×22px circle, background var(--gold), transitions translateX 0 (dark) → 24px (light)
    Thumb shows MoonIcon in dark mode, SunIcon in light mode (16×16 SVG icons)
```

See `source-files/HomePage.tsx` → `TopNav` component.

---

## HERO GREETING

```
Below the nav, 40px margin-top:

Freq pill (inline-flex):
  Background: var(--surface), border var(--surface-border), backdrop-blur-md
  · dot (6px circle, var(--gold)) + "FREQ: FAMILY & HOME"
  DM Sans 10px, uppercase, letter-spacing 0.2em, colour var(--text-muted)

Arabic headline:
  يا هلا بيك تاني
  Instrument Serif, 80px on desktop / 64px on mobile, colour var(--text-primary)
  dir="rtl" but text-align: left (it reads right-to-left but is left-anchored on screen)
  line-height 1.1, drop-shadow-md

Transliteration:
  ya hala beek tani — Welcome back
  Instrument Serif italic, 34px desktop / 28px mobile, colour var(--purple)
  margin-top: 4px
```

---

## HERO ROW (two-column)

Flex row on desktop, stacked on mobile, gap 24px, margin-top 24px:

### Left card — "Continue where you left off" (flex-1)

```
GlassCard: rounded-[24px], background var(--surface), border var(--surface-border),
  backdrop-filter var(--card-blur), box-shadow var(--glass-shadow)
  
  On hover: 3D tilt effect (perspective 1000px, up to ±6° rotateX/Y based on mouse position)
  A light-sheen overlay div (linear-gradient 105deg, white 12% → transparent) shifts with mouse.

Interior (padding 32px, flex row, gap 32px, vertically centred):
  
  LEFT — WebGL Orb avatar:
    80×80px circle, overflow hidden
    border: 1px solid rgba(201,169,110,0.15)
    box-shadow: 0 0 30px rgba(201,169,110,0.25)
    Contains <WebGLOrb mode="idle" /> — see source-files/WebGLOrb.tsx for the full GLSL shader.
    The orb is a warm gold/amber/copper animated blob rendered in WebGL1.
    If WebGL fails: fallback CSS radial-gradient sphere with breathe animation.
  
  CENTRE — text:
    "CONTINUE WHERE YOU LEFT OFF" — DM Sans 13px, uppercase, tracking 0.16em, colour var(--teal), bold
    "Coach · scenario 2 — "Tell me about yourself"" — 26px, font-weight 600, var(--text-primary)
    "~2 min to finish" — 15px, var(--text-muted)
  
  RIGHT — Play button:
    64×64px circle, background var(--gold-ghost-bg), border var(--gold-border), colour var(--gold-light)
    hover: scale(1.05), active: scale(0.95)
    Contains play triangle SVG (filled)
```

### Right widget — Stats (fixed 420px wide on desktop)

```
GlassCard (same shadow/border/blur as left card)
Interior: flex row, padding 32px, gap 32px, items centred

LEFT — Circular progress ring:
  SVG 120×120px, -rotate-90 (so progress starts at top)
  Background circle: stroke var(--ring-bg), strokeWidth 8
  Progress arc: stroke var(--teal), strokeWidth 8, strokeDasharray full circumference,
    strokeDashoffset = (1 - 0.62) × circumference (62% filled)
    filter: drop-shadow 0 0 6px var(--teal), strokeLinecap round
    Animate stroke-dashoffset from full to value over 1.5s ease-in-out on mount.
  Centre text: "62%" — Instrument Serif 24px bold, "DECK" — 10px uppercase teal tracking-wider

RIGHT — 3 stat rows (flex col, gap 16px):
  Mastered    34   (var(--green), textShadow var(--glow-green))
  Still learning  12   (var(--gold-light), textShadow var(--glow-gold))
  Coached scenarios  7   (var(--teal), textShadow var(--glow-teal))
  Label: DM Sans 14px, var(--text-secondary). Value: 18px bold.
```

---

## MODULE TILES (4-up grid)

Below hero row, margin-top 32px:

```
Grid: 1 col mobile → 2 col tablet → 4 col desktop, gap 24px

Each tile: rounded-[20px], padding 24px, flex-col, gap 16px
  background var(--surface), border var(--surface-border), backdrop-blur
  Same 3D tilt + light-sheen hover as GlassCard
  cursor-pointer, hover: translateY(-6px) on active tiles, (-4px) on others

Interior (top-to-bottom):
  Icon container: 48×48px circle, flex-centred
    colour: the tile's accent colour
    background: color-mix(in srgb, accentColour 12%, transparent)
    Icon: 24×24 SVG (see below)
  
  Below icon:
    Title: 18px, font-weight 600, var(--text-primary)
    Subtitle: 14px, var(--text-secondary)

Radial glow behind content (top-left origin):
  - Active tile ("Your coach"): radial-gradient from var(--gold-ghost-bg), border var(--gold-border),
    box-shadow 0 0 24px -8px var(--gold-border)
  - Other tiles: subtle radial from accent colour at 8% opacity

The four tiles:
  1. Flashcards — "Solja episode" — teal — custom card/lines SVG
  2. Your coach — "scenario 2 waiting →" — gold — WebGL orb SVG icon — ACTIVE STATE
  3. Tune your ear — "Clip 2 of 5" — purple — waveform bars SVG
  4. Your journey — "Then → now" — green — star/diamond SVG
```

---

## THE TREE SECTION

This is the main interactive journey visualisation. See `source-files/HomePage.tsx` → `JourneyTree` / `JourneyTreeInner` components for all code. Summary:

### Falling ember particles (canvas layer)

A `<canvas>` element positioned absolute, pointer-events-none, behind the SVG tree, opacity 0.6, mix-blend-mode screen.

50 particles. Each has:
- random x/y start, z depth (0–1) for parallax sizing
- size: z×2.5 + 0.5 px
- downward velocity + horizontal sway (sinusoidal)
- colour: 80% gold `rgba(201,169,110,α)`, 20% coral `rgba(224,138,122,α)`
- glow: shadowBlur + shadowColor matching particle colour
- loop: when y > height, respawn at y = -10, random x

### SVG tree (viewBox 0 0 900 660)

**Trunk:**  
A tapered filled `<path>` (NOT a stroked line). Wide at base (~46px), narrowing to ~17px at top. Control points: `(450,655) → (450,583) → (450,517) → (450,452)`. Fill: a horizontal 5-stop SVG linearGradient (`#2D1A13` → `#4A2F1D` → `#B37033` → `#4A2F1D` → `#1E100A`) so the centre glows amber and edges are dark bark. Stroke: `#1E100A` 1px. Drop-shadow filter.

The tapered path is generated by `getTaperedBranchPath(curve, startWidth, endWidth)` — see the full helper function in `source-files/HomePage.tsx` lines 394–432. It offsets perpendicular normals along the bezier, builds a mirrored closed polygon.

**Ground ellipse:** `cx=450 cy=650 rx=70 ry=14`, fill `var(--tree-dim)`, opacity 0.6, glow filter.

**Five domain branches (Family, Friends, Community, Identity, Culture):**

Each is a cubic bezier with control points defined as:
```
family:    (450,450)→(600,400)→(750,300)→(820,150)   gold    (#c9a96e)
friends:   (450,450)→(300,400)→(150,300)→(80,150)    teal    (#4fd8c4)
community: (450,450)→(520,350)→(600,250)→(650,100)   green   (#56c98f)
identity:  (450,450)→(380,350)→(300,250)→(250,100)   purple  (#a78bfa)
culture:   (450,450)→(430,350)→(470,200)→(450,80)    coral   (#e08a7a)
```

Each branch renders as:
1. **Invisible hit-area** stroke (40px wide transparent) for easy tapping
2. **Filled tapered body** using same `getTaperedBranchPath(curve, 15, 3)` — bark gradient fill, 0.75px dark outline
3. **Lit glow overlay** — only along the completed/in-progress portion (`tMax`): amber/coloured polyline, strokeWidth 5, glow filter

**Nodes** are small SVG circles placed at parameterised t-values along each bezier:
- `done`: filled solid circle r=3.5, domain colour, glow
- `next`: pulsing animated circle (SVG animate r 2.5→7→2.5 and opacity 1→0→1, 2s loop)
- `locked`: hollow circle r=2.5, fill bg, stroke var(--tree-dim)

### Click-to-zoom interaction (on the homepage tree)

When the user taps a domain label or branch, the SVG container div smoothly scale+translates to zoom in on that branch (CSS transform on the wrapper div, `transition: transform 700ms cubic-bezier(0.25,1,0.5,1)`).

Each domain has a zoom target:
```
family:    { cx: 635, cy: 300, scale: 1.9 }
friends:   { cx: 265, cy: 300, scale: 1.9 }
community: { cx: 550, cy: 275, scale: 2.0 }
identity:  { cx: 350, cy: 275, scale: 2.0 }
culture:   { cx: 450, cy: 265, scale: 2.0 }
```
Transform applied: `translate(${450 - cx}px, ${330 - cy}px) scale(${scale})` with `transformOrigin: ${cx}px ${cy}px`.

In the zoomed state:
- Other branches fade to 20% opacity
- Domain title labels fade out
- Node labels (moment names) fade in next to each node
- Clicking a node shows a small glassmorphic callout card (title, tag, "Start Session" CTA)
- "Full Tree" back button appears top-left

**See the full interaction code in `source-files/HomePage.tsx` → `JourneyTreeInner`.**

---

## BRANCH DETAIL VIEW (CSS 3D parallax tree)

When the user taps a branch on the homepage tree and you want a richer full-screen drill-down, navigate to (or sheet in) the **Parallax tree screen**. The full source is in `source-files/tree-branch-detail/Parallax.tsx`.

### What it looks like and how it works

- **Background:** near-black warm dark `#14100E`, with a radial gold glow at centre `rgba(212,175,55,0.08)`
- **CSS 3D scene:** single div with `perspective: 1000px`. All tree elements are positioned with `transform: translate3d(x,y,z)` and `transformStyle: preserve-3d`
- **Drag to rotate:** pointer events track dx/dy on the scene container, rotating the whole tree in 3D (rotateX ±25°, rotateY ±45°)
- **Node zoom:** clicking a node translates the camera focus (`translate3d`) to centre on that node and scales up (`scale(1.4)`). Clicking elsewhere zooms out to overview (`scale(0.6), translateY(175px)`)

### Tree elements (all CSS, no WebGL)

**Trunk:** 6 divs rotated around Y axis (0°, 30°, 60°… 150°), each:
- width `TRUNK_WIDTH_BOTTOM`=140px, height `TRUNK_HEIGHT`=1180px
- `clipPath: polygon(...)` tapering from wide at bottom to narrow (20px) at top
- `background: linear-gradient(90deg, #0a0807 0%, #3d2b1f 30%, #5c3a21 50%, #3d2b1f 70%, #0a0807 100%)`
- Inner overlay: gradient-to-top from `#0a0807` → transparent → amber-900/30

**Main branches (`Branch` component):** One per lesson node. A div with:
- Width = 3D Euclidean distance from trunk attachment to node
- Height = `28 × scale` px (scale = 1 minus height ratio × 0.5, so higher branches are thinner)
- Two face divs rotated 0° and 90° around X (cross-section illusion)
- Each face: `linear-gradient(180deg, #8a5a33 0%, #5c3a21 40%, #2a1f1a 100%)` clipped to a taper polygon
- A dark side-shading overlay: `bg-gradient-to-r from-black/40 via-transparent to-black/60`

**Path lines between nodes:** A div with same cross-section trick (0° + 90° rotateX faces), amber gradient when active (completed), dark brown when locked.

**Decorative branches:** 14 smaller procedurally-placed branches for canopy fullness, same rendering as main branches but lighter scale/thickness.

**Particles:** 18 glowing dots (`#fbbf24`, `box-shadow 0 0 10px #fbbf24`) positioned in 3D space, animated with `float-up` keyframes (translateY -400px + rotate 360deg over 6–14s). Counter-rotated to always face camera.

**Nodes:** 56×56px circles, counter-rotated to face camera. States:
- Completed: `bg-amber-500`, amber glow `shadow-[0_0_20px_rgba(245,158,11,0.6)]`, checkmark icon
- Unlocked/current: dark bg with amber border + shadow, number label
- Locked: dark bg, dark border, lock icon
- Arabic label below each node: `Noto Naskh Arabic`, 36px, dark pill background `rgba(10,8,7,0.82)` with backdrop-blur

**Detail panel** (bottom centre, slides up on node select):
- `bg-[#1a1311]/95`, `backdrop-blur-xl`, `border border-[#3d2b1f]`, `rounded-3xl`
- Amber top-edge line: `bg-gradient-to-r from-transparent via-amber-500/50 to-transparent`
- Arabic word (Noto Naskh Arabic 30px amber), transliteration (Instrument Serif italic 24px)
- Mastery progress bar (amber gradient with shimmer animation)
- CTA button: amber-600 → amber-500, "Start Lesson" / "Review Lesson" / "Locked"

**The full component is `source-files/tree-branch-detail/Parallax.tsx`. Copy it as-is.**

---

## HEADER CHROME (from Orbit variant — use this style)

The top-right area of the **branch detail screen** (Parallax full-screen) should use the header style from `Orbit.tsx`:

```
TOP-LEFT wordmark:
  طريقة   ← Instrument Serif, 48px, colour #ffcc80 (warm amber), drop-shadow-lg
  Tariga Learning  ← DM Sans 12px, bold, tracking 0.2em, uppercase, colour #d4af37/80, margin-left 4px

TOP-RIGHT XP pill:
  bg-[#1a120b]/80, backdrop-blur-md, px-20 py-10, rounded-full
  border: 1px solid rgba(212,175,55,0.3), box-shadow: 0 20px 50px rgba(0,0,0,0.5)
  · Pulsing dot: 10×10px, bg-[#ffcc80], animate-pulse
  · "1,240 XP" — DM Sans 14px, font-bold, colour #ffcc80, tracking wider
  hover: bg-[#2a1d17]/80
```

---

## WEBGL ORB

Copy `source-files/WebGLOrb.tsx` verbatim. It is a self-contained WebGL1 fragment-shader orb component with:
- Warm gold/amber/copper animated plasma surface (fbm noise)
- Fresnel rim + specular highlight  
- Three modes: `idle` (calm), `listening` (energised), `thinking` (medium)
- Graceful CSS fallback if WebGL unavailable

Usage: `<WebGLOrb mode="idle" />` inside a sized container. The canvas fills the container.

---

## DATA STRUCTURE (domain + moments)

The tree has 5 domains. Each domain has moments (lessons). States: `done`, `next`, `locked`.

```ts
const DOMAIN_DATA = {
  family: {
    color: 'var(--gold)',
    title: '◆ Family',
    meta: '4 phrases · comfortable',
    moments: [
      { id: 1, title: 'Greeting your grandmother',        state: 'done', meta: 'guided · 2 min' },
      { id: 2, title: 'Answering how are you',            state: 'done', meta: 'guided · 2 min' },
      { id: 3, title: 'Good morning — the right reply',   state: 'done', meta: 'guided · 2 min' },
      { id: 4, title: 'Your khalto puts food in front of you', state: 'done', meta: 'big moment' },
      { id: 5, title: 'Where have you disappeared to',    state: 'next', meta: 'guided · 2 min' },
      { id: 6, title: 'Wedding congratulations',          state: 'locked', meta: 'guided · 2 min' },
      { id: 7, title: 'Habooba checks in',               state: 'locked', meta: 'phone call' },
      { id: 8, title: 'Eid call across time zones',      state: 'locked', meta: 'phone call' },
      { id: 9, title: 'A condolence visit',              state: 'locked', meta: 'phone call' },
    ]
  },
  friends: {
    color: 'var(--teal)',
    title: '● Friends',
    meta: '2 phrases · exploring',
    moments: [
      { id: 1, title: 'The casual hello',       state: 'done',   meta: 'guided · 1 min' },
      { id: 2, title: 'Agreeing to meet up',    state: 'done',   meta: 'guided · 2 min' },
      { id: 3, title: 'Declining politely',     state: 'next',   meta: 'guided · 2 min' },
      { id: 4, title: 'Inside jokes',           state: 'locked', meta: 'big moment' },
    ]
  },
  community: {
    color: 'var(--green)',
    title: '▲ Community',
    meta: '2 phrases · exploring',
    moments: [
      { id: 1, title: 'Buying bread at the dukkan', state: 'done',   meta: 'guided · 2 min' },
      { id: 2, title: 'Thanking the bus driver',    state: 'done',   meta: 'guided · 1 min' },
      { id: 3, title: 'Asking for directions',      state: 'next',   meta: 'guided · 3 min' },
    ]
  },
  identity: {
    color: 'var(--purple)',
    title: '■ Identity',
    meta: '0 phrases · locked',
    moments: [
      { id: 1, title: 'Saying where you are from',   state: 'locked', meta: 'guided · 2 min' },
      { id: 2, title: 'Explaining your background',  state: 'locked', meta: 'guided · 4 min' },
    ]
  },
  culture: {
    color: 'var(--coral)',
    title: '✦ Culture',
    meta: '0 phrases · locked',
    moments: [
      { id: 1, title: 'Proverbs and wisdom',   state: 'locked', meta: 'guided · 3 min' },
      { id: 2, title: 'Wedding traditions',    state: 'locked', meta: 'guided · 5 min' },
    ]
  }
}
```

In Parallax.tsx the branch detail uses its own `LESSONS` array for the 3D tree (8 sequential nodes along a spine). Wire these up to the same backend data when you integrate.

---

## INTEGRATION STEPS (order of work)

1. **Copy source files** into your project:
   - `WebGLOrb.tsx` → your components folder
   - `HomePage.tsx` → your screens/home folder (rename as needed)
   - `tree-branch-detail/Parallax.tsx` → a separate screen/component (e.g. `BranchDetailScreen.tsx`)

2. **Add fonts** to your global HTML/CSS (see Fonts section above).

3. **Add CSS custom properties** (Colour system section) to your global stylesheet or inject via a `<style>` tag on the root component.

4. **Wire navigation:** On the homepage tree, the current mockup zooms in-place. For the native app, tapping a branch should push/modal to `BranchDetailScreen` (Parallax). Remove the in-place zoom if you replace it with navigation, or keep both (zoom first → "explore this branch" CTA → navigate).

5. **Replace mock data** with real API calls. The data shapes are in the Data Structure section above.

6. **Theme toggle:** The homepage has a dark/light toggle. Wire it to your app's theme provider.

7. **WebGL Orb:** Test on device — it uses WebGL1 which works on all modern browsers. CSS fallback is built in. No npm dependency needed.

8. **Parallax tree dependencies:** None beyond React. No Three.js, no extra packages.

---

## DO NOT CHANGE

- The typeface choices (Instrument Serif for display, DM Sans for body, Noto Naskh Arabic for Arabic)
- The warm gold palette (#c9a96e, #e8c99a) and the accent set (teal, green, purple, coral)
- The tapered SVG trunk/branch shape — it must be filled tapered shapes, not uniform strokes
- The ember/spark canvas particle layer behind the tree
- The Arabic text content — do not translate or change any Arabic strings
- The 3D tilt hover effect on cards and tiles

---

## FILES IN THIS PACKAGE

```
source-files/
  HomePage.tsx              ← Full homepage component (self-contained, all subcomponents inline)
  WebGLOrb.tsx              ← WebGL1 orb shader component
  Orbit.tsx                 ← Reference only: top-left wordmark + top-right XP pill HUD style
  tree-branch-detail/
    Parallax.tsx            ← Full CSS 3D branch detail screen (copy as-is)
CLAUDE_CODE_INSTRUCTIONS.md ← This file
```
