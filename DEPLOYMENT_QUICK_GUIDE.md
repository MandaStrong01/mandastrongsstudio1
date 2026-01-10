# Quick Deployment Guide

## Choose Your Platform

### 1. Bolt.new (Current - Already Deployed)
**Best for:** Development, testing, quick sharing
**Status:** ✅ Already live
**Action:** None needed - your app is already deployed
**URL:** Your current Bolt.new URL

---

### 2. Google Cloud Platform (Recommended for Production)
**Best for:** Production apps, custom domains, enterprise use
**Cost:** Free tier available, then ~$5-20/month
**Time to deploy:** 15 minutes

**Quick Start:**
```bash
# Install CLI
brew install google-cloud-sdk  # macOS
# or visit: https://cloud.google.com/sdk/docs/install

# Login & setup
gcloud init
gcloud auth login

# Create project
gcloud projects create mandastrong-studio
gcloud config set project mandastrong-studio

# Build & deploy
npm run build
gcloud storage buckets create gs://mandastrong-studio --location=US
gcloud storage cp -r dist/* gs://mandastrong-studio
```

**Your URL:** `https://storage.googleapis.com/mandastrong-studio/index.html`

---

### 3. Google Play Store (Android App)
**Best for:** Mobile users, app store presence
**Cost:** $25 one-time developer fee
**Time to deploy:** 2-4 hours (including review)

**Quick Start:**
```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init

# Build Android
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

Then upload to: https://play.google.com/console

---

### 4. Netlify (Simple Alternative)
**Best for:** Quick production deployment, free hosting
**Cost:** Free tier, then $19/month
**Time to deploy:** 5 minutes

**Quick Start:**
```bash
npm install -g netlify-cli
netlify login
npm run build
netlify deploy --prod --dir=dist
```

---

### 5. Vercel (Fastest Alternative)
**Best for:** Instant deployment, automatic SSL
**Cost:** Free tier, then $20/month
**Time to deploy:** 2 minutes

**Quick Start:**
```bash
npm install -g vercel
vercel --prod
```

---

## Environment Variables (Required for All)

Don't forget to set these after deploying:
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Deployment Comparison

| Platform | Speed | Cost | Difficulty | Custom Domain | SSL |
|----------|-------|------|------------|---------------|-----|
| Bolt.new | ⚡⚡⚡ | Free | Easy | ❌ | ✅ |
| GCP Storage | ⚡⚡ | $5-20/mo | Medium | ✅ | ✅ |
| GCP Cloud Run | ⚡⚡ | $10-30/mo | Medium | ✅ | ✅ |
| Google Play | ⚡ | $25 once | Hard | N/A | N/A |
| Netlify | ⚡⚡⚡ | Free | Easy | ✅ | ✅ |
| Vercel | ⚡⚡⚡ | Free | Easy | ✅ | ✅ |

---

## Recommendation

**For testing/demos:** Keep using Bolt.new
**For production web:** Use Netlify or Vercel (easiest) or Google Cloud (most control)
**For mobile app:** Convert to PWA → Upload to Google Play

---

## Need Help?

See detailed instructions in **HOW_TO_USE.md** (Deployment & Publishing Guide section)
