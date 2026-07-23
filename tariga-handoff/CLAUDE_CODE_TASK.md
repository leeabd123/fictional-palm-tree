# Tariga — Implementation Brief for Claude Code

> Sudanese Arabic learning app. Implement this UI into the existing codebase. All source files are in `src/` alongside this document. The mockups are fully built and pixel-verified — your job is to translate them faithfully into the production codebase, wiring them to real data/routing where it exists and using the mockup's placeholder data where it doesn't yet.

---

## What You're Building

Three screens:

| Screen | File in `src/screens/` | When it appears |
|--------|------------------------|-----------------|
| **Intro Gate** | `IntroScreen.tsx` | First launch / daily greeting gate |
| **Home Dashboard** | `HomePage.tsx` | Main dashboard after intro |
| **Branch Detail (3D tree)** | `BranchDetail.tsx` (= `Parallax.tsx`) | When user taps a domain branch on the tree |

The user flow is: **IntroScreen → HomePage → (tap branch) → BranchDetail → (back) → HomePage**.

---

## Design System

### Fonts — load via Google Fonts in `<head>`
```html
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500;600;700&family=Noto+Naskh+Arabic:wght@400;700&display=swap" rel="stylesheet">
```

- **Arabic display / headings**: `'Instrument Serif', 'Noto Naskh Arabic', serif` — class `font-serif-ar`
- **Body / UI**: `'DM Sans', sans-serif` — class `font-sans-body`
- **Arabic lesson text inside nodes/cards**: `'Noto Naskh Arabic', serif` with `dir="rtl"`

### Dual Theme — CSS custom properties

Apply either `tariga-theme-dark` or `tariga-theme-light` class to the root div. The user can toggle with the sun/moon switch in the nav.

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
  --tree-dim: rgba(169, 128, 62, 0.2);
  --card-blur: blur(20px);
  --ring-bg: rgba(169, 128, 62, 0.15);
  --glow-green: none;
  --glow-gold: none;
  --glow-teal: none;
}
```

---

## Screen 1 — Intro Gate (`IntroScreen.tsx`)

**Purpose**: Shown once per day (or on first launch) before the home dashboard. Single viewport, vertically centred, dark theme always.

**Background**: `#0f0d0b` with a centred radial gold glow: `radial-gradient(circle, rgba(201,169,110,0.08), transparent 60%)`, blurred 60px, 600×600px div absolutely positioned.

### Layout (top → bottom, all centred)

1. **Orb** — 128×128px container, 96×96px sphere inside.
   - Outer blur halo: absolute, full container, `background: #c9a96e`, `filter: blur(30px)`, `opacity: 0.3`, animated `breathe` keyframe (scale 0.96 → 1.04, 4s ease-in-out infinite).
   - Sphere: `radial-gradient(circle at 35% 35%, #e8c99a, #c9a96e 40%, #e08a7a 80%, #7d6544)`, `box-shadow: inset -8px -8px 20px rgba(0,0,0,0.5), inset 4px 4px 10px rgba(255,255,255,0.4)`, same breathe animation.
   - **If WebGL is available** replace with the `WebGLOrb` component (see components section below).

2. **Arabic heading**: `السلام عليكم` — `font-serif-ar`, 52px, `var(--gold)`, `dir="rtl"`, `text-shadow: 0 0 30px rgba(201,169,110,0.3)`.

3. **Romanisation**: `as-salamu alaykum` — `font-serif-ar italic`, 28px, `var(--purple)`.

4. **Translation**: `Peace be upon you` — 16px, `var(--text-muted)`, medium weight.

5. **Instruction**: `Try saying it back — out loud or typed. Arabizi counts.` — 15px, `var(--text-secondary)`.

