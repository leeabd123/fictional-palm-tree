# Tariga Code Tour — the founder's guide to your own codebase

Written for you, the founder, not for engineers. Read it next to the code.
Goal: in two weeks you can open any file, know why it exists, and make
small changes yourself.

---

## 1 · The one idea that explains the whole app

There is no framework — no React, no build step. The entire app is:

1. `index.html` loads ~40 small `.js` files, in order, as plain scripts.
   Every function they define is global (visible to every other file).
2. There is ONE div that matters: `<div id="content-area">`. Every screen
   you've ever seen in Tariga is just that div's HTML being replaced.
3. The loop that runs everything:

```
you tap something
  → the button's onclick calls a global function   (e.g. setMode('flash'))
  → that function changes some variables            (state)
  → then calls a render function                    (e.g. renderFlash())
  → which builds one big HTML string and does:
        document.getElementById('content-area').innerHTML = thatString
  → the new HTML has its own onclick="..." attributes
  → repeat forever
```

That's it. That is the entire architecture. When you understand this loop,
you understand Tariga. Everything else is details of *which* variables and
*which* HTML string.

**"State" = plain global variables + localStorage.** Variables (like
`coachIdx`, `treeView`) live in memory and reset on refresh. Anything that
must survive a refresh is saved to `localStorage` — a tiny key→string store
inside each visitor's own browser. This is why there are no accounts yet:
each browser IS the account.

The localStorage keys that matter (open DevTools → Application →
Local Storage to see yours):

| key | what it holds |
|---|---|
| `tariga_guided_v1` | which guided scenarios you've practiced |
| `tariga_attempts_v1` | every coach attempt: your text + metrics (fuels then→now) |
| `tariga_starred_v1` / `_words_` / `_sents_` | your stars |
| `tariga_profile_v1` | name, comfort level, region, focus domain |
| `tariga_api_config_v1` | how the coach connects (your Worker URL) |
| `tariga_contributions_v1` | community submissions + their review status |
| `tariga_reviewer_v1` / `tariga_vouches_v1` | reviewer trust record |
| `tariga_theme_v1` / `tariga_a11y_v1` | warm/neon, larger text |
| `tariga_admin_v1` | founder demo mode on/off |
| `tariga_gate_day_v1` | which day last saw the daily gate |
| `tariga_events_v1` | queued analytics events awaiting flush |
| `tariga_content_v1` | your content-manager edits (overrides) |

## 2 · The folder map

```
index.html            the shell: sidebar, tab bar, content-area, script list
css/                  looks. design-port.css = warm system, neon.css = neon system
js/data/              CONTENT — the part that is genuinely yours
js/core/              plumbing shared by every screen
js/modes/             one file per screen
js/components/        the three WebGL toys: orb.js, sudan-map.js, globe.js
js/app.js             boot: wires it together, decides gate vs dashboard
worker/               the entire backend (Cloudflare Worker + D1)
stats.html            founder dashboard reading the Worker's event log
FEATURES.md           the product brief (what exists, honestly)
docs/                 this file + the phonetics audit checklist
```

## 3 · The five files that ARE the product

If you only ever deeply learn five files, learn these:

