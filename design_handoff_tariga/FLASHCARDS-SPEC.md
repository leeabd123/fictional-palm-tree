# Tariga Flashcards — Design Spec (handoff to Claude Code)

Implement/fix the flashcard mode to match this spec exactly. The reference implementation lives in `Tariga.dc.html` (FLASHCARDS section) — this doc describes the intended design.

## Overall vibe
Dark, premium, futuristic. Cards are physical glass/stone objects floating in space — never flat rectangles. Warm gold carries cultural identity; teal-cyan is the "AI/smart" accent; purple-pink is reserved for voice.

## Design tokens
- Background: `#0f0d0b` (warm charcoal, NOT pure black)
- Text primary `#f0ede8`, secondary `#a09e9a`, muted `#7a756e`
- Gold accent `#c9a96e`, light gold `#e8c99a`
- Teal accent `#4fd8c4`, success green `#56c98f`, error/red `#e08a7a`
- Transliteration always in soft violet `#a78bfa`, italic
- Fonts: UI = 'DM Sans'; Arabic = 'Noto Naskh Arabic' (fallback 'Instrument Serif'); headings = 'Instrument Serif' italic
- Pills/buttons: fully rounded (border-radius 100px). Cards: radius 24px.
- All glows are soft/diffuse (large negative-spread box-shadows), never sharp neon.

## Screen layout (mobile-first, max column ~560px)
1. Header row: italic serif gold title "Flashcards" + counter "3 / 5 · Solja episode" (tabular numerals). Right: direction toggle — a pill-group with two options: **عربي → EN** and **EN → عربي**. Active option: gold tint bg `rgba(201,169,110,0.15)`, gold text, gold border. Inactive: transparent, muted text.
2. Card stack (the centerpiece)
3. Elliptical floating shadow under the stack + progress dots
4. Practice panel (Word / Sentence, type-or-speak, compare)
5. After flip: "Still learning" / "Got it ✓" buttons. Before flip: prev/next round buttons.

## The card stack (CRITICAL — the signature interaction)
- Container: `perspective: 1500px`, height ~426px. Cards `width: min(86%, 380px)`, height 400px, absolutely centered.
- Render prev/current/next cards simultaneously as a fanned stack:
  - Active card: front & center, `translateX(-50%)`
  - Neighbors: offset ±72% X, pushed back `translateZ(-120px)`, rotated `rotateY(∓12deg)`, opacity ~0.55, no pointer events beyond tap-to-select
  - Transition between positions: `transform .65s cubic-bezier(.25,.9,.3,1)` — physics-feel, no snapping
- **Idle float**: active card only, `translateY 0 → -11px → 0` over 6.5s ease-in-out infinite. The elliptical shadow below scales/fades in counter-phase (shadowPulse) to reinforce depth.
- **Flip**: tap card → `rotateY(180deg)` on an inner wrapper, `transition: transform .75s cubic-bezier(.25,.9,.3,1)`, `transform-style: preserve-3d`, both faces `backface-visibility: hidden`. During flip, a diagonal **light sweep** (transparent → warm white 7% → transparent gradient strip) travels across the face once (~1.1s).
- **Swipe**: horizontal swipe (>45px) advances/retreats the deck (touch + mouse). Suppress the tap-flip for 300ms after a swipe.
- Progress dots under the shadow: active dot is a wide gold pill with glow; others small dim circles.

## Card faces
Front (عربي → EN direction):
- Top row: pill tags — gold "Video 1" (source) + neutral category pill (e.g. "Connectors"); right: speaker icon (plays the word via TTS) + star icon
- Center: Arabic word HUGE (40px Noto Naskh Arabic, rtl, `text-shadow: 0 2px 24px rgba(232,201,154,0.18)`), transliteration below in violet italic 14px
- Bottom: "tap to flip · swipe to browse" caption (11px uppercase, letterspaced)
- Surface: `linear-gradient(160deg, rgba(46,42,36,0.92), rgba(28,25,21,0.96))`, 1px gold-tinted border `rgba(232,201,154,0.16)`, shadows: `0 34px 70px -30px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.07), 0 0 50px -22px rgba(201,169,110,0.4)`

Front (EN → عربي direction): English meaning 23px semibold center + caption "say it in Arabic below — or flip anytime". Arabic + transliteration hidden until flip.

Back (teal-tinted border/glow instead of gold):
- Header: Arabic word (24px) + transliteration + speaker icon (plays word + example sentence)
- English meaning in light gold 16px semibold
- **Context note** in a gold-tinted inset box — cultural usage explanation (this is the warm, human part; never cut it)
- **Example sentence** in a neutral inset box: Arabic (rtl, 16px) + violet transliteration + muted English translation

## Practice panel (below the deck)
Glass card (blur backdrop, faint border). Header: teal uppercase micro-title (e.g. "SAY IT IN ARABIC") + Word/Sentence pill toggle.
- Prompt box: shows the target in the *source* language — italic gold quote. In Sentence mode with multiple examples: ‹ 1 / 2 › pager.
- Input row: purple-pink gradient mic button (50px circle, glow; pulses while "recording") + rounded text input (accepts Arabic script OR Arabizi like "fahimani") + gold "Check" button.
- After Check: side-by-side compare grid — "YOU SAID" vs "THE CARD" (with speaker icon), then word-match chips: each target word as a pill, green tint + green border if the user said it (matches Arabic script OR transliteration, case-insensitive), dim if missed. Score line like "3 OF 5 WORDS".
- Buttons: "↻ Try again" ghost pill; sentence pager if multiple.

## Mark buttons
Only after flip (materialize in: fade + 14px rise + blur→sharp, .45s):
- "Still learning" — ghost pill, red-tinted border `rgba(217,107,90,0.45)`, text `#e08a7a`
- "Got it ✓" — green tint bg, green border/glow `rgba(86,201,143,…)`. Hover: deeper glow + 1px lift.
Both advance to the next card and reset flip.

## Data shape
```js
{ a: "فاهمني / فاهماني",            // Arabic
  p: "fahimni / fahimani",          // transliteration
  e: "You understand me?",          // English
  ctx: "THE most important check-in in Sudanese Arabic…", // cultural note
  ex: "الموضوع صعب — فاهماني؟",     // example sentence (Arabic)
  exph: "al-mawdu3 sa3b — fahimani?", // example transliteration
  exen: "The matter is difficult — you understand?",
  cat: "Connectors" }
```
Every Arabic string everywhere MUST be accompanied by its transliteration (violet italic). Arabic legibility is non-negotiable: never place Arabic over glow/glass without full contrast.

## Motion rules
- Everything eases with `cubic-bezier(.25,.9,.3,1)` or `cubic-bezier(.2,.8,.2,1)`; nothing snaps.
- Feedback/compare content "materializes": opacity 0→1, translateY 14px→0, blur 2px→0, staggered ~100ms.
- Reserve the strongest motion for: card float, flip+sweep, success glow. Keep everything else calm — it's a learning app; motion must not compete with reading Arabic.

## TTS
Speaker icons use `speechSynthesis` with `lang: 'ar-SA'`, rate 0.88 (browser voice is MSA — swap for a real Sudanese TTS service when available).