6. **Input row** — pill-shaped container, `background: var(--surface)`, `border: 1px solid var(--surface-border)`, `backdrop-filter: blur(16px)`, `border-radius: 28px`, inner padding 8px:
   - **Mic button** (left): 46×46px circle, `background: linear-gradient(135deg, #a78bfa, #ec4899)`, microphone SVG icon white.
   - **Text input** (flex-1): `placeholder="السلام عليكم … or salam alaykum"`, `dir="auto"`, transparent background, 16px.
   - **Say it button** (right): `background: var(--gold-ghost-bg)`, `border: 1px solid var(--gold-border)`, `color: var(--gold-light)`, `border-radius: 999px`, 46px tall, "Say it →".

7. **Skip intro** link: 14px, `var(--text-muted)`, opacity 60%, hover → 100% + `var(--text-primary)`, margin-top 48px. Tapping navigates to HomePage.

---

## Screen 2 — Home Dashboard (`HomePage.tsx`)

**Background**: `var(--bg)` with three large blurred radial gradient orbs absolutely positioned (fixed, `z-index: 0`, `pointer-events: none`, `overflow: hidden`):
- Top-left: `80%×80%`, `top: -20%`, `left: 0%`, `radial-gradient(circle, var(--ambient-gold), transparent 60%)`, `blur(100px)`, `opacity: 0.8`.
- Center-right: `60%×70%`, `top: 20%`, `right: -10%`, `rgba(201,169,110,0.06)`, `blur(90px)`.
- Bottom-left: `70%×60%`, `bottom: -10%`, `left: -10%`, `rgba(224,138,122,0.05)`, `blur(120px)`.
- Noise overlay: SVG fractalNoise `baseFrequency="0.85"`, `opacity: 0.03`, `mix-blend-mode: overlay`.

**Content wrapper**: `max-width: 1280px`, centred, `padding: 32px 32px 96px`, flex column.

### 2.1 Top Nav

Full-width flex row, `border-bottom: 1px solid var(--surface-border)`, `padding-bottom: 24px`.

**Left — Logo**:
- Arabic: `طريقة`, `font-serif-ar`, 32px, `var(--gold)`, `drop-shadow(0 0 8px var(--gold-border))`.
- Label: `TARIGA`, 13px, uppercase, `letter-spacing: 0.2em`, `var(--text-muted)`, bold. Baseline-aligned next to Arabic.

**Centre — Nav links** (hidden on mobile `md:hidden`):
- Dashboard (active, `var(--gold)`), Curriculum, Library — 14px, medium weight, `var(--text-secondary)`, hover → `var(--text-primary)`.

**Right — Theme toggle**:
- 56×30px pill, `background: var(--surface)`, `border: 1px solid var(--surface-border)`, `border-radius: 999px`.
- Inner knob: 22×22px circle, `background: var(--gold)`. Dark mode: knob shows 🌙 (moon SVG), left; light mode: shows ☀️ (sun SVG), right (`translateX(24px)`).
- Transition 300ms.

### 2.2 Greeting

`margin-top: 40px`, `margin-bottom: 24px`.

1. **Frequency chip**: `FREQ: FAMILY & HOME` — small pill with a gold dot, `background: var(--surface)`, `border: 1px solid var(--surface-border)`, `backdrop-filter: blur(12px)`, 10px bold uppercase, letter-spacing 0.2em, `var(--text-muted)`.

2. **Arabic headline**: `يا هلا بيك تاني` — `font-serif-ar`, **64px** (desktop: 80px), `var(--text-primary)`, `dir="rtl"`, `text-align: left`. Line-height 1.1. Drop shadow.

3. **Romanised subtitle**: `ya hala beek tani — Welcome back` — `font-serif-ar italic`, 28px (desktop: 34px), `var(--purple)`.

### 2.3 Hero Row — two cards side by side

Flex row on desktop (stacked on mobile), `gap: 24px`, `margin-top: 24px`.

#### 2.3a Continue Card (flex-1)
Glass card: `background: var(--surface)`, `border: 1px solid var(--surface-border)`, `backdrop-filter: var(--card-blur)`, `border-radius: 24px`, `box-shadow: var(--glass-shadow)`. Active border: `var(--gold-border)`, extra glow `0 0 30px -10px var(--gold-border)`.

