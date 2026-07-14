# طريقة (Tariga) — Product Feature Inventory

*A voice-first, community-verified Sudanese Arabic coach for diaspora heritage speakers.*
*Use this document as the briefing when discussing curriculum, functionality, or strategy improvements.*
*All four roadmap stages of the learning-design doc are built (Stage 1 → 4), plus the §22–28 additions: the Domain Map, three-tier access with a real content manager, the reviewer redesign, word/sentence starring, and the §28 gap fixes.*

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

Flashcards (3D carousel, both directions, shared compare engine) · Deep cards + synonyms (one word in depth, labeled sections: what it means / when you'd use it / heard in the podcast / swap-in synonyms, with a say-it-out-loud loop) · Quiz · Deep quiz (cloze/production/word-order) · Shadowing · **Sentence builder** (English sentence in → *your* Arabic out: produce it by typing/Arabizi/mic, get rated word by word on the shared compare engine, "suggest a word" reveals missing words one at a time, attempts tracked so beating your own best is the game) · Flow translation · Tune your ear (meaning · what-comes-next · **dictogloss reconstruct**, with the design-handoff player card: gold play button, waveform, "why it matters") · Conversation mode (real podcast scenes) · **Speed rounds** (timed automatization over practiced items) · Transitions guide · Vocab lists · Full reference · Starred · Word origins map · **The Domain Map × Journey (design handoff §1, warm system)** — one merged screen, four treatments behind a "view as" switcher: **المشوار the road** (one winding path, done/next/locked nodes), **الشجرة the tree** (five glowing branches + journey roots), **المدارات the orbits** (five slowly-spinning 3D rings + floating count core), and **وين واصل the list** (the recommended default — tappable domain rows expanding into moment tiles + up-next). Views cross-link exactly as the prototype does; every journey row opens the **then → now detail (4g)**: hero score pair, growth bars, stacked THEN/NOW comparison of your own attempts, what-changed word rows, and a "beat your score" CTA · **Warm-up** (returning users: 2+ days away → review from your own history first) · **How Tariga works** (plain-language research grounding: Output Hypothesis, Noticing, desirable difficulties, TBLT, ZPD, recasts…)

**Word & sentence starring (§27):** press-and-hold (or double-click) any Arabic word anywhere in the app — one interaction, built once, live everywhere. Known words show their real definition; unknown words get an AI lookup using the surrounding sentence as context and become "discovered words" (labeled as unverified). Star the word or the whole sentence; everything starred is drillable via the **"My starred" deck source** in flashcards/quiz. Lookups that miss the database are counted — a live, demand-driven content-gap signal surfaced in the founder analytics (§27.4).

## 6. Community & trust (§16–17)

- **Contribute:** weekly prompts + free "suggest a phrase", tagged by region/generation/register; **AI-assisted tag suggestion** (Claude proposes domain/tier/register, human confirms — region/generation stay human-only); **gap-detection agent** surfaces one targeted ask from real coverage data.
- **Reviewer mode** — a distinct surface: one submission at a time, Approve / Edit-and-approve / Flag with reason **and a note back to the contributor** (returned items show the note + fix-and-resubmit; never silently gone). Flag reasons include **inappropriate/spam** (§28 moderation) — removed outright, a different path from dialect accuracy.
- **Two queues (§25):** New submissions + an **Audit queue** — already-live and founder-seeded content resurfaces for independent re-confirmation over time ("still sounds right ✓" / "needs another look" → lands on the founder's desk). Verification is never "permanently done".
- **Duplicate detection (§25):** on submit, the system checks similarity against existing content and asks — same thing, *your region's variant* (kept, tagged as a variant — variation is the data), or genuinely different. With the coach connected it's a **semantic check (Claude comparing meaning and context)**; offline it falls back to token overlap.
- **Voice notes on reviews (§25):** reviewers can record themselves saying a phrase (explicit consent checkbox first, §28) — a byproduct source for the native-audio gap.
- **Personal asks:** the gap-detection agent's targeted request is shown on the reviewer dashboard, not just in Contribute.
- **Dual-track trust ladder:** organic (New ×1 → Contributor ×2 → Trusted ×3, weighted votes, config-driven live threshold) + **vouch fast-track** (Trusted members mint codes; a redeemed elder lands as Community Elder at full weight — identity as the credential).
- "Did you know" discovery after each review; communal verified-this-week stat; personal impact numbers.
- **Live map data:** verified region-tagged phrases add green +N counts per region and replace the featured word with the newest live phrase.

## 7. Progress & motivation

Streaks · progress ring · per-domain tiers + radar · before/after journey per scenario · natural score · starred persistence · first-run intro (السلام عليكم exchange + comfort self-report + **optional regional background (§28.4)** — their region then personalizes the gap ask, pre-fills contribute tags, and glows on the Sudan map, first win < 1 min).

**Home is a decision-maker, not an overview (§22):** greeting, streak, the warm-up when due, ONE recommended next action with a Start button, and a single deliberate door to exploration. The Domain Map is the overview — the skill tree plus the domain chips, practice library, deck switcher, stats, and the Sudan map card all live there. Every mode also stays one tap away in the sidebar / More tab.

## 8. Architecture

- **Zero-build static app** (GitHub Pages) + **Cloudflare Worker** proxy: API key server-side only, origin allowlist, rate limits, model/token caps.
- **Event logging (§9):** `/api/events` (anonymized, batched, no PII → D1 when bound) + `/api/stats` (STATS_KEY-guarded) + `stats.html` scrappy internal dashboard.
- **Config-driven** (`js/core/config.js`): copy + thresholds as data, A/B-ready.
- All user data localStorage; shapes (votes/tiers/statuses/events) designed for the D1 backend to slot behind.
- Browser STT/TTS as placeholders until native recordings exist.
- **Resilient coach transport (§28.1):** every AI call has a 60s hard timeout and retries once automatically on transient failures (network drop, 5xx, timeout); the user's answer is never lost — it stays editable in place with a plain-language error.
- **Accessibility (§28):** honors `prefers-reduced-motion` (all animation calms down system-wide) + an opt-in **Larger text** toggle on the How Tariga works page — the audience includes elders.

## 8b. The three-tier access model (§24)

- **Learner mode** — the whole app above.
- **Reviewer mode** — its own focused surface (§6), not a buried tab.
- **Founder tools** (`#admin`, or the discreet link on How Tariga works) — **two tabs, two jobs (§28.2):**
  - **Demo & simulate:** one switch unlocks every gate (with a visible 🔓 DEMO badge), state simulators (basics done / all practiced / days-away warm-up / replay intro / clear / wipe), reviewer-tier switcher, 26-mode jump grid, localStorage snapshot.
  - **Content manager (§26):** searchable/filterable tables for scenarios (domain/tier/status chips + full-text search), vocabulary, and call sequences — inline editing stored as local overrides applied on load; audit-queue flags land here for action; quick-add founder content (labeled pending-review); contributors + vouch codes; pending queue with force-approve/reject + bulk actions (bypasses vote weighting, for urgent fixes); analytics glance (event counts + most-looked-up missing words); full **JSON/CSV export** of the content database; and a **Show / hide table (visibility controls)** — hide any whole mode, guided scenario, coach scenario, or vocabulary item from learners without deleting it (hidden things vanish from the sidebar, tab bar, home cards, decks and the domain map; a "hidden" badge keeps them manageable in the content tables and one tap brings them back; demo mode can still preview hidden screens).

## 8b-2. Two complete design systems (design handoff)

The handoff ships two full visual systems; a theme switch (How Tariga works page, or Founder tools) applies one consistently:
- **Warm "candlelit" (default)** — near-black warm brown, gold/brass, Instrument Serif + Noto Naskh Arabic. All §1/4d–4g screens above.
- **Neon "Ink-Navy Glass" / FUI** — `#070B14` canvas with a fading dot grid, frosted glass (heavy borders banned), always-glowing neon accents, recessed-groove progress bars, Space Grotesk + IBM Plex Sans Arabic, HUD `// SYS_TAG` headers. Unlocks the System-B-only structures: the **3a daily gate** (giant Arabic greeting, indigo→pink gradient Start with a WebGL orb token), the **3b unified stats widget** (animated progress ring + glowing stat rows + 2×2 path grid with the active card lit cyan), **neon road/orbits (2a/2b)** in the amber/teal/emerald/violet/rose palette, **circuit orbits (6c)** with dashed trace tracks and a matrix core, the **HUD telemetry tile (6d)** on then→now (bracketed score, ▲ delta chip, DIALECT FIT / CONNECTORS / FLOW grooves from real metrics), the **orb-as-mic coach (3c/3d/6e)** — breathing WebGL orb as the record button, listening in a countersunk chamber with expanding aura rings and a glass control pod — and the **word-origins FUI (6a/6b)**: a boot state (point-cloud globe, cyan targeting reticle, monospace telemetry with blinking cursor) that resolves into the gridded map viewport with gradient-hairline FEATURED WORD / PHRASES BY REGION cards.

## 8c. AI agents — where autonomy actually belongs (§29)

The product's honest answer to "do you use agents": autonomy lives exactly where it adds value, and is deliberately absent where reliability matters more.

- **The scaffolding gradient ends agentic (§29.3):** Guided → Scenario → Free-form → Phone Call Lite → **Full Phone Call**. The Live call is genuinely agentic per §29.1 — it decides what happens next in character, holds conversational state across turns, and is few-shot grounded on verified transcripts so it never free-invents dialect. It's the natural endpoint of the pedagogy, not a bolted-on agent feature.
- **Pipeline agents already shipped (§29.4):** gap detection (scans coverage, decides what to ask for and surfaces it to contributors and reviewers), AI intake tagging (judgment calls on categorization, human confirms), duplicate detection (searches, compares, asks the human the same/variant/different question).
- **Deliberately NOT agentic (§29.6):** single-turn Guided/Scenario coaching stays deterministic and structured — one prompt, one response, one schema-validated feedback object. Precision beats flexibility in the moment someone needs dependable feedback on exactly what they just said.
- **The tutor agent (§29.5) — browser-local edition, shipped:** "🎓 Your tutor's read" on the Journey page reads this browser's whole attempt history, names the qualitative pattern a progress bar can't see ("code-switches specifically in hospitality moments"), and picks 1–3 targeted scenarios from the verified catalog — resurfacing struggles or skipping ahead on mastery, not bound to tier order. It never invents Arabic; recommendations are validated against the catalog before rendering. Honest limit shown in-app: memory lives in this browser until user accounts (§28.1) exist — the cross-device version is the concrete reason to prioritize that gap.

## 9. The honest backlog (tracks doc §28)

- **Blocking (§28.1): user accounts / persistent identity** — the trust ladder needs to recognize the same real person across sessions; everything is localStorage per-browser today. The demo tools *simulate* tiers; real tiers need a lightweight account layer + the D1 backend. This is the one real engineering gap.
- Native-speaker sign-off needed on: all "pending native review" scenarios (Stage 2/3 batches + quick-added founder content), the live-call transcript quality, scenario 4's reconstructed script, the condolence phrasing, and the ذ/ث/ظ checklist in `docs/PHONETICS-AUDIT.md`.
- **Still open from §28:** re-engagement triggers (notifications/reminders need backend push infrastructure), a monetization product spec (what's free vs. paid — a founder decision before it's an engineering task), pronunciation scoring (needs real native audio to score against).
- No spaced-repetition scheduler yet (warm-up approximates it); no real native audio (reviewer voice notes are the seed); licensed podcast partnerships (§6) are relationship work, not code.

---
*Repo: leeabd123/fictional-palm-tree · static app at index.html · AI proxy + events in worker/ · internal stats at stats.html*
