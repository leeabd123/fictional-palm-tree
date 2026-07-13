# Handoff: Tariga — Canvas Design System (Warm + Neon)

## Overview
Tariga (طريقة) is a Sudanese Arabic dialect trainer. This handoff covers the full screen set explored on the design canvas (`Canvas.dc.html`) plus the existing app prototype (`Tariga.dc.html`). There are **two complete visual systems** — pick ONE and apply it consistently:

1. **Warm ("candlelit")** — the current app's language. Near-black warm brown canvas, gold/brass accents, serif display type.
2. **Neon ("Ink-Navy Glass" / FUI)** — deep space navy, frosted glassmorphism, glowing neon hairlines, HUD/telemetry accents.

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes showing intended look and behavior, NOT production code to copy directly. Recreate these designs in the target codebase's existing environment (React, vanilla JS + CSS, etc.) using its established patterns. The existing app repo is `leeabd123/fictional-palm-tree` (vanilla JS modes in `js/modes/`), so match that architecture unless told otherwise.

## Fidelity
**High-fidelity.** Colors, typography, spacing, copy, and animations are final. Recreate pixel-perfectly. All screens are mobile, designed at **430px wide** (phone), with 44px+ hit targets.

---

## Design Tokens

### System A — Warm (matches current app / Tariga.dc.html / options 1a–1d, 4d–4g, 5a)
- Canvas: `#0f0d0b` (screens use flat color + one large blurred radial glow, e.g. `radial-gradient(circle, rgba(201,169,110,0.13), transparent 65%)` with `filter:blur(40px)`)
- Card surface: `rgba(255,250,242,0.03–0.05)` + `border:1px solid rgba(255,255,255,0.07–0.12)` + `backdrop-filter:blur(16–18px)`
- Gold (primary accent): `#c9a96e`, light gold `#e8c99a`, gold borders `rgba(201,169,110,0.25–0.45)`
- Teal (secondary): `#4fd8c4`
- Green (success): `#56c98f` / `#7fdcaa`
- Purple (phonetics, always italic): `#a78bfa`
- Coral (Culture domain): `#e08a7a`
- Text: primary `#f0ede8` / `#f6f1e8`, secondary `#a09e9a`, muted `#7a756e`
- Type: display **Instrument Serif** (+ **Noto Naskh Arabic** for Arabic display), body **DM Sans**
- Radii: phone 44px, cards 20–24px, tiles 14–16px, pills/buttons 100px
- Buttons: gold ghost style — `background:rgba(201,169,110,0.1–0.12); border:1px solid rgba(201,169,110,0.4–0.45); color:#e8c99a; border-radius:100px`

### System B — Neon / Ink-Navy Glass (options 2a–2b, 3a–3d, 4a–4c, 5b, 6a–6e)
- Canvas: `#070B14` (locked; 3a/3b use `#05070b`). Optional dot-grid layer: `radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)`, `background-size:24–26px`, masked to fade downward
- Glass: `background:rgba(255,255,255,0.03–0.05); border:1px solid rgba(255,255,255,0.06–0.10); backdrop-filter:blur(12–28px)`. Heavy solid borders are banned.
- Neon accents: cyan `#22d3ee`, teal `#2dd4bf`/`#2de3c3`, emerald `#34d399`/`#4ade80`, violet `#8b5cf6`/`#a78bfa`, amber `#fbbf24`, rose `#fb7185`, streak green `#00ff87`
- Every accent glows: text `text-shadow:0 0 16-20px rgba(<accent>,0.5)`, shapes `box-shadow:0 0 24-44px -8px rgba(<accent>,0.7-0.9)`
- Recessed grooves (all progress bars): track `background:rgba(0,0,0,0.55-0.6); box-shadow:inset 0 2px 4px rgba(0,0,0,0.95), inset 0 -1px 0 rgba(255,255,255,0.05); border-radius:3-4px`; fill = accent gradient + outer glow
- Gradient hairline borders (6a cards): transparent border + `background-image:linear-gradient(<dark fill>,<dark fill>), linear-gradient(120deg, accent1, accent2); background-origin:border-box; background-clip:padding-box, border-box`
- Text: primary `#ffffff`/`#eef2f8`, secondary `#8b93a3`, muted `#5b6272`, body alt `#c6ccd8`
- Type: **Space Grotesk** for ALL English/numbers/labels, **IBM Plex Sans Arabic** for Arabic, `ui-monospace/'SF Mono'` for telemetry text. HUD headers: 14px, weight 700, `letter-spacing:.18em`, uppercase, with a colored `// SYS_TAG` suffix
- Micro-labels: 8.5–10px, `letter-spacing:.14–.28em`, uppercase
- Radii: same scale as warm