Has **3D tilt on mouse move**: on `mousemove`, measure cursor offset from card centre, apply `perspective(1000px) rotateX(Xdeg) rotateY(Ydeg)` (max ±6°). A white shimmer overlay (`linear-gradient(105deg, rgba(255,255,255,0.12) 0%, transparent 35%)`) shifts slightly with cursor. Resets on `mouseleave` (500ms ease-out).

Inside (flex row, `padding: 32px`, `gap: 32px`, `align-items: center`):
- **Orb** (80×80px circle, `overflow: hidden`): contains `WebGLOrb` component in `mode="idle"` (see below). Gold ring border: `1px solid rgba(201,169,110,0.15)`, glow `box-shadow: 0 0 30px rgba(201,169,110,0.25)`.
- **Text** (flex-1):
  - `CONTINUE WHERE YOU LEFT OFF` — 13px, uppercase, `letter-spacing: 0.16em`, `var(--teal)`, bold, `margin-bottom: 12px`.
  - `Coach · scenario 2 — "Tell me about yourself"` — 26px, `var(--text-primary)`, semibold.
  - `~2 min to finish` — 15px, `var(--text-muted)`.
- **Play button** (64×64px circle, shrink-0): `background: var(--gold-ghost-bg)`, `border: 1px solid var(--gold-border)`, `color: var(--gold-light)`. Hover scale 1.05, active scale 0.95. Play triangle SVG inside.

#### 2.3b Stats Widget (width 420px, shrink-0 on desktop)
Same glass card. Inside: flex row `gap: 32px`, `padding: 32px`, centred.

**Left — Progress ring** (120×120px SVG):
- Background track circle: `stroke: var(--ring-bg)`, `strokeWidth: 8`.
- Progress arc: `stroke: var(--teal)`, `strokeWidth: 8`, `strokeDasharray: circumference`, `strokeDashoffset` set to show 62%, `strokeLinecap: round`, `filter: drop-shadow(0 0 6px var(--teal))`, animate stroke-dashoffset on mount (1.5s ease-in-out). SVG is rotated -90° so arc starts from top.
- Centre text: `62%` — 24px bold `font-serif-ar`; `DECK` below — 10px uppercase teal.

**Right — Three stat rows** (flex-1):
- `Mastered` / `34` — label 14px `var(--text-secondary)`, value 18px bold `var(--green)`, `text-shadow: var(--glow-green)`.
- `Still learning` / `12` — value `var(--gold-light)`, `text-shadow: var(--glow-gold)`.
- `Coached scenarios` / `7` — value `var(--teal)`, `text-shadow: var(--glow-teal)`.

### 2.4 Module Tiles — 4-column grid

`grid-template-columns: repeat(4, 1fr)` on desktop, `repeat(2, 1fr)` on tablet, `1fr` on mobile. `gap: 24px`, `margin-top: 32px`.

Each tile: `background: var(--surface)`, `border: 1px solid var(--surface-border)`, `border-radius: 20px`, `padding: 24px`, flex column, `gap: 16px`. Same 3D tilt as cards. Hover: `-translate-y-4px` or `-6px` if active.

Active tile gets `border: var(--gold-border)`, `box-shadow: 0 0 24px -8px var(--gold-border)`, and a radial gold glow at top-left inside.

Each tile has:
- **Icon container** (48×48px circle): `color` and `background` tinted to its accent colour at 12% opacity.
- **Title** (18px, semibold, `var(--text-primary)`).
- **Sub** (14px, `var(--text-secondary)`).

The four tiles:

| Tile | Icon | Title | Sub | Accent | Active |
|------|------|-------|-----|--------|--------|
| Flashcards | Cards SVG | Flashcards | Solja episode | `var(--teal)` | No |
| Coach | Animated orb SVG | Your coach | scenario 2 waiting → | `var(--gold)` | **Yes** |
| Ear | Waveform SVG | Tune your ear | Clip 2 of 5 | `var(--purple)` | No |
| Journey | Star SVG | Your journey | Then → now | `var(--green)` | No |

