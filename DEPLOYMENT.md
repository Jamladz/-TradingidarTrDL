# Gold Signals - Cloudflare Deployment Guide

This application is built with React + Vite and is ready to be deployed on **Cloudflare Pages**.

## Prerequisites
- A Cloudflare account.
- The `firebase-applet-config.json` file (already in the project).

## Deployment Options

### Option 1: Cloudflare Pages (GitHub Integration - Recommended)
1. Push your code to a GitHub/GitLab repository.
2. Go to the Cloudflare Dashboard > **Workers & Pages**.
3. Click **Create application** > **Pages** > **Connect to Git**.
4. Select your repository.
5. In **Build settings**, choose the **Vite** preset:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
6. Click **Save and Deploy**.

### Option 2: Wrangler CLI (Manual Upload)
If you have the Cloudflare Wrangler CLI installed:
1. Install dependencies: `npm install`
2. Build the project: `npm run build`
3. Deploy: `npx wrangler pages deploy dist`

## Backend & API (Optional)
If you want to add server-side logic (like validating Telegram data):
1. Create a `functions/api` directory.
2. Add your Worker code there. Cloudflare Pages will automatically detect and deploy them as Functions.

## Troubleshooting

### "Unknown lockfile version" Error
If you see an error related to `bun.lock` or `Unknown lockfile version`:
1. I have removed the `bun.lock` file from the project to avoid version conflicts on Cloudflare.
2. Cloudflare will now default to `npm install`.
3. In the Cloudflare Pages dashboard, ensure the **Build command** is set to `npm run build`.

### Environment Variables
If you move your Firebase config to environment variables:
1. Go to **Settings** > **Variables and Secrets** in the Pages dashboard.
2. Add your `VITE_FIREBASE_*` variables.
3. Update `src/firebase.ts` to use `import.meta.env`.
