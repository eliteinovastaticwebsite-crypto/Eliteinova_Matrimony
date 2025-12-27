# Quick Deployment Setup Guide

## ✅ Yes, pushing to `master` branch will trigger deployment!

Both workflows are configured to automatically deploy when you push to:
- `main` branch
- `master` branch

---

## 🔧 Where to Configure Backend URL

### Option 1: GitHub Secrets (Recommended) ⭐

**Location:** GitHub Repository → Settings → Secrets and variables → Actions

**Steps:**
1. Go to your GitHub repository
2. Click **Settings** (top menu)
3. Click **Secrets and variables** → **Actions**
4. Click **New repository secret**

**Add these secrets:**

| Secret Name | Value | How to Get It |
|------------|-------|---------------|
| `BACKEND_URL` | Your backend Cloud Run URL | See below |
| `VITE_API_URL` | Same as BACKEND_URL (optional) | Same as above |

**To get your backend URL:**
```bash
gcloud run services describe matrimony-backend \
  --region us-central1 \
  --format 'value(status.url)'
```

**Or check in GCP Console:**
1. Go to [Cloud Run Console](https://console.cloud.google.com/run)
2. Click on `matrimony-backend` service
3. Copy the URL from the top of the page

**Example URL format:**
```
https://matrimony-backend-xxxxx-uc.a.run.app
```

---

### Option 2: Automatic Detection (Fallback)

If you don't set the secrets, the workflow will:
1. Try to fetch the backend URL from Cloud Run automatically
2. This requires the service account to have Cloud Run permissions

**Note:** It's better to set the secret explicitly for reliability.

---

## 📋 Complete GitHub Secrets Checklist

For **Firebase Hosting** deployment, you need:

| Secret Name | Required | Description |
|------------|----------|-------------|
| `FIREBASE_SERVICE_ACCOUNT` | ✅ Yes | Firebase service account JSON |
| `GCP_PROJECT_ID` | Optional | Defaults to `eliteinova` |
| `FIREBASE_PROJECT_ID` | Optional | Defaults to `eliteinova` |
| `BACKEND_URL` | ✅ Yes | Your backend API URL |
| `VITE_API_URL` | Optional | Same as BACKEND_URL |

For **Cloud Run** deployment, you need:

| Secret Name | Required | Description |
|------------|----------|-------------|
| `GCP_SA_KEY` | ✅ Yes | GCP service account JSON |
| `GCP_PROJECT_ID` | Optional | Defaults to `eliteinova` |
| `GCP_REGION` | Optional | Defaults to `us-central1` |
| `BACKEND_URL` | ✅ Yes | Your backend API URL |
| `VITE_API_URL` | Optional | Same as BACKEND_URL |

---

## 🚀 Deployment Flow

### When you push to `master`:

1. **GitHub Actions triggers** automatically
2. **Workflow runs:**
   - Checks out code
   - Installs dependencies
   - Gets backend URL (from secret or Cloud Run)
   - Builds frontend with backend URL
   - Deploys to Firebase Hosting or Cloud Run
3. **Frontend goes live** at:
   - Firebase: `https://eliteinova.web.app`
   - Cloud Run: (check workflow output for URL)

---

## 🔍 How to Verify Backend URL is Set

### Method 1: Check GitHub Secrets
1. Go to: `https://github.com/YOUR_USERNAME/Eliteinova-matrimony/settings/secrets/actions`
2. Look for `BACKEND_URL` or `VITE_API_URL`

### Method 2: Check Workflow Logs
1. Go to: `https://github.com/YOUR_USERNAME/Eliteinova-matrimony/actions`
2. Click on the latest workflow run
3. Expand "Get Backend URL" step
4. Check the output - it will show which URL is being used

---

## 🎯 Quick Setup Steps

1. **Get your backend URL:**
   ```powershell
   gcloud run services describe matrimony-backend --region us-central1 --format 'value(status.url)'
   ```

2. **Add to GitHub Secrets:**
   - Go to: Repository → Settings → Secrets → Actions
   - Add secret: `BACKEND_URL` = `https://your-backend-url`
   - Add secret: `VITE_API_URL` = `https://your-backend-url` (optional, same value)

3. **Push to master:**
   ```bash
   git add .
   git commit -m "Deploy frontend"
   git push origin master
   ```

4. **Watch deployment:**
   - Go to: Repository → Actions tab
   - See the workflow running in real-time

---

## ⚠️ Important Notes

1. **Backend URL must be HTTPS** - The frontend needs to call your backend API
2. **CORS must be configured** - Your backend needs to allow requests from your frontend domain
3. **First deployment** - Make sure Firebase Hosting is initialized (run `firebase init hosting` if needed)

---

## 🐛 Troubleshooting

### Issue: Deployment fails with "Backend URL not found"

**Solution:**
1. Add `BACKEND_URL` secret in GitHub
2. Make sure the URL is correct (starts with `https://`)
3. Verify the backend service exists and is accessible

### Issue: Frontend can't connect to backend

**Solution:**
1. Check CORS settings in backend
2. Verify backend URL in GitHub secrets
3. Check browser console for CORS errors

### Issue: Workflow doesn't trigger

**Solution:**
1. Make sure you're pushing to `main` or `master` branch
2. Check if workflows are enabled: Settings → Actions → General
3. Verify workflow files are in `.github/workflows/` directory

---

## 📞 Need Help?

1. Check workflow logs in GitHub Actions
2. Verify all secrets are set correctly
3. Ensure backend is deployed and accessible
4. Check `FRONTEND_DEPLOYMENT_GUIDE.md` for detailed instructions