### 2.5 Journey Tree Section

`margin-top: 80px`, `padding-bottom: 48px`. The falling-ember particle canvas sits behind the tree (wider than the card, bleeds to page edges, `pointer-events: none`).

#### Section heading (shown only when not zoomed in)
- `شجرتك — The Tree` — `font-serif-ar italic`, 40px, `var(--gold)`.
- `35 moments across 5 domains` — 16px, `var(--text-muted)`.
Both fade out + slide up when a domain is zoomed.

#### Tree card
`max-width: 1000px`, `height: 600px`, `border-radius: 24px`, `overflow: hidden`, `background: var(--surface)`, `border: 1px solid var(--surface-border)`, `backdrop-filter: blur(1px)`, `box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5)`.

The card has a single absolutely-positioned content div that **transforms on zoom** (CSS transition 700ms, cubic-bezier(0.25,1,0.5,1)):
- Resting: `translate(0,0) scale(1)`, `transform-origin: 450px 330px`.
- When a domain is selected: `translate(dx, dy) scale(s)` so that domain's branch fills the card. Each branch has a pre-calculated `{ cx, cy, scale }` zoom target (see data below).

Inside, an SVG (`viewBox="0 0 900 660"`, `overflow: visible`, absolute inset) renders:

**SVG defs**:
- `trunkGrad` (horizontal linearGradient, x1=0 x2=1): stops `#2D1A13 → #4A2F1D → #B37033 → #4A2F1D → #1E100A` (dark edge, mid umber, warm amber highlight at 50%, back to umber, dark edge — gives the bark a lit-cylinder feel).
- `nodeGlow` filter: feGaussianBlur stdDeviation=3.5 + feMerge with SourceGraphic.
- `pathGlow` filter: feGaussianBlur stdDeviation=4 + feMerge with SourceGraphic.
- `branchShadow` filter: feDropShadow dx=0 dy=8 stdDeviation=6 floodColor=#000 floodOpacity=0.4.

**Ground ellipse**: `cx=450 cy=650 rx=70 ry=14`, `fill: var(--tree-dim)`, `opacity: 0.6`, nodeGlow filter.

**Trunk** — tapered filled path (NOT a stroked line):
- Control points: `[{x:450,y:655},{x:450,y:583},{x:450,y:517},{x:450,y:452}]`
- `startWidth: 46` (wide base with slight root flare), `endWidth: 17` (narrower at crown).
- Use the `getTaperedBranchPath()` function (see helpers) to generate the filled SVG path.
- `fill: url(#trunkGrad)`, `stroke: #1E100A`, `strokeWidth: 1`, branchShadow filter.

**Five domain branches** (one per domain, drawn as tapered filled shapes):

| Domain | Colour var | Curve P0→P1→P2→P3 | Node t-values | Zoom target |
|--------|-----------|-------------------|---------------|-------------|
| family | `--gold` | (450,450)→(600,400)→(750,300)→(820,150) | 0.15,0.25,0.35,0.45,0.55,0.65,0.75,0.85,0.95 | cx=635,cy=300,scale=1.9 |
| friends | `--teal` | (450,450)→(300,400)→(150,300)→(80,150) | 0.25,0.5,0.75,0.95 | cx=265,cy=300,scale=1.9 |
| community | `--green` | (450,450)→(520,350)→(600,250)→(650,100) | 0.35,0.65,0.95 | cx=550,cy=275,scale=2.0 |
| identity | `--purple` | (450,450)→(380,350)→(300,250)→(250,100) | 0.5,0.9 | cx=350,cy=275,scale=2.0 |
| culture | `--coral` | (450,450)→(430,350)→(470,200)→(450,80) | 0.4,0.8 | cx=450,cy=265,scale=2.0 |

