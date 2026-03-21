# Iran MUN Research — Live Website
## Setup Guide (10–15 minutes, no coding required)

---

### What this does
- Live Iran MUN research page with the same layout you already have
- Auto-fetches latest Iran news every 24 hours across 4 categories
- AI briefing button that generates an up-to-date intelligence analysis for your team
- Search bar, full ECOSOC section, MUN toolkit
- Password-protected update button so only your team can trigger AI updates

---

## STEP 1 — Get your two API keys (free)

### NewsAPI key (for live news)
1. Go to https://newsapi.org
2. Click "Get API Key"
3. Sign up with your email (free plan)
4. Copy your API key — looks like: `a1b2c3d4e5f6...`

### Anthropic API key (for AI briefings)
1. Go to https://console.anthropic.com
2. Sign in or create an account
3. Click "API Keys" in the left menu
4. Click "Create Key" — copy it immediately, it won't show again
5. Looks like: `sk-ant-api03-...`
   Note: You will need to add a small amount of credit (~$5) to use the API.
   Each AI briefing costs less than $0.01.

---

## STEP 2 — Upload code to GitHub

1. Go to https://github.com and sign in
2. Click the **+** button (top right) → **New repository**
3. Name it: `iran-mun-research`
4. Set to **Private** (so only your team sees it)
5. Click **Create repository**
6. On the next page, click **uploading an existing file**
7. Drag and drop ALL the files from the zip you downloaded:
   ```
   pages/
     _app.js
     index.js
     api/
       news.js
       update.js
   styles/
     globals.css
   package.json
   next.config.js
   .gitignore
   .env.example
   ```
8. Click **Commit changes**

---

## STEP 3 — Deploy on Vercel

1. Go to https://vercel.com and sign in
2. Click **Add New Project**
3. Click **Import** next to your `iran-mun-research` repo
4. Vercel will auto-detect it as a Next.js project — leave all settings as default
5. Before clicking Deploy, click **Environment Variables**
6. Add these three variables:

   | Name | Value |
   |------|-------|
   | `NEWS_API_KEY` | your NewsAPI key |
   | `ANTHROPIC_API_KEY` | your Anthropic key |
   | `UPDATE_PASSWORD` | a password for your team (e.g. `ecosoc2026`) |

7. Click **Deploy**
8. Wait ~60 seconds — Vercel will give you a live URL like `iran-mun-research.vercel.app`

---

## STEP 4 — Share with your team

- Share the Vercel URL with your team
- Share the `UPDATE_PASSWORD` you set — they need it to generate AI briefings
- The page auto-refreshes news every 24 hours
- Any team member can click "Generate AI Briefing" using the password

---

## Updating the site later

If you want to update the content (add new sections, change research):
1. Edit the files in your GitHub repo (click the file → pencil icon to edit)
2. Click **Commit changes**
3. Vercel automatically rebuilds and redeploys within ~30 seconds

---

## Troubleshooting

**News not loading?**
- Check that `NEWS_API_KEY` is set correctly in Vercel Environment Variables
- Note: NewsAPI free plan only allows requests from a server (not localhost) — it will work fine on Vercel

**AI briefing failing?**
- Check that `ANTHROPIC_API_KEY` is set correctly
- Make sure you have credit on your Anthropic account (minimum $5)
- Check the password matches `UPDATE_PASSWORD` in Vercel

**Need to change the team password?**
- Go to Vercel → your project → Settings → Environment Variables
- Update `UPDATE_PASSWORD`
- Redeploy

---

Built for educational MUN use. March 2026.
