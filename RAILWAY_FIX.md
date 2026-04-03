# Railway Deployment - Quick Setup

## ✅ What Just Happened

You pushed to GitHub and Railway attempted to auto-deploy. It failed because Railway didn't know which folder to deploy (backend or frontend - it's a monorepo).

## 🚀 Fix & Re-deploy in 2 Minutes

### Step 1: Configure Railway Project
1. Open https://railway.app/dashboard
2. Select your `bias-audit-platform` project
3. Go to **Settings** tab
4. Look for **Environment** section
5. Set these variables:
   ```
   GEMINI_API_KEY = your_actual_api_key_here
   NODE_ENV = production
   PORT = 8080
   ```

### Step 2: Trigger Re-deployment
In Railway dashboard:
1. Click the **Deployments** tab
2. Click the **Deploy** button (top right)
3. OR simply: Push to GitHub and Railway auto-re-deploys

That's it! Railway will now:
- ✅ Install backend dependencies
- ✅ Start Node.js server
- ✅ Detect `GEMINI_API_KEY` from environment

## 🔍 Verify Deployment

Wait 1-2 minutes, then check:

**Health Check**:
```bash
curl https://YOUR-RAILWAY-PROJECT-ID.up.railway.app/api/health
```

Expected response:
```json
{"status":"Backend is running!"}
```

**API Test**:
```bash
curl -X POST https://YOUR-RAILWAY-PROJECT-ID.up.railway.app/api/bias/analyze \
  -H "Content-Type: application/json" \
  -d '{"text":"We need an aggressive salesman","contentType":"job-posting"}'
```

## 🎯 If Still Failing

### Check Railway Logs
1. In Railway dashboard, go to **Logs** tab
2. Look for `npm install` output
3. Look for server start message

### Common Issues

**"Cannot find module"**
→ Railways didn't install dependencies properly
→ Solution: In Railway settings, set `build` command to `npm install --prefix backend`

**"Port already in use"**
→ Set `PORT=8080` in Railway environment variables

**"GEMINI_API_KEY undefined"**
→ Make sure you added the secret in Railway settings
→ Restart the deployment

## 📌 Your Backend URL

After successful deployment, Railway gives you a URL like:
```
https://bias-audit-platform-prod.up.railway.app
```

Add this to your **Vercel Frontend** settings as:
```
VITE_API_URL = https://bias-audit-platform-prod.up.railway.app
```

Then redeploy frontend on Vercel (auto-trigger by pushing to GitHub).

## ✅ Checklist

- [ ] Railway project connected to GitHub
- [ ] `GEMINI_API_KEY` added to Railway secrets
- [ ] Deployment shows "Success" (not "Failed")
- [ ] Health check passes: `/api/health` returns good response
- [ ] Backend URL copied
- [ ] Vercel frontend configured with backend URL
- [ ] Vercel frontend re-deployed

**Once all ✅, your app is live!** 🎉