For each branch:
1. **Hit area**: transparent `stroke="transparent" strokeWidth="40"` path along centreline — this is the tap target. Cursor pointer only when no domain is selected.
2. **Base branch shape**: `getTaperedBranchPath(curve, 15, 3)`, `fill: url(#trunkGrad)`, `stroke: #1E100A`, `strokeWidth: 0.75`, `opacity: 0.92`.
3. **Lit overlay** (progress glow): if any node is done/next, draw a `<polyline>` sampled along the bezier from t=0 to t=tMax, `stroke: var(--domain-color)`, `strokeWidth: 5`, `strokeLinecap: round`, pathGlow filter.
4. **Nodes** along branch at t-values from curve:
   - `done`: filled circle `r=3.5`, `fill: domainColor`, nodeGlow filter + a second identical circle on top.
   - `next`: filled `r=2.5` + animated ring (SVG animate, r: 2.5→7→2.5, opacity: 1→0→1, 2s repeat).
   - `locked`: hollow circle `r=2.5`, `fill: var(--bg)`, `stroke: var(--tree-dim)`, `strokeWidth: 1.5`.
5. **Opacity state**: when another domain is selected, this `<g>` gets `opacity: 0.2`.

**HTML overlay** (absolute inset, pointer-events-none, sits on top of SVG):
For each domain:

- **Domain label** (shown when NOT zoomed): positioned at the branch tip. Family/friends/identity/culture: `labelSide` determines `items-end text-right` vs `items-start text-left`. Shows domain title (colour-matched, 16px semibold) and meta (12px muted). Hidden when zoomed (`opacity-0 scale-90 pointer-events-none`). Clicking → handleDomainClick.
  - Family: `left: 840, top: 140`, side=right
  - Friends: `left: 60, top: 140`, side=left
  - Community: `left: 670, top: 90`, side=right
  - Identity: `left: 230, top: 90`, side=left
  - Culture: `left: 470, top: 60`, side=right

- **Node hit areas + zoomed labels + callouts**: one div per node, absolutely positioned at the node's SVG pixel position (getBezierPoint → px,py → `style={{ left: pt.x, top: pt.y, transform: 'translate(-50%,-50%)' }}`).
  - Hit div (24×24 circle): pointer-events-auto only when this domain is selected. On click → setSelectedNodeId.
  - Zoomed label: fades in when domain is selected. Text 6px bold (will scale up with zoom transform). Side determined by `labelSide`.
  - **Callout card**: appears when this specific node is selected (AND domain is selected). Positioned below the node. `background: var(--bg)`, `border: 1px solid domainColor80`, `border-radius: 8px`, width 144px, `box-shadow: 0 12px 32px -4px rgba(0,0,0,0.8), 0 0 16px domainColor30`. Contains: title (7px semibold), meta (5px uppercase domainColor), and a "Start Session" button if state=next.

**Back button**: positioned `top: 24px left: 24px` inside the card, z-50. Pill with `← Full Tree` text. Fades in when zoomed (opacity-100), fades out at rest. On click → reset selectedDomain and selectedNodeId.

**IMPORTANT**: Tapping a branch on the home screen tree navigates to the **Branch Detail screen** (BranchDetail.tsx) passing the domain ID. The in-card SVG zoom is the "preview" transition; the actual full experience is the separate screen. You can implement this as a router push or a full-screen overlay — match your codebase's navigation pattern.

#### Ember Particle Layer (JourneyParticles)

Canvas element, absolutely positioned behind the tree card, bleeds wider than the card (extends 100px above and below, spans full viewport width up to 1400px). `opacity: 0.6`, `mix-blend-mode: screen`, `pointer-events: none`.

50 particles. Each particle has:
- `x, y`: random position across canvas.
- `z` (0–1): depth factor.
- `size = z * 2.5 + 0.5`.
- `vy = (0.2–0.8) * (z+0.5)` (fall downward).
- `vx = ±0.3 * (z+0.5)` (horizontal drift).
- `opacity = z * 0.7 + 0.1`.
- `swayOffset, swaySpeed`: sine sway per particle.
- `color`: 80% are `'201, 169, 110'` (gold), 20% `'224, 138, 122'` (coral).