### Shared
- Phone frame: `width:430px; border-radius:44px; border:1px solid rgba(255,255,255,0.07-0.1); overflow:hidden; padding:~28px 20-24px`
- Domain glyphs (replace all emoji): ◆ Family (gold/amber) · ● Friends (teal) · ▲ Community (green) · ■ Identity (violet) · ✦ Culture (coral/rose)
- Domain data (from repo curriculum): 35 total moments across 5 domains; demo state ≈ 12 done
- Arabic is always `dir="rtl"`; transliteration line below in accent color (italic purple in warm, cyan Space Grotesk in neon)

### Keyframes used
```css
@keyframes glowPulse { 0%,100%{opacity:1} 50%{opacity:.45} }
@keyframes orbitSpin { to { transform: rotate(360deg); } }
@keyframes floatyC { 0%,100%{transform:translate(-50%,-50%) translateY(0)} 50%{transform:translate(-50%,-50%) translateY(-8px)} }
@keyframes shadowPulse { 0%,100%{transform:translateX(-50%) scale(1); opacity:1} 50%{transform:translateX(-50%) scale(.92); opacity:.7} }
@keyframes ringDraw { from { stroke-dashoffset:326; } }
@keyframes breathe { 0%,100%{transform:scale(1)} 50%{transform:scale(1.045)} }
@keyframes aura { 0%{transform:translate(-50%,-50%) scale(.72); opacity:.55} 100%{transform:translate(-50%,-50%) scale(1.55); opacity:0} }
@keyframes barGrow { from { width:0; } }
@keyframes cardFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-11px)} }
@keyframes cardSweep { 0%,55%{transform:translateX(-160%) rotate(10deg); opacity:0} 65%{opacity:.5} 100%{transform:translateX(160%) rotate(10deg); opacity:0} }
```

---

## Screens

### 1. Domain Map × Journey — four shapes (warm system, options 1a–1d)
All four merge the domain map and the journey ("then → now") into ONE screen. Same data everywhere. They are alternative treatments — ship one.

**1a — المشوار The Road.** Single winding vertical path (SVG cubic curves, 390×1250). Completed segments: solid 3px stroke in domain color + `drop-shadow` glow; upcoming: `stroke-dasharray="1 9"` dotted white 10%. Nodes: circles on the path, done = filled accent w/ glyph, next = larger + pulsing ring, locked = dim outline + 🔒-free (use reduced opacity, no padlock emoji). Node labels alternate left/right: title (12px, w600) + meta line (9.5px muted, e.g. "3 phrases · comfortable"). Domain section dividers: glyph + name + Arabic + hairline + count. Header: Arabic serif title 34px gold + count pill. A "Then → now" glass row button under the header (links to journey detail). Bottom fades out with a gradient + "the road keeps going" line.

**1b — الشجرة The Tree.** SVG tree: gradient trunk (`#7d6544→#c9a96e`, 9px stroke), 5 branches (one per domain), roots below. Each branch: dim 20%-opacity full path + solid glowing overlay path for completed portion + dots (moments) positioned along it, done = filled glowing 9px dot, else 6px dim. Branch end labels: glyph+name (11.5px w600 in domain color) + "count · tier" line. Center-bottom pill: "N of 35 on the tree". Roots section below the tree: "الجذور · the roots" heading + journey rows (question, meta, delta chip e.g. "+38").

**1c — المدارات The Orbits.** 5 concentric rings (340→132px), each `animation:orbitSpin 64–110s linear infinite` (alternate reverse), inside `perspective:800px`. Each ring: SVG circle track (white 8%) + accent arc via `pathLength="100" stroke-dasharray="<pct> 100"` + moment dots on the ring. Floating center core: 112px circle, radial glass, gold border/glow, big serif count, `floatyC` bob + elliptical ground shadow (`shadowPulse`). Below: flat legend — 5 rows: glyph, name + Arabic, thin progress bar, count, tier. Then journey rows ("Then → now").

**1d — وين واصل Where You Stand (interactive).** Five large tappable domain rows: glyph tile, name + Arabic, progress bar, "next: <moment>" line, chevron. Tapping a row expands a detail panel: all moments as small tiles (done/next/locked), plus then→now rows for coached moments. This is the plainest, recommended default.

**Cross-navigation (prototype behavior to replicate as app navigation):** views deep-link into each other — road's "Then → now" → tree; tree branch labels → road; tree count pill → orbits; orbits core → tree; orbits legend → list; "← home" → dashboard. Each option also shows a "view as: road/tree/orbits/list" chip switcher.

