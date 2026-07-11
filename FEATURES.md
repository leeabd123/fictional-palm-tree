# طريقة (Tariga) — Product Feature Inventory

*A voice-first, community-verified Sudanese Arabic coach for diaspora heritage speakers.*
*Use this document as the briefing when discussing curriculum, functionality, or strategy improvements.*
*All four roadmap stages of the learning-design doc are built (Stage 1 → 4).*

---

## 1. The core idea

- **Audience:** diaspora heritage speakers who understand some Sudanese Arabic but freeze when speaking — the goal is sounding like family, not passing a test.
- **Philosophy:** comparison, never judgment. Feedback is always "here's a natural way speakers say it" next to what you said — the primary comparison is *your answer vs. an upgraded version of your own answer*.
- **Content sources:** real podcast transcripts (Wansa ma3 Us — Solja; Ala Al-Shareef), a Sudanese glossary, and native-speaker-corrected scenario content. Anything not yet through the native correction round is badged "pending native review" in-app.
- **Arabizi is a first-class citizen** in every input, everywhere.

## 2. The curriculum (§14 schema)

- **Five life domains** (Family · Friends · Community · Identity · Culture), each with its own comfort tier (Beginning → Comfortable → Natural → Native-like) — progress is a shape across domains (radar chart on Journey), never one global level.
- **32+ guided scenarios** across all domains at Beginning + Comfortable tiers, with `gender_variant` targets (شبعان/شبعانة), register notes, required vocab, cultural notes, source + verification status on every item.
- **Progressive unlock:** Comfortable scenarios, Free-form, speed rounds, and the Live call unlock per-domain as Beginning items are practiced — mode discovery as a side effect of progress.
- **Flat, filterable scenario browser** per domain (tier/verified/pending chips) — community-approved items will slot into the same list via tags.

## 3. The practice ladder (§4 — scaffolding fades as you grow)

| Tier | Mode | What happens |
|---|---|---|
| Highest | **Guided** | English shown → produce the Arabic → compared word-by-word against a native-verified target (Arabic script OR Arabizi counts) |
| High | **Phone Call Lite** | Real calls turn by turn — every family line pre-written and verified (Habooba checks in · Eid across time zones · a condolence visit) |
| Medium | **Your coach (Scenario)** | Free response → Claude compares against 2-3 native model answers |
| Low | **Free-form** | Open prompt, no vocab list, no references — gentler bar |
| None | **📞 Live call** | Habooba answers *dynamically* — every turn generated but few-shot grounded on the verified transcripts; coaching arrives as quiet whispers, never in character |

## 4. The AI coach

- Structured JSON feedback: overall, strengths, MSA→Sudanese swaps, English-shaped phrasing, code-switching (framed kindly), **missed transition words** (يعني، صراحة…), **missed formulaic chunks** (إن شاء الله as one unit), **register calibration** ("correct Arabic, but a bit too casual for an elder"), closest model answer, an upgraded version of *your own* answer with speak-aloud, encouragement.
- Feedback hierarchy (§0): upgraded-own-answer is primary; model answers + specific flags are collapsed secondary.
- Journey "the numbers": Sudanese phrases · English mixed in · transition words · formulaic chunks, then → now, per scenario.

## 5. Learning modes (the full library)

Flashcards (3D carousel, both directions, shared compare engine) · Deep cards + synonyms · Quiz · Deep quiz (cloze/production/word-order) · Shadowing · Sentence builder · Flow translation · Tune your ear (meaning · what-comes-next · **dictogloss reconstruct**) · Conversation mode (real podcast scenes) · **Speed rounds** (timed automatization over practiced items) · Transitions guide · Vocab lists · Full reference · Starred · Word origins map · **Warm-up** (returning users: 2+ days away → review from your own history first) · **How Tariga works** (plain-language research grounding: Output Hypothesis, Noticing, desirable difficulties, TBLT, ZPD, recasts…)

## 6. Community & trust (§16–17)

- **Contribute:** weekly prompts + free "suggest a phrase", tagged by region/generation/register; **AI-assisted tag suggestion** (Claude proposes domain/tier/register, human confirms — region/generation stay human-only); **gap-detection agent** surfaces one targeted ask from real coverage data.
- **Reviewer mode** — a distinct surface: one submission at a time, Approve / Edit-and-approve / Flag with reason **and a note back to the contributor** (returned items show the note + fix-and-resubmit; never silently gone).
- **Dual-track trust ladder:** organic (New ×1 → Contributor ×2 → Trusted ×3, weighted votes, config-driven live threshold) + **vouch fast-track** (Trusted members mint codes; a redeemed elder lands as Community Elder at full weight — identity as the credential).
- "Did you know" discovery after each review; communal verified-this-week stat; personal impact numbers.
- **Live map data:** verified region-tagged phrases add green +N counts per region and replace the featured word with the newest live phrase.

## 7. Progress & motivation

Streaks · progress ring · per-domain tiers + radar · before/after journey per scenario · natural score · starred persistence · first-run intro (السلام عليكم exchange + comfort self-report, first win < 1 min).

## 8. Architecture

- **Zero-build static app** (GitHub Pages) + **Cloudflare Worker** proxy: API key server-side only, origin allowlist, rate limits, model/token caps.
- **Event logging (§9):** `/api/events` (anonymized, batched, no PII → D1 when bound) + `/api/stats` (STATS_KEY-guarded) + `stats.html` scrappy internal dashboard.
- **Config-driven** (`js/core/config.js`): copy + thresholds as data, A/B-ready.
- All user data localStorage; shapes (votes/tiers/statuses/events) designed for the D1 backend to slot behind.
- Browser STT/TTS as placeholders until native recordings exist.

## 9. The honest backlog

- **The one real engineering gap:** the trust/review/vouch/event shapes run on localStorage — wiring the D1 backend makes it multi-user. Everything is shaped for that already.
- Native-speaker sign-off needed on: all "pending native review" scenarios (Stage 2/3 batches), the live-call transcript quality, scenario 4's reconstructed script, the condolence phrasing, and the ذ/ث/ظ checklist in `docs/PHONETICS-AUDIT.md`.
- No spaced-repetition scheduler yet (warm-up approximates it); no real native audio (fixes TTS + STT quality at once); no accounts/sync; licensed podcast partnerships (§6) are relationship work, not code.

---
*Repo: leeabd123/fictional-palm-tree · static app at index.html · AI proxy + events in worker/ · internal stats at stats.html*