Each frame: move particles, wrap when off-edge. Draw as `arc` circles with `ctx.shadowBlur` glow. Far particles (low z): blur shadow. Near particles (high z): gold glow `rgba(232, 201, 154, 0.8)`.

---

## Screen 3 — Branch Detail / 3D Tree (`BranchDetail.tsx`)

This is a **full-screen CSS 3D** experience — no WebGL needed. Source is in `src/screens/Parallax.tsx`.

**Background**: `#14100E` (near-black warm brown). Radial gold glow at centre: `radial-gradient(circle_at_center, rgba(212,175,55,0.08), transparent 70%)`.

**Navigation header** (top-left, `padding: 24px`, `z-index: 10`):
- **App name**: `طريقة` — `font-serif-ar` (`Instrument Serif`), 48px (`text-5xl`), `#ffcc80`, `drop-shadow-lg`. Below it: `Tariga Learning` — 12px, bold, `letter-spacing: 0.2em`, uppercase, `#d4af37/80`, `margin-left: 4px`.
- **XP pill** (top-right): `background: rgba(26,18,11,0.8)`, `backdrop-filter: blur(12px)`, `border: 1px solid rgba(212,175,55,0.3)`, `border-radius: 999px`, `padding: 10px 20px`. Contains: pulsing amber dot (2.5px, `background: #ffcc80`, CSS pulse animation) + `1,240 XP` in 14px bold `#ffcc80` wider tracking. Clickable.

**Hint bar** (bottom-centre, `z-index: 10`): `Drag to rotate • Click a node to zoom` in a pill: `background: rgba(10,5,2,0.6)`, `backdrop-filter: blur(12px)`, `border: 1px solid rgba(255,255,255,0.1)`, `border-radius: 999px`, white/70, 14px, flex with cursor icon SVG.

### 3D Scene

The entire tree lives in CSS `perspective: 1000px` 3D space. All interaction is drag-to-rotate (pointer events on the outermost container):

**Drag to rotate**:
- `pointerdown` → capture, record start position.
- `pointermove` → if moved >3px, mark as dragged. Update `rotation.x` (pitch, max ±25°) and `rotation.y` (yaw, max ±45°) from delta * 0.3.
- `pointerup` → release. If not dragged → deselect node.
- Applied as `transform: rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` on the inner rotation div.

**Camera focus** (when a node is selected): outer wrapper gets `scale(1.4)` and the innermost content div gets `translate3d(-node.x, -node.y, -node.z)` (transition 1s cubic-bezier(0.2,0.8,0.2,1)). Default: `scale(0.6)`, `translate3d(0, 175px, 0)`.

**Trunk**: 6 rotated `div` panels around Y axis (every 30°), each: `position: absolute`, `left: -70px, top: -780px`, `width: 140px, height: 1180px`, `background: linear-gradient(90deg, #0a0807 0%, #3d2b1f 30%, #5c3a21 50%, #3d2b1f 70%, #0a0807 100%)`, `clipPath: polygon(calc(50% - 10px) 0, calc(50% + 10px) 0, 100% 100%, 0 100%)` (trapezoidal taper). Dark-to-canopy gradient overlay on top. `transformOrigin: 50% 100%`, `rotateY(angle)`.

**14 decorative branches** (procedural, deterministic from index): each is a `DecorativeBranch` CSS 3D element — two rotateX(0deg) and rotateX(90deg) layers forming a cross-section, `background: linear-gradient(180deg, #7a4a2a 0%, #4a3020 50%, #1a1311 100%)`, `clipPath: polygon(0 0, 100% 40%, 100% 60%, 0 100%)` (tapered). `thickness = 24 * scale`, `length = 150–350px`. Spread from various heights on trunk, angles via pseudo-random formula `(i * prime) % 100`.

**8 main branch arms** (one per lesson node): similar cross-section divs, `thickness = 28 * scale`, `background: linear-gradient(180deg, #8a5a33 0%, #5c3a21 40%, #2a1f1a 100%)`, also tapered clipPath.