### 2. Neon versions of the map (2a road, 2b orbits)
Same structure as 1a/1c reskinned in System B: Space Grotesk headers, ink-navy canvas, neon glows, borderless legend separated by luminous hairlines (`linear-gradient(90deg, transparent, rgba(accent,0.3), transparent)` 1px rows), then→now hero with giant numerals.

### 3. Neon core app screens (3a–3d)
**3a — Daily gate.** Single-viewport first-open screen. Top: Arabic wordmark طريقة + "SUDANESE ARABIC TRAINER" micro-label; streak pill (7px green dot `#00ff87` glowing + "2-day streak"). Center: giant Arabic greeting يا هلا بيك تاني (50px IBM Plex Sans Arabic w600) + violet transliteration + one muted line. Bottom: glass focus card — "TODAY'S FOCUS · COMMUNITY" (indigo micro-label), title "Thanking someone properly" (24px w700), meta line, divider, then the Start button: full-width, `linear-gradient(90deg,#6366f1,#a855f7,#ec4899)`, radius 16px, right side = 38px circular **WebGL orb** token. Under card: "Explore the domain map instead →" ghost link. No nav bar.

**3b — Core dashboard.** Cosmic header: violet radial glow + dot grid fading down. Top row: wordmark micro-label + streak pill. Greeting: Arabic 40px + transliteration. **Unified stats widget** (one glass card): left = 112px SVG progress ring (`stroke #2dd4bf`, `stroke-dasharray 326`, animated `ringDraw` 1.6s, drop-shadow glow) with "62% deck" center; right = 3 borderless rows (Mastered 34 emerald / Still learning 12 amber / Coached scenarios 7 cyan — 19px w700 numbers with glow). **2×2 path grid**: Flashcards, Your coach (ACTIVE: cyan border `rgba(34,211,238,0.5)` + `box-shadow 0 0 44px -12px` + white title + "scenario 2 waiting →"), Tune your ear, Your journey. Inactive cards: `rgba(11,15,25,0.6)`, no border, muted. Each card: small geometric icon (drawn: card outlines, orb sphere, eq bars, ✦), 14px w600 title, 10.5px sub. Bottom: floating pill dock (HOME/CARDS/COACH/JOURNEY), glass `rgba(0,0,0,0.4)` blur 28px, active item cyan + glow dot.

**3c — Coach idle.** 2px top progress hairline (4.5% filled teal). Header row "Your coach" + "SCENARIO 1 OF 22" + ‹ › arrows. Glass prompt plate: question 19px w600 + "SAY IT IN SUDANESE ARABIC" teal micro-label. Vocab chips row: recognized chip = solid emerald bg, dark text, "saraha ✓"; others = tinted 7% bg + glow, Arabic 15px + transliteration 9.5px. Bottom half: **the orb IS the mic** — 180px WebGL orb, `breathe` 5s, "Tap orb to speak" + "OR TYPE INSTEAD" ghost.

