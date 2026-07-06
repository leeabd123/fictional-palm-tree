# طريقة (Tariga) — Product Feature Inventory

*A voice-first, community-verified Sudanese Arabic coach for diaspora heritage speakers.*
*Use this document as the briefing when discussing curriculum, functionality, or strategy improvements.*

---

## 1. The core idea

- **Audience:** diaspora heritage speakers who understand some Sudanese Arabic but freeze when speaking — the goal is sounding like family, not passing a test.
- **Philosophy:** comparison, never judgment. Nothing in the app says "correct/incorrect" — feedback is always "here's a natural way speakers say it" next to what you said.
- **Content source:** real podcast transcripts (Wansa ma3 Us — Solja episode, Ala Al-Shareef episode) plus a Sudanese slang glossary and deep vocab bank, so every phrase is something a real speaker actually said.
- **Arabizi is a first-class citizen:** every input accepts Arabic script or Latin-letter Arabizi (saraha, 3ashan…), because that's how the diaspora actually types.

## 2. The AI coach (Speak & Respond) — the flagship loop

- **22 real-life scenarios** (podcast-style questions: introduce yourself, handle hate comments, what success means…), each with:
  - English question + Arabic + phonetic behind a "show hint" reveal
  - required + bonus vocab chips ("try using") that glow teal live as you weave them into your answer
  - 2–3 native-speaker model answers (never called "the correct answer")
  - a coaching tip
- **Tiered response modes:** voice-first (big mic → full-screen listening orb with live transcript, Stop / Compare-with-a-native / cancel) with graceful fallback to a text box; whisper-quiet speech works.
- **Claude-powered comparison feedback** (structured JSON, enforced schema):
  - overall impression, strengths ("already sounds Sudanese") with quotes
  - MSA-flagged phrases with the Sudanese swap (e.g. الآن → هسه)
  - English-shaped phrasing with more natural alternatives
  - code-switched English words (framed as normal, swap one at a time)
  - which model answer yours was closest to + comparison note
  - an upgraded version of *your own* answer (stays close to what you said) with a speak-aloud 🔊 button
  - encouragement in the app's warm voice
- **Attempt history per scenario** stored locally with client-side metrics (Sudanese key phrases used, English words mixed in, natural score 0–100).
- **The Journey view:** first try → latest side by side, score grid with glowing bars, "the numbers" deltas, new Sudanese vocab picked up, English no longer leaned on, every-attempt timeline.

## 3. Learning modes (the path)

| Mode | What it does |
|---|---|
| **Home** | Time-of-day Sudanese greeting, streak pill, progress ring (% of scenarios coached), stat rows, deck-source switcher, path cards, map preview |
| **Flashcards** | Floating 3D card (tap to flip, swipe to browse), عربي→EN and EN→عربي directions, speak-aloud, star, progress dots, + a Word/Sentence practice panel that works in both directions (type or speak → compare vs the card with matched-word chips) |
| **Deep cards + synonyms** | Word + context + example + teal "swap in" synonym chips |
| **Quiz** | 4-choice recognition, instant green/red, streak dots |
| **Deep quiz** | 4 drill types: context cloze, mixed drill, EN→AR production, word-order arrange — built on retrieval practice/interleaving research |
| **Shadowing** | English prompt → say it out loud → blurred Arabic behind a dashed reveal → Try again / Nailed it |
| **Sentence builder** | Situation + target phrase (gold keyword box) → build your own → "show one natural way" |
| **Flow translation** | Whole-paragraph production, then check line by line (accordion with vocab chips) |
| **Tune your ear** | Comprehension without production: predict the *meaning* of a real podcast line, or predict *what comes next* in an exchange; Arabic/phonetic layers toggleable; session score |
| **Conversation mode** | The real podcast scene by scene as chat bubbles; full-read mode (blur-reveal every line) or respond mode ("Your turn — you're Solja" with vocab chips) |
| **Transitions guide** | The connectors that make you sound fluent (pivots, fillers) with when-to-use rules and examples |
| **Vocab lists** | Curated lists (Essential 30 first) as a scannable grid |
| **Full reference** | Every phrase in one searchable/filterable table |
| **Starred items** | Star anything anywhere; persists across sessions; review list with examples + speak-aloud |
| **Word origins map** | Animated globe finds Sudan → dotted-particle map with real borders, the Nile, region groups; tap a region for its phrases + learner counts; featured word of the week |

## 4. Community & preservation (Contribute)

- Micro-prompts, not open-ended asks ("your khalto says you look too thin — what do you say?")
- Answers tagged by **region** (Khartoum, Omdurman, Port Sudan…) and **generation** (grandparents' / parents' / my generation) — because there is no single "correct way"
- Trust threshold stated up front: goes live only after **2–3 independent native speakers** confirm it sounds natural
- Submissions persist locally as "pending review" (the real review backend is the next build)
- Region tags are what will eventually power real data on the map

## 5. Progress & motivation systems

- Practice streak (consecutive days, any mode counts)
- Scenarios-coached progress ring on home
- Mastered / still-learning card marking
- Natural score per coach attempt (client-side heuristic; the AI does the qualitative part)
- Before/after journey per scenario (the "look how far you've come" moment)
- Starred-items count in the nav

## 6. Design system

- Dark, warm, Sudanese-gold identity: Instrument Serif italics + DM Sans + Noto Naskh Arabic
- Glass panels, pill buttons, teal coach accents, lavender-pink voice gradients, gold CTAs
- Animated WebGL orb (idle / listening / thinking states) as the coach's presence
- Collapsible sidebar on desktop (persisted), off-canvas drawer + bottom tab bar on mobile
- Every screen matches the Claude-design export

## 7. Architecture (for functionality discussions)

- **Zero-build static app** — vanilla JS + CSS, deployable on GitHub Pages; works offline except the AI coach
- **Cloudflare Worker proxy** for the Claude API: the API key lives only as a Worker secret, never in the front-end; origin allowlist, rate limiting, model + token caps (`worker/README.md`, ~10-min deploy, ~$0.02/eval)
- Dev fallback: personal API key stored in the browser only
- All user data in localStorage: stars, attempts, activity/streak, contributions, API config, sidebar state
- Browser SpeechRecognition for rough voice input (accuracy on Sudanese is limited — that's why text ships first); browser speechSynthesis for speak-aloud

## 8. Known gaps — the improvement backlog to discuss

**Curriculum**
- No spaced-repetition scheduler yet (cards don't resurface on a forgetting curve)
- No leveling/sequencing — all scenarios and decks are flat; no "start here" path by proficiency
- No listening comprehension with *actual audio* — Tune your ear is text-based until native recordings exist
- Only 2 podcast episodes + glossary as source content; no grammar micro-lessons (verb conjugation, negation patterns)
- No assessment/placement ("how Sudanese do I sound today?" baseline test)

**Functionality**
- Community review pipeline is front-end only (no backend, no reviewer accounts)
- No user accounts / cross-device sync (everything is per-browser)
- TTS is generic Arabic, not a Sudanese voice; STT struggles with the dialect — native-speaker audio recordings are the real fix for both
- Map region data is illustrative until contributions carry real tags
- No push/reminder loop to protect streaks; no social features (share your journey, family leaderboard)
- Voice mode records transcript only — no pronunciation scoring or audio playback of your own attempt

---
*Repo: leeabd123/fictional-palm-tree · static app at index.html · AI proxy in worker/*