**PathLines** (connecting adjacent nodes): two cross-section `div` layers, `10px` thick, `background: linear-gradient(90deg, #f59e0b, #fbbf24)` for active (completed→next), `linear-gradient(90deg, #4a352a, #2a1f1a)` for inactive. Active gets `box-shadow: 0 0 15px rgba(245,158,11,0.6)`.

**18 floating particles**: each `translate3d` to random 3D positions, div sphere `width/height: 1.5–4.5px`, `background: #fbbf24`, `border-radius: 50%`, `box-shadow: 0 0 10px #fbbf24`, CSS animation `float-up` (translateY: 0→-400px + rotate 360deg, 6–14s linear infinite, random delay). Particle divs counter-rotate by `rotateY(-rotation.y)deg rotateX(-rotation.x)deg` so they always face the camera.

**8 lesson nodes**: each a `div` at `translate3d(node.x, node.y, node.z)` that also counter-rotates to face camera.

Node data:
| id | Arabic | English | Status | x | y | z |
|----|--------|---------|--------|---|---|---|
| 1 | التحية | Greetings | completed | -10 | 350 | 80 |
| 2 | العائلة | Family | completed | -160 | 150 | 20 |
| 3 | الأرقام | Numbers | unlocked | 150 | 0 | -50 |
| 4 | الألوان | Colors | locked | -130 | -150 | -110 |
| 5 | الطعام | Food | locked | 140 | -300 | -70 |
| 6 | السوق | At the market | locked | -150 | -450 | 50 |
| 7 | السفر | Travel | locked | 90 | -600 | 140 |
| 8 | الطقس | Weather | locked | -30 | -720 | 10 |

Each node button: 56×56px circle.
- `completed`: `background: #f59e0b (amber-500)`, text `#1a0d00`, inner absolute ring `box-shadow: 0 0 20px rgba(245,158,11,0.6)`. Icon: checkmark.
- `unlocked`: `background: #2a1f1a`, `border: 2px solid #f59e0b`, text `#f59e0b`. Icon: node number.
- `locked`: `background: #0a0807`, `border: 2px solid #3d2b1f`, text `#4a352a`. Icon: lock.

Below each node button (always visible): large Arabic text in `Noto Naskh Arabic`, 36px (`text-4xl`), on a near-black pill background (`rgba(10,8,7,0.82)`, `backdrop-filter: blur(2px)`, `box-shadow: 0 2px 10px rgba(0,0,0,0.6)`). Unlocked nodes: `#f9f0e0`, locked: `#8a756a`.

### Detail Panel (bottom-centre slide-up)

340px wide, absolutely positioned `bottom: 48px`, `left: 50%`, `translateX(-50%)`. Slides in on node select (`translateY: 0, opacity: 1`), slides out (`translateY: 48px, opacity: 0`), transition 500ms. Uses "sticky" last node (`displayNode`) so it doesn't blank during exit.

Panel card: `background: rgba(26,19,17,0.95)`, `backdrop-filter: blur(24px)`, `border: 1px solid #3d2b1f`, `border-radius: 24px`, `padding: 24px`, `box-shadow: 0 20px 50px rgba(0,0,0,0.8)`. Decorative gold hairline at top: `height: 4px`, `background: linear-gradient(90deg, transparent, rgba(245,158,11,0.5), transparent)`.

Inside:
- Top row: Arabic title (32px `Noto Naskh Arabic`, `#f59e0b`) + English title (24px `Instrument Serif italic`, `rgba(249,240,224,0.7)`). Right: mastery percentage circle (56×56, `border: 1px solid rgba(245,158,11,0.3)`, `background: #2a1f1a`) or lock icon for locked.
- Progress bar: 10px height, `background: #0a0807`, `border-radius: 999px`. Fill: `background: linear-gradient(90deg, #8b5a2b, #d4af37, #ffcc80)`, transition width 1s ease-out. Shimmer animation inside.
- CTA button: full width, `border-radius: 12px`, `padding: 16px`.
  - Locked: `background: #2a1f1a`, `color: #8a756a`, cursor not-allowed.
  - Unlocked/current: `background: #d97706 (amber-600)`, hover `#f59e0b`, `color: #f9f0e0`, bold, `box-shadow: 0 0 20px rgba(217,119,6,0.3)`.
  - Text: "Locked" / "Start Lesson" / "Review Lesson".

