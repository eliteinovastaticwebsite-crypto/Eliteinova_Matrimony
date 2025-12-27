# Frontend Deployment Guide

This guide covers deploying the Eliteinova Matrimony frontend to production using Firebase Hosting (recommended) or Cloud Run.

## 🚀 Deployment Options

### Option 1: Firebase Hosting (Recommended) ⭐

**Best for:** Static React/Vite applications
**Benefits:**
- ✅ Global CDN for fast content delivery
- ✅ Free SSL certificates
- ✅ Automatic deployments
- ✅ Preview channels for PRs
- ✅ Free tier: 10 GB storage, 360 MB/day transfer
- ✅ Built-in SPA routing support

### Option 2: Cloud Run

**Best for:** When you need container-based deployment
**Benefits:**
- ✅ Serverless scaling
- ✅ Pay per use
- ✅ Custom nginx configuration
- ✅ Same platform as backend

---

## 📋 Prerequisites

1. **Google Cloud Project**: `eliteinova`
2. **Firebase Project**: Linked to your GCP project
3. **GitHub Secrets**: Configured (see below)

---

## 🔧 Setup Instructions

### Step 1: Enable Firebase Hosting

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project (if not already done)
firebase init hosting

# Select:
# - Use existing project: eliteinova
# - Public directory: dist
# - Single-page app: Yes
# - GitHub auto-deploy: Yes (optional)
```

### Step 2: Create Firebase Service Account

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `eliteinova`
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Save the JSON file securely

### Step 3: Configure GitHub Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**

Add the following secrets:

| Secret Name | Description | Example |
|------------|-------------|---------|
| `GCP_PROJECT_ID` | Your GCP project ID | `eliteinova` |
| `GCP_SA_KEY` | GCP Service Account JSON key | `{ "type": "service_account", ... }` |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase Service Account JSON key | `{ "type": "service_account", ... }` |
| `FIREBASE_PROJECT_ID` | Firebase project ID | `eliteinova` |
| `BACKEND_URL` | Backend API URL (optional) | `https://matrimony-backend-xxx-uc.a.run.app` |
| `VITE_API_URL` | Backend API URL for build (optional) | `https://matrimony-backend-xxx-uc.a.run.app` |

**To get your backend URL:**
```bash
gcloud run services describe matrimony-backend \
  --region us-central1 \
  --format 'value(status.url)'
```

### Step 4: Choose Your Deployment Workflow

#### Option A: Firebase Hosting (Recommended)

The workflow file `frontend-deploy-firebase.yml` will:
1. Build your frontend with the correct backend URL
2. Deploy to Firebase Hosting
3. Automatically configure CDN, SSL, and routing

**To use this workflow:**
- It will automatically run on pushes to `main` or `master`
- Or trigger manually via GitHub Actions

**Your frontend will be available at:**
- `https://eliteinova.web.app`
- `https://eliteinova.firebaseapp.com`

#### Option B: Cloud Run

The workflow file `frontend-cd.yml` will:
1. Build your frontend Docker image
2. Push to Google Container Registry
3. Deploy to Cloud Run

**To use this workflow:**
- It will automatically run on pushes to `main` or `master`
- Or trigger manually via GitHub Actions

---

## 🎯 Manual Deployment

### Deploy to Firebase Hosting Manually

```bash
# Install dependencies
npm ci

# Build the frontend
VITE_API_URL=https://your-backend-url npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

### Deploy to Cloud Run Manually

```bash
# Build Docker image
docker build \
  --build-arg VITE_API_URL=https://your-backend-url \
  -t gcr.io/eliteinova/matrimony-frontend:latest \
  -f Dockerfile .

# Push to GCR
gcloud auth configure-docker
docker push gcr.io/eliteinova/matrimony-frontend:latest

# Deploy to Cloud Run
gcloud run deploy matrimony-frontend \
  --image gcr.io/eliteinova/matrimony-frontend:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 80 \
  --memory 256Mi \
  --cpu 1
```

---

## 🔍 Verification

After deployment, verify:

1. **Frontend is accessible:**
   ```bash
   curl https://eliteinova.web.app
   ```

2. **Backend connection:**
   - Open browser DevTools → Network tab
   - Check API calls are going to correct backend URL

3. **SPA Routing:**
   - Navigate to different routes
   - Ensure they work without 404 errors

---

## 🛠️ Troubleshooting

### Issue: Build fails with "VITE_API_URL not found"

**Solution:** Set the backend URL in GitHub secrets:
- `BACKEND_URL` or `VITE_API_URL`

### Issue: Firebase deployment fails with authentication error

**Solution:** 
1. Verify `FIREBASE_SERVICE_ACCOUNT` secret is set correctly
2. Ensure service account has Firebase Hosting Admin role

### Issue: Frontend shows blank page

**Solution:**
1. Check browser console for errors
2. Verify backend URL is correct
3. Check CORS settings on backend
4. Verify `index.html` is being served correctly

### Issue: Routes return 404

**Solution:**
- For Firebase: Check `firebase.json` has proper rewrites
- For Cloud Run: Check `nginx.conf` has SPA routing configured

---

## 📊 Monitoring

### Firebase Hosting

- View deployments: [Firebase Console](https://console.firebase.google.com/project/eliteinova/hosting)
- View analytics: Firebase Console → Analytics
- Check usage: Firebase Console → Usage and billing

### Cloud Run

- View logs: `gcloud run services logs read matrimony-frontend --region us-central1`
- View metrics: GCP Console → Cloud Run → matrimony-frontend

---

## 🔄 Rollback

### Firebase Hosting

```bash
# List deployments
firebase hosting:channel:list

# Rollback to previous version
firebase hosting:rollback
```

Or via Firebase Console → Hosting → View all versions → Rollback

### Cloud Run

```bash
# List revisions
gcloud run revisions list --service matrimony-frontend --region us-central1

# Rollback to previous revision
gcloud run services update-traffic matrimony-frontend \
  --to-revisions REVISION_NAME=100 \
  --region us-central1
```

---

## 🎨 Custom Domain (Optional)

### Firebase Hosting

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Follow DNS configuration instructions
4. SSL certificate is automatically provisioned

### Cloud Run

1. Map custom domain in Cloud Run console
2. Configure DNS records
3. SSL is automatically managed by Google

---

## 📝 Environment Variables

The frontend uses these environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API base URL | Yes |

**Note:** Vite requires `VITE_` prefix for environment variables to be exposed to the client.

---

## ✅ Best Practices

1. **Always set backend URL in secrets** - Don't hardcode API URLs
2. **Use preview channels** - Test deployments before going live
3. **Monitor usage** - Keep an eye on Firebase/Cloud Run quotas
4. **Enable caching** - Static assets are cached for 1 year
5. **Use CDN** - Firebase Hosting provides global CDN automatically

---

## 🆘 Support

For issues:
1. Check GitHub Actions logs
2. Check Firebase/Cloud Run logs
3. Verify all secrets are configured
4. Ensure backend is accessible from frontend domain

