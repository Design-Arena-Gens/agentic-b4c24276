# Daily Animal Mayhem Automation

Autonomous Next.js workflow that generates surreal animal adventure videos, stitches narration and visuals into a finished clip, and uploads straight to YouTube every day at **9:00 PM IST** using a Vercel cron job.

## Features
- AI-written storyline + scene breakdown (OpenAI `gpt-4o-mini`)
- Neural voiceover synthesis (OpenAI `gpt-4o-mini-tts`)
- Scene artwork via OpenAI Images (`gpt-image-1`)
- Automated video assembly with `ffmpeg-static`
- YouTube upload + metadata publishing via YouTube Data API
- Manual trigger dashboard with recent channel uploads
- Vercel cron schedule (`30 15 * * *` UTC → 9:00 PM IST)

## Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` for the dashboard.

## Required Secrets

Create a `.env.local` (or configure in Vercel):

```
OPENAI_API_KEY=
YOUTUBE_CLIENT_ID=
YOUTUBE_CLIENT_SECRET=
YOUTUBE_REFRESH_TOKEN=
YOUTUBE_CHANNEL_ID=
VIDEO_PROMPT_TONE=chaotic and humorous
CRON_SECRET=super-secret-token
```

### Google API Setup
1. Create a Google Cloud project with YouTube Data API v3 enabled.
2. Configure an OAuth consent screen (Internal or External).
3. Generate OAuth credentials and obtain a **refresh token** with the following scopes:
   - `https://www.googleapis.com/auth/youtube.upload`
   - `https://www.googleapis.com/auth/youtube.readonly`
4. Store the refresh token alongside the client ID/secret.

## Manual Generation

To run the full pipeline locally without waiting for cron:

```bash
npm run generate
```

The command executes `scripts/run-once.ts` which shares the same automation logic used by cron and the dashboard button.

## Deployment

1. `npm run build` to ensure the bundle compiles.
2. Deploy to Vercel (project name `agentic-b4c24276`):
   ```bash
   vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-b4c24276
   ```
3. Cron is defined in `vercel.json` and triggers `/api/run-daily` daily at 15:30 UTC (9 PM IST).

Once deployed, automated runs and the dashboard manual trigger will send the finished video to YouTube.