**3d — Coach listening.** Same header. Prompt + chips at `opacity:.3`. Orb at 280px, `mode="listening"`, two expanding `aura` rings (teal + violet, 2.6s staggered 1.3s). "LISTENING..." monospace, `letter-spacing:.32em`, teal, pulsing. Bottom control pod (one glass pill): rose stop square (13px, radius 3, glow) · flex "Compare with a native" violet capsule (#8b5cf6 solid, glow) · ✕ ghost.

### 4. Remaining pages, both styles (4a–4g)
**Flashcards verdict variant (4a neon / 4e warm):** progress hairline 26%, "12 OF 46". Card stack: 2 ghost cards behind (`translateY(18/34px) scale(.94/.88)`), active 340px glass card: category micro-label, Arabic 56px, transliteration, "TAP TO FLIP". Pager dots (active = 22px bar). Two verdict buttons: "Still learning" (amber ghost) + "Got it ✓" (neon: emerald gradient + glow / warm: gold ghost).

**Tune your ear (4b neon / 4f warm):** hairline 40%, "CLIP 2 OF 5 · SOLJA". Glass player card: 50px circular play (neon: cyan gradient; warm: gold gradient; dark triangle), 12-bar waveform (first 5 bars accent + glow, rest white 14%), "0:04 / 0:09". Arabic clip line 21px with the quiz word highlighted in accent; transliteration under. Question 17px with highlighted word. 3 answer buttons: picked = tinted bg + accent border + ✓; others ghost. Bottom "Why it matters" tinted info card.

**Then → now detail (4c neon / 4g warm):** header "← journey" + "3 ATTEMPTS", title. Hero: `38 → 76` (38 at 44px 25% white, arrow accent, 76 at 84px w700 + huge glow), micro-label "NATURAL SCORE · +38 IN THREE ATTEMPTS", 3 mini growth bars (38%/54%/76% heights, last = accent gradient + glow). Stacked comparison card: "THEN · THREE WEEKS AGO" + MSA sentence (muted) + italic note "correct — but it's MSA, not how family talks"; gradient hairline divider; "NOW · YESTERDAY" + dialect sentence (bright, larger) + transliteration. "WHAT CHANGED" list: 3 rows (old → new) separated by hairlines: أعمل→بعمل, منذ→من حوالي, added صراحة…هسه. CTA pill: "Answer it again — beat 76".

**Daily gate warm (4d):** same layout as 3a in System A — serif greeting 48px, gold ghost start button with orb token, teal streak pill.

### 5. The Tariga flashcards (5a warm — faithful to app; 5b neon — same layout)
Header: title + "3 of 46 · Solja episode"; segment toggle "عربي → EN | EN → عربي" (active = gold/cyan tinted pill). **3D deck** in `perspective:1500px`: two背 cards offset `translateX(52/96px) translateZ(-110/-210px) rotateY(-16/-22deg) rotate(-3/4deg)`, opacity .5/.25. Active card 400px tall: gradient dark surface (warm) or glass (neon), tag chips ("Video 1", "Intensifier"), speaker icon + star, centered Arabic 40–42px + transliteration, "tap to flip · swipe to browse". `cardFloat` 7s bob + `cardSweep` light sweep (55% width diagonal white gradient crossing every 4.2s) + elliptical ground shadow. Pager dots. **Practice panel** (glass): "PRACTICE — SAY IT IN ARABIC" + Word|Sentence toggle; prompt box with English meaning; 50px round mic button (violet gradient + glow, SVG mic path) + "Say شديد out loud — or type it instead".

### 6b′. Home & daily gate — cyber-HUD pass (7a, 7b) — System B, supersedes 3a/3b when picking the FUI direction
**7a — Home dashboard.** Same structure as 3b with these upgrades: stats widget gets a gradient hairline border (violet/cyan/green); the 62% ring becomes a FLOATING halo — neon green stroke (#4ade80, drop-shadow 0 0 8px), gentle 6s vertical bob + pulsing elliptical ground shadow beneath; each stat row gains a HUD tag prefix ([VAL_MS] / [VAL_LRN] / [VAL_CCH], 8px Space Grotesk, letter-spacing .16em, #5b6272); the "Your coach" tile embeds a live 26px WebGL orb (breathe 4s) instead of a static icon; greeting is compact (27px Arabic + transliteration inline, no ceremony); wordmark carries a "// HOME" suffix.
**7b — Daily gate, holographic portal.** Same single-viewport strategy as 3a with: zero serif; mission framing "[ MISSION: COMMUNITY ]" micro-label; the focus card becomes a portal — gradient hairline border (violet→cyan→pink), 104px orb inside with a blurred violet aura bleeding across the card + a large pulsing glow behind the card; START LESSON = full-width indigo→purple→pink gradient pill, uppercase, letter-spacing .04em; footer links as bracket nodes: "[ EXPLORE DOMAIN MAP ] | [ HOW TARIGA WORKS ]" (10px, spaced, separated by a dim vertical bar).

### 6c′. Warm app home update (in Tariga.dc.html)
The home screen is a dashboard, NOT an intro: compact one-line greeting (27px Arabic + italic transliteration, left-aligned), then a "Continue where you left off" hero (58px orb, micro-label, "Coach · scenario 2 — \"Tell me about yourself\"", "~2 min to finish"), then stats ring card, deck source, path grid. The ceremonial intro lives ONLY on the daily gate screen (4d warm / 7b neon), shown once per day (persist last-shown date; skip straight to home otherwise).

### 6. FUI / holographic components (6a–6e) — System B only
**6a — Word origins, map state.** HUD header `WORD ORIGINS // SYS_DATA_01` + Arabic وين اللهجة عايشة؟ full-white. Map viewport: glass card w/ cyan hairline + inner 34px cyan grid overlay; embeds the app's **sudan-map** component (regions colored, selected = Khartoum highlighted). Below: 2 glass cards with **gradient hairline borders** — "FEATURED WORD" (فاهماني, fahimani, note tying to map) and "PHRASES BY REGION" (3 rows: color dot MUST exactly match map region color + name + recessed groove bar: Khartoum amber 78%, Gezira cyan 44%, Kordofan violet 26%).
**6b — Word origins, boot state.** Same header w/ `// SYS_BOOT`. Recessed dark viewport embedding the **globe** point-cloud component + cyan targeting reticle (150px pulsing circle + crosshair ticks + "SUDAN" monospace). Below, instead of an empty legend: telemetry card, monospace 11px, line-height 2: `[OK] TARIGA GEO MODULE v2.1` / `[..] SCANNING COORDINATES…` / `[..] TARGET ACQUIRED: LAT 15.6°N · LON 32.5°E` / `[▮▮▮▮▮▯▯] LOADING REGIONS 5/7_` (blinking cursor).
**6c — Circuit orbits.** 1c's structure, neon: each ring = dashed trace track (`stroke-dasharray "0.7 1.6"`, accent 30%) + solid completed arc (1.1px, full accent, `drop-shadow` glow) + dots. Center = "matrix core": 104px sphere, teal radial + 12px grid overlay clipped to circle, big white count + "OF 35". Legend strip: 5 micro-labels with glyphs in domain colors.
**6d — HUD metric tile.** `NATURAL SCORE // TELEMETRY` header. `[ 38 → 76 ] ▲ +38` — brackets 20px muted, 76 at 80px white w/ green glow, delta chip green. 3 recessed groove bars: DIALECT FIT 82 (emerald), CONNECTORS 71 (cyan), FLOW 64 (violet); labels white 9.5px spaced, values right-aligned in accent.
**6e — Orb pod.** Coach screen where the orb sits in a **countersunk chamber**: 310px circle, `box-shadow:inset 0 14px 40px rgba(0,0,0,0.95), inset 0 -2px 0 rgba(255,255,255,0.05), 0 2px 0 rgba(255,255,255,0.04)` + violet inner ring + dashed ring; 230px orb breathing inside; "LISTENING..." monospace below; full-width "Compare with a native" capsule = glass + thin violet border + `glowPulse` 2.6s.

---

## Interactions & Behavior
- All progress bars animate in with `barGrow` / `ringDraw` on mount (~1.2–1.6s, `cubic-bezier(.3,.8,.3,1)`)
- Flashcard: tap flips (3D rotateY), swipe advances; verdict buttons record SRS state
- Coach: tapping orb → listening state (fade content to 30%, orb scales up, aura rings start); stop/✕ return to idle
- 1d rows expand/collapse detail panels (single-open accordion)
- Map/journey views deep-link between each other (see §1)
- Locked content: reduced opacity + tier label ("comfortable"), no interaction
- No scroll hijacking; screens scroll vertically inside the phone frame

## State Management
- `progress`: per-moment status (done / next / locked), per-domain counts, total (12/35 demo)
- `journey`: coached attempts — question, then-text (MSA), now-text (dialect), transliterations, score pairs (38→76), word swaps
- `deck`: card list (46), index, direction (AR→EN / EN→AR), per-card SRS verdict
- `coach`: scenario index (1 of 22), state (idle / listening / feedback), recognized vocab chips
- `streak`: day count
- Orb mode: `idle` | `listening` | `thinking` (attribute on the component)

## Assets (SHARE THESE FILES WITH CLAUDE CODE)
Must-share (real working components the designs embed):
- `orb.js` — `<tariga-orb>` WebGL iridescent orb (CSS fallback included), `mode` attribute
- `sudan-map.js` — `<sudan-map>` region map component, `highlight` attribute
- `globe.js` — `<tariga-globe>` point-cloud globe
- `geo-data.json` + `countries.geo.json` — data the map/globe load
- `Canvas.dc.html` — all screen designs (the source of truth; HTML/inline styles are readable even though it uses a custom runtime)
- `Tariga.dc.html` — the existing app prototype (home, flashcards, coach, journey)
- `FLASHCARDS-SPEC.md` — existing flashcards spec
- This `README.md`
Also point Claude Code at the repo `leeabd123/fictional-palm-tree` (`js/modes/domainmap.js`, `js/modes/journey.js`, curriculum data) — the new map replaces those modes.
Fonts (Google Fonts): Space Grotesk (400–700), IBM Plex Sans Arabic (400,600), Instrument Serif (400 + italic), Noto Naskh Arabic, DM Sans.
Note: `support.js` is the design-tool runtime — do NOT ship it; ignore `{{ }}` template holes and `<sc-for>`/`<sc-if>`/`<x-import>` tags when reading the DC files; treat them as loops/conditionals/component mounts.

## Files in this bundle
- `README.md` (this file)
- `Canvas.dc.html`, `Tariga.dc.html`, `support.js` (needed only to OPEN the .dc.html files in a browser locally)
- `orb.js`, `sudan-map.js`, `globe.js`, `geo-data.json`, `countries.geo.json`, `FLASHCARDS-SPEC.md`
