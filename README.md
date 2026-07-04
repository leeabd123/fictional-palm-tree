# طريقة (Tariga) — Sudanese Arabic Coach

A voice-first, community-verified coach that helps Sudanese diaspora heritage
speakers actually **speak** Sudanese Arabic — not just understand it. Built
around ~300 vocabulary items, phrases, and full conversation scenes sourced
from real Sudanese podcast episodes, all verified by a native speaker.

The core insight: heritage speakers understand the dialect from growing up
around it, but freeze when they have to produce it. This is a
production-and-confidence problem, not a vocabulary problem — so the product
promise is belonging, not fluency benchmarks.

## The core loop — Speak & Respond (AI coach)

1. A real-life scenario, with the question shown in toggleable Arabic /
   phonetic / English layers.
2. You type how *you* would answer — Arabic script or Arabizi
   (`saraha`, `3ashan`…), both count. (Voice input is the next tier;
   text-first is deliberate.)
3. Claude compares your answer against 2–3 **native-speaker reference
   answers** that ship with each scenario. No absolute "correct/incorrect"
   judgment — a low-resource dialect can't support that, and one right
   answer doesn't exist in a living language. Everything is framed as
   *"a natural way many Sudanese speakers say this."*
4. Feedback: what already sounds Sudanese, what reads as formal MSA, what's
   shaped like English, a side-by-side with the closest native answer, and
   your own answer upgraded into one natural phrasing.
5. Every attempt is stored in your browser. Answer the same scenario again
   later and the **journey view** shows a real before/after: new Sudanese
   vocabulary in gold, English code-switching you dropped, and a
   naturalness meter moving over time.

## Everything else

Active path: Flashcards → Deep cards → Starred → Shadowing → Sentence
builder → **Speak & Respond (coach)** → Tune your ear (comprehension,
no production pressure) → Conversation mode (the full podcast transcript).
Archived but fully working: Quiz, Deep quiz, Flow translation, Transitions
guide, Vocab lists, Full reference.

## Running it

It's a static site — open `index.html` or serve the folder
(`python3 -m http.server`) and everything except the AI coach works with no
setup. GitHub Pages serves it as-is.

The AI coach needs a way to reach Claude:

- **For real users:** deploy the tiny Cloudflare Worker in
  [`worker/`](worker/README.md) (~10 minutes, free tier), then paste the
  Worker URL into the coach's connect panel. Your API key lives on
  Cloudflare, never in the frontend.
- **For your own testing today:** open Speak & Respond and paste your
  Anthropic API key in dev mode. It's stored only in your browser's
  localStorage and calls Anthropic directly.

## Layout

```
index.html          app shell + sidebar
css/                base styles · polish layer · coach/journey styles
js/data/            vocabulary, scenarios (with native reference answers),
                    conversation scenes, grammar/transitions, phonetics
js/core/            state · routing · coach prompt+schema · API transport ·
                    attempt history · intros · results
js/modes/           one file per learning mode
worker/             Cloudflare Worker proxy (the only backend)
```

No build step, no framework, no dependencies — every file is hand-editable
and the whole app deploys by pushing to GitHub Pages.