### ① `js/data/curriculum.js` — your content (the moat)
`DOMAINS` (the five life areas), `GUIDED_SCENARIOS` (every practice moment:
Arabic target, phonetics, required words, register note, `source` and
`verification_status` — the honesty labels), `CALL_SEQUENCES` (the
pre-written phone calls), and `domainTier()` (the rule that unlocks
Comfortable content once ~80% of a domain's Beginning items are practiced).
**You should be able to add a scenario here by hand** — copy an existing
block, change the fields. This file is the one investors are really asking
about when they ask "where does your data come from".

### ② `js/core/produce.js` — the comparison mechanic
~70 lines. `prodMatch(input, targetAr, targetPh)` answers one question: of
the target phrase's words, which did the learner say — accepting Arabic
script OR Arabizi transliteration, case-insensitive, punctuation ignored?
Flashcards practice, Guided mode, dictogloss, and speed rounds ALL run on
this one function. One engine, many skins — that's why behavior feels
consistent everywhere.

### ③ `js/core/coach-prompt.js` — the AI's brain
The system prompts and JSON schemas for every AI call. `COACH_SYSTEM` is
the pedagogy in prose: compare-never-judge, upgrade the learner's OWN
answer as the primary output, flag MSA/English-shaped phrasing, note missed
transition words and chunks. `COACH_SCHEMA` forces Claude to answer in an
exact JSON shape so the UI can render it reliably. If coaching feedback
ever feels off, this file is where you tune it — it's English, not code.

### ④ `js/modes/speak-respond.js` — the flagship screen
The biggest mode file. Phases: `prompt` (question + vocab chips + mic/text)
→ `voice` (the listening orb) → `thinking` → `feedback` (the comparison) →
`journey` (before/after). `coachSubmit()` is the heart: builds the request
(③), sends it through `coachEvaluate` (see ⑤'s client side in
`js/core/api.js`), stores the attempt in localStorage, logs an event.

### ⑤ `worker/worker.js` — the backend (money + security)
One file, three endpoints. `/api/coach`: takes the request the frontend
built, attaches your SECRET Anthropic key (which exists only inside
Cloudflare), pins the model and token cap, forwards to Claude, returns the
JSON. Plus a hard origin allowlist (strangers get 403), per-IP rate limits,
size caps. `/api/events`: writes anonymized usage rows into D1 (a tiny SQL
database). `/api/stats`: founder-only aggregates for stats.html.

## 4 · How a screen file is put together (read one, you've read them all)

Open `js/modes/about.js` — the smallest real screen (~100 lines):

- Top: a comment saying what the screen is for (every file has one — read
  these first, they're written for you).
- Some data (`ABOUT_POINTS` — an array of objects).
- One `renderAbout()` function that:
  - grabs `content-area`,
  - sets `.innerHTML =` one template literal (the backtick string — anything
    inside `${...}` is JavaScript that gets pasted into the HTML),
  - buttons inside carry `onclick="someGlobalFunction()"`.

Every mode follows this shape. Bigger ones just have more little state
variables and more helper functions that return HTML fragments.

**How a screen gets on screen:** `js/core/navigation.js` has `setMode(name)`
(highlights the nav, resets per-mode state, shows a first-time intro) and
`render()` — a plain list of `if (mode === 'x') { renderX(); return; }`.
Adding a screen = write `renderX()`, add one line to that list, add a
button somewhere. `js/app.js` wraps `setMode` to sync the tab bar and log
an analytics event, then boots: `setMode('home')` (which itself decides
gate vs dashboard by date), intro overlay if first ever visit, `#admin`
check.

## 5 · The rest of js/core, one line each

- `state.js` — the original deck/source globals + `getSrc()` (which vocab
  deck is active) + `shuf()` (shuffle).
- `api.js` — the coach transport: Worker mode (production) or paste-your-
  own-key dev mode; 60s timeout; one automatic retry on flaky network.
- `config.js` — `TARIGA_CONFIG`: thresholds and copy as data (unlock share,
  review vote weights, speed-round seconds). Tuning knobs, no logic.
- `progress.js` — stores coach attempts; `naturalScore()` turns an
  attempt's metrics into the 0–100 "natural" number.
- `events.js` — queues anonymized analytics locally, flushes batches to the
  Worker. Never blocks the app.
- `produce.js` — see ③.
- `coach-prompt.js` — see ②... no, ③'s sibling: all prompts incl. free-form,
  live-call grounding, tag suggestions, and the tutor.
- `theme.js` — warm/neon switch (`body.neon` class + localStorage).
- `admin.js` / `admin-content.js` — founder tools: demo unlock/simulators,
  and the content manager (edits stored as localStorage overrides).
- `wordstar.js` — press-and-hold any Arabic word → lookup/star popup;
  "My starred" flashcard deck.
- `tutor.js` — the "tutor's read" panel: sends your local history + the
  scenario catalog to Claude, gets targeted recommendations back.
- `intro.js` — the first-run السلام عليكم overlay.
- `activity.js` — practice-day streaks. `results.js`, `ui-shell.js`,
  `mode-intros.js` — small leftovers from the original prototype.

## 6 · The screens (js/modes), grouped by importance

**Learn these well** (they're your demo):
- `home.js` — daily gate (first open of the day) + dashboard (after).
- `speak-respond.js` — the coach (see ④).
- `guided.js` — highest-scaffold practice + the scenario browser + Call
  Lite (`callOpen` walks a CALL_SEQUENCE turn by turn on the same compare
  engine).
- `domainmap.js` — the merged Domain Map × Journey: four views (road/tree/
  orbits/list) + the then→now detail screen. Longest file; read ONE view
  (`dmListHTML`) and trust that the others repeat the pattern with
  different geometry.
- `flashcards.js` — the 3D deck + word/sentence practice panel.

**Know what they do** (skim the top comments):
- `journey.js` (now just points at the domain map) · `warmup.js` (returning-
  user review) · `freeform.js` · `livecall.js` (dynamic habooba, grounded on
  verified transcripts) · `speed.js` · `listen.js` (meaning quiz + dictogloss)
  · `map.js` (word origins: globe boot → region map) · `about.js` ·
  `contribute.js` + `review.js` (the community pipeline: submit → similar-
  check → weighted votes → live → feeds the map).

**Legacy prototype modes** (fine to ignore): quiz, deep-quiz, shadowing,
sentence-builder, flow-translation, transitions, vocab-lists, reference,
conversation, deep-cards, starred.

## 7 · How to poke at it (your debugging superpowers)

Open your site → F12 (DevTools) → **Console**. Because everything is
global, you can drive the whole app by typing:

```js
setMode('flash')                     // jump anywhere
GUIDED_SCENARIOS.length              // inspect your content
prodMatch('saraha tamam', 'صراحة أنا تمام', 'saraha ana tamam')  // test the engine
domainTier('family')                 // check unlock logic
localStorage.getItem('tariga_profile_v1')   // peek at stored state
adminSet(true)                       // demo mode from the console
```

**Follow-a-click exercise** (do this often): see a button → right-click →
Inspect → read its `onclick="..."` name → press Ctrl/Cmd-Shift-F in DevTools
→ search that name → you land on the function → read what variables it
changes and which render it calls. That trail is the answer to "what
happens when I tap this" for every single button in the app.

And ask Claude. Paste any function and say "explain line by line" —
that's the fastest tutor you have.

## 8 · Three safe first changes (do these, feel the loop)

1. **Change copy**: in `home.js`, find `homeGreeting()` and edit an English
   greeting string. Refresh. That's the loop.
2. **Add a scenario**: in `curriculum.js`, copy a `GUIDED_SCENARIOS` block,
   change id/title/target, mark `verification_status: 'pending-review'`.
   It appears in Guided, the browser, the domain map, everywhere — because
   every screen reads the same array.
3. **Change a color**: in `design-port.css` or `base.css` `:root`, tweak
   `--accent2`. Watch gold shift across the app — that's the token system.

Commit each with git so you can always undo:
`git add -A && git commit -m "my change"` (and `git revert HEAD` to undo).
