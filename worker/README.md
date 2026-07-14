# Tariga backend — Cloudflare Worker (coach proxy + D1 event log)

This folder is the entire backend. It deploys **separately** from the app:
the frontend stays exactly where it is on GitHub Pages and just `fetch()`es
this Worker. Nothing about the Pages setup changes. Without it, the app
still works in **dev mode** (coach settings → paste your own key, stored
only in your own browser) — but anyone else using the site needs this
Worker deployed.

What the Worker does:

| Endpoint | What it does |
|---|---|
| `POST /api/coach` | Receives the coaching request the frontend already builds (`{system, messages, output_schema}` — the learner's answer, the scenario context, and the verified model answers travel inside `messages`; see `js/core/coach-prompt.js`), attaches the **secret** Anthropic key server-side, enforces the model + a 3000-token cap + a 24-message cap, and returns Claude's structured-JSON comparison to the browser. |
| `POST /api/events` | Anonymized event log → D1. The app batches events (`mode_enter`, `coach_eval` with time-spent / voice-vs-text / retry count / completion, `coach_error`, `speed_round`, …). No PII, no user ids, never the learner's words. |
| `GET /api/stats?key=…` | Founder-only aggregates from D1, guarded by a second secret. `stats.html` in the repo root is a tiny dashboard for it. |
| `GET /api/content` | Hands every visitor the founder's **published content overrides** (scenario/vocab edits, quick-adds, deletions, hide/show lists) from D1. The app pulls this automatically at load. |
| `POST /api/content` | Publishes those overrides. Guarded by the **STATS_KEY** secret — the app's Founder tools → Content manager → "Publish to everyone" button asks for it each time and never stores it. |

Protection on every request: **hard origin allowlist** (403, not just CORS
headers), per-IP rate limit (20 coach calls + 20 event posts per minute per
IP), 50 KB body cap. The in-memory limiter resets when Cloudflare recycles
the isolate — good enough to blunt loops at MVP scale; add a Cloudflare
dashboard rate-limiting rule when there's real traffic.

**The API key never exists in this repo or in any frontend file.** It lives
only as a Cloudflare secret (step 4 below). `wrangler.toml` contains no
secrets — that's why it's safe to commit, and it is committed.

---

## Deploying for the first time, step by step

You need: a free Cloudflare account (https://dash.cloudflare.com/sign-up —
no domain or credit card needed), Node.js on your machine, and your
Anthropic API key (console.anthropic.com → API keys).

Everything below runs **from this `worker/` folder**:

```bash
cd worker
```

### 1 · Log the CLI into your Cloudflare account

```bash
npx wrangler login
```

`npx` downloads Wrangler (Cloudflare's CLI) on first use — nothing to
install globally. A browser tab opens; click **Allow**. Once per machine.

### 2 · Create the D1 database (for event logging)

```bash
npx wrangler d1 create tariga
```

The output ends with a small block like:

```toml
[[d1_databases]]
binding = "DB"
database_name = "tariga"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**Copy that block and paste it at the bottom of `wrangler.toml`** (keep
`binding = "DB"` exactly — that's the name the code looks for). No schema
step: the Worker creates its one `events` table automatically on first
write. Skipping this step entirely is also fine — the coach still works;
events are just accepted and dropped until a database is bound.

### 3 · Set your GitHub Pages origin

In `wrangler.toml`:

```toml
ALLOWED_ORIGINS = "https://YOURUSERNAME.github.io"
```

Scheme + host exactly, no path, no trailing slash. Serving from a custom
domain too? Add it comma-separated. Leaving `""` accepts any origin — fine
while testing alone, not for sharing.

### 4 · Store the secrets (never in files)

```bash
npx wrangler secret put ANTHROPIC_API_KEY
```

It prompts you to paste the key — input goes straight into Cloudflare's
encrypted storage, never into a file. Then the stats-dashboard password
(invent any long random string, keep it somewhere private):

```bash
npx wrangler secret put STATS_KEY
```

### 5 · Deploy

```bash
npx wrangler deploy
```

First run may ask which account to use. The output ends with your live URL:

```
https://tariga-coach.YOURSUBDOMAIN.workers.dev
```

That's your backend address. Re-deploying after any code change is just
`npx wrangler deploy` again — secrets and the database survive re-deploys.

### 6 · Point the app at it

Open the deployed app → **Your coach** → "Connect the coach" → choose the
**Worker** option → paste the URL from step 5 (no trailing slash). That
choice lives in each visitor's localStorage; there is no key anywhere near
the frontend.

### 7 · Verify it's actually protected

```bash
# request shaped like your real site — should return Claude JSON
curl -s https://tariga-coach.YOURSUBDOMAIN.workers.dev/api/coach \
  -X POST -H 'Content-Type: application/json' \
  -H 'Origin: https://YOURUSERNAME.github.io' \
  -d '{"system":"reply with the word ok","messages":[{"role":"user","content":"say ok"}],"output_schema":{"type":"object","properties":{"ok":{"type":"string"}},"required":["ok"]}}'

# request from anywhere else — should print 403
curl -s -o /dev/null -w "%{http_code}\n" \
  https://tariga-coach.YOURSUBDOMAIN.workers.dev/api/coach \
  -X POST -H 'Origin: https://evil.example' -d '{}'
```

### 8 · Publish your content edits to everyone

Anything you change in **Founder tools → Content manager** (edits, quick-adds,
deletions, hide/show) starts as a draft in your own browser. To make it live
for every visitor: Content manager → scroll to **Publish to everyone** → type
your STATS_KEY → **Publish ↑**. Visitors pick it up on their next page load.
Publish from your real site (the origin in ALLOWED_ORIGINS), not from a local
file — the worker's origin gate applies here too.

### 9 · See your usage stats

Open `stats.html` from the repo (opening the file locally is fine), paste
the Worker URL and your STATS_KEY. You get mode popularity, events per day,
and coach completion counts. Don't publish that page with the key filled in.

---

## Costs & limits (MVP reality check)

- Workers free tier: 100k requests/day — far beyond MVP needs.
- D1 free tier: 5M row-writes/month — event logging won't dent it.
- The real cost is the Anthropic API per coaching call: ~1.5k input +
  ~600 output tokens ≈ **$0.02 per evaluation** on the default
  `claude-opus-4-8`. The Worker pins the model server-side (`MODEL` in
  wrangler.toml) and caps tokens, so the client can't request anything
  pricier. Switch `MODEL` to `"claude-sonnet-5"` to cut cost ~40% if needed.
- Set a monthly spend limit at https://console.anthropic.com/settings/limits.

## Handy commands later

```bash
npx wrangler tail                      # live logs while you test
npx wrangler d1 execute tariga --remote \
  --command "SELECT t, COUNT(*) n FROM events GROUP BY t"   # peek at the log
npx wrangler secret put ANTHROPIC_API_KEY   # rotate the key anytime
```