---

## Shared Components

### WebGLOrb (`components/WebGLOrb.tsx`)

A hand-written WebGL1 shader orb. Copy the file exactly as-is. It renders a warm gold/copper/ember sphere using fbm noise shaders. Props: `mode: 'idle' | 'listening' | 'thinking'`. Falls back to a CSS gradient sphere if WebGL is unavailable.

Use in:
- `IntroScreen`: 96px sphere (replace the CSS gradient with `<WebGLOrb mode="idle" />`).
- `HomePage` hero card: 80×80px circle.
- Module tiles (coach tile): small 24×24px orb icon.

### GlassCard

Reusable wrapper: `background: var(--surface)`, `border: 1px solid var(--surface-border)`, `backdrop-filter: var(--card-blur)`, `border-radius: 24px`, `box-shadow: var(--glass-shadow)`, `overflow: hidden`. Accepts `active` prop for gold glow variant. Has 3D tilt mouse handler built in (max ±6°).

### Tile

As described in 2.4. Same 3D tilt. Accepts `active`, `colorVar`, `title`, `sub`, `icon`.

### Helper Functions (pure, no deps)

```typescript
// Point on a cubic bezier at parameter t
const getBezierPoint = (t: number, p0, p1, p2, p3) => { ... }

// Polyline string sampling bezier 0→tMax (for lit branch overlay)
const getPolyline = (p0, p1, p2, p3, tMax, steps = 30): string => { ... }

// Filled tapered SVG path from cubic bezier curve
// startWidth = thickness at P0, endWidth = thickness at P3
// Returns SVG path data string for a closed ribbon shape
const getTaperedBranchPath = (curve: {x,y}[], startWidth: number, endWidth: number): string => {
  // Compute normals at 4 control points
  // Lerp width at each control point
  // Build top bezier + bottom bezier (reversed) → closed path
}
```

---

## Dependencies

```json
{
  "three": "^0.170.0",
  "@react-three/fiber": "^9.0.0",
  "@react-three/drei": "^10.0.0",
  "framer-motion": "^11.0.0",
  "lucide-react": "^0.400.0"
}
```

The `BranchDetail` screen (CSS 3D parallax) uses **no Three.js** — pure CSS 3D transforms. Only the `Orbit.tsx` variant uses Three.js (not part of this implementation sprint; skip it unless already in codebase).

---

## Routing / Navigation

| Trigger | Destination | Pass |
|---------|-------------|------|
| Tap "Skip intro" on IntroScreen | HomePage | — |
| Submit correct response on IntroScreen | HomePage | — |
| Tap a domain branch or label on tree | BranchDetail | `domainId: string` |
| Tap back / header back arrow on BranchDetail | HomePage | — |

Use your existing router (React Navigation / Expo Router / React Router). The BranchDetail currently shows a generic 8-node lesson list; wire it to the real domain data when available.

---

## Mobile / Responsive Notes

- Below `md` (768px): Nav links hidden, grid goes 1-col, hero cards stack vertically.
- Tree card: at narrow widths, domain labels must stay inside the card bounds. If a label would overflow, clamp its position inward by 8px.
- Branch zoom works identically on mobile (same CSS transform).
- BranchDetail (3D tree): drag works via pointer events (touch-compatible). The node counter-rotation keeps labels always facing the user regardless of device orientation.

---

## Files in `src/`

```
src/
  screens/
    IntroScreen.tsx     ← First-launch gate
    HomePage.tsx        ← Main dashboard
    Parallax.tsx        ← Branch detail (CSS 3D tree, rename to BranchDetail.tsx)
  components/
    WebGLOrb.tsx        ← Warm shader orb (WebGL1, no deps)
```

All four files are complete and ready to copy. Do not alter visual logic or styling — wire to your data layer and router only.
