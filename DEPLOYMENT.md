# Deployment Guide

This application has two parts that need to be deployed separately:

1. **Frontend** (HTML/CSS/JavaScript) → GitHub Pages (already set up ✅)
2. **Backend** (Node.js API) → Render.com (needs to be deployed)

## Why Deploy Backend Separately?

GitHub Pages only serves static files - it can't run the Node.js backend that scrapes BLS.gov career data. The backend needs to be deployed to a platform that supports Node.js.

---

## Backend Deployment to Render.com

### Step 1: Create a Render Account

1. Go to https://render.com
2. Sign up for a free account (you can use your GitHub account)

### Step 2: Deploy Your Backend

**Option A: Deploy from GitHub (Recommended)**

1. Go to the [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `Sco314/CareerSkills`
4. Configure the service:
   - **Name**: `career-skills-api` (or any name you prefer)
   - **Environment**: `Node`
   - **Region**: Choose closest to you
   - **Branch**: `main` (or your default branch)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
5. Click **"Create Web Service"**
6. Wait 5-10 minutes for deployment to complete

**Option B: Deploy using Blueprint (render.yaml)**

1. In Render Dashboard, click **"New +"** → **"Blueprint"**
2. Connect your GitHub repository
3. Render will automatically detect the `render.yaml` file
4. Click **"Apply"**

### Step 3: Get Your Backend URL

Once deployed, Render will give you a URL like:
```
https://career-skills-api.onrender.com
```

Copy this URL - you'll need it in the next step.

### Step 4: Update Frontend Configuration

1. Open `script.js` in your code editor
2. Find line 5 (the `API_URL` configuration)
3. Update it with your Render backend URL:

```javascript
// Before:
const API_URL = window.location.origin;

// After:
const API_URL = 'https://career-skills-api.onrender.com'; // Your actual Render URL
```

4. Commit and push this change to GitHub:

```bash
git add script.js
git commit -m "Update API URL to point to Render backend"
git push
```

5. Wait a few minutes for GitHub Pages to redeploy

---

## Testing Your Deployment

1. Visit your GitHub Pages site: `https://sco314.github.io/CareerSkills/`
2. Click **"Add Custom Career"**
3. Try adding a BLS career URL, for example:
   ```
   https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm
   ```
4. If it works, you'll see a success message! 🎉

---

## Important Notes

### Free Tier Limitations

Render's free tier has some limitations:
- **Spin down after 15 minutes of inactivity**: The first request after inactivity may take 30-60 seconds as the server "wakes up"
- **750 hours/month**: Should be plenty for this project

To minimize wait times:
- Consider upgrading to a paid plan ($7/month) for always-on service
- Or add a loading message explaining the delay: "Waking up server (first load may take 60 seconds)..."

### CORS (Cross-Origin Requests)

The backend is already configured to accept requests from any origin:
```javascript
app.use(cors());
```

This is in `server.js` line 12, so your GitHub Pages frontend can communicate with the Render backend without issues.

### Security Considerations

Since this app scrapes public BLS.gov data and doesn't handle sensitive user information:
- No authentication is required
- CORS is wide open (acceptable for this use case)
- No database or persistent storage on the backend

---

## Troubleshooting

### "Unexpected token '<'" Error

This means the frontend is trying to connect to GitHub Pages instead of Render:
- **Fix**: Make sure you updated `script.js` with your Render URL
- **Verify**: Check browser DevTools → Network tab → Look for the `/api/scrape-career` request - it should go to your Render URL, not GitHub Pages

### Backend Returns 503 "Temporarily Unavailable"

This usually means BLS.gov is blocking or rate-limiting requests:
- **Wait**: Try again in a few minutes
- **Check**: Verify the BLS URL is correct and the page still exists

### Render Build Fails

- **Check**: Make sure `package.json` and `package-lock.json` are in the repository
- **Check**: Look at the build logs in Render dashboard for specific errors
- **Verify**: `npm install` works locally

---

## Alternative Deployment Options

If Render doesn't work for you, here are alternatives:

### Railway.app
- Free tier: $5 credit/month
- Similar to Render
- Deploy from GitHub: https://railway.app

### Fly.io
- Free tier available
- More complex setup
- Good for global distribution: https://fly.io

### Heroku
- No longer has a free tier
- $5-7/month minimum
- Very easy to use: https://heroku.com

---

## Need Help?

If you encounter issues:
1. Check the Render deployment logs for errors
2. Check browser DevTools console for frontend errors
3. Verify the API URL in `script.js` matches your Render URL exactly
4. Make sure both services are running (Render backend + GitHub Pages frontend)
