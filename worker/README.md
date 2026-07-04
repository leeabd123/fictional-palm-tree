# Tariga coach proxy (Cloudflare Worker)

This tiny Worker is the only backend the app needs. It holds your Anthropic
API key as a secret and forwards coaching requests from the static site to
the Claude API. Without it, the app still works in **dev mode** (Settings →
paste your own key, stored only in your browser) — but anyone else using the
site needs this Worker deployed.

## Deploy (~10 minutes, free tier)

1. Create a free Cloudflare account at https://dash.cloudflare.com/sign-up
   (no domain or credit card needed).

2. From this `worker/` directory, run:

   ```bash
   npx wrangler login          # opens browser, authorize once
   npx wrangler deploy         # deploys tariga-coach
   npx wrangler secret put ANTHROPIC_API_KEY   # paste your key when prompted
   ```

3. `wrangler deploy` prints your Worker URL, something like:

   ```
   https://tariga-coach.YOURSUBDOMAIN.workers.dev
   ```

4. In the app: open **Speak & Respond → coach settings** and paste that URL
   (without a trailing slash). Done — every visitor's coaching requests now
   go through your Worker and your key never leaves Cloudflare.

## Before sharing publicly

- Lock CORS to your site: edit `wrangler.toml` →
  `ALLOWED_ORIGINS = "https://YOURUSERNAME.github.io"` and redeploy.
  (Note: CORS stops browsers, not curl — the built-in per-minute rate limit
  and the enforced model/token caps bound the damage from abuse. For launch
  scale, add a Cloudflare rate-limiting rule on the dashboard.)
- Watch usage at https://console.anthropic.com/settings/usage and set a
  monthly spend limit there.

## Cost ballpark

Each coaching evaluation sends ~1.5k input tokens and returns ~600 output
tokens. On the default `claude-opus-4-8` ($5/$25 per MTok) that's roughly
**$0.02 per evaluation** — about $2 for a 10-tester week of heavy use.
Switch `MODEL` to `claude-sonnet-5` in `wrangler.toml` to cut that ~40%
if needed.
