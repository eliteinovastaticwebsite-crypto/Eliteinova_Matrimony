# ⚠️ URGENT: Update GitHub Secret

## The Problem
Your GitHub secret `GCP_SA_KEY` contains a service account from a **deleted project** (#22341588900).

**You MUST update this secret before deployments will work!**

## Quick Fix (2 Steps)

### Step 1: Get New Service Account Key

Run this in **Google Cloud Shell**:

```bash
PROJECT_ID="eliteinova"
SERVICE_ACCOUNT="run-service-account-ece2de@eliteinova.iam.gserviceaccount.com"

# Create a new key
gcloud iam service-accounts keys create new-key.json \
  --iam-account=$SERVICE_ACCOUNT \
  --project=$PROJECT_ID

# View the key
cat new-key.json
```

**Copy the ENTIRE JSON output** (everything from `{` to `}`)

### Step 2: Update GitHub Secret

1. Go to your GitHub repository
2. Click **Settings** (top menu)
3. Click **Secrets and variables** → **Actions**
4. Find **`GCP_SA_KEY`** in the list
5. Click **Update** (pencil icon)
6. **Delete the old JSON**
7. **Paste the new JSON** from Step 1
8. Click **Update secret**

## Verify It's Correct

After updating, the JSON should contain:
- `"project_id": "eliteinova"` ✅
- `"client_email": "...@eliteinova.iam.gserviceaccount.com"` ✅

**NOT:**
- `"project_id": "22341588900"` ❌
- Any project number that's been deleted ❌

## Test After Update

After updating the secret:
1. Go to **Actions** tab in GitHub
2. Re-run the failed workflow
3. It should work now!

## Alternative: Create New Service Account

If you want a separate service account for frontend:

```bash
PROJECT_ID="eliteinova"
SERVICE_ACCOUNT_NAME="github-actions-frontend"

# Create service account
gcloud iam service-accounts create $SERVICE_ACCOUNT_NAME \
  --display-name="GitHub Actions Frontend" \
  --project=$PROJECT_ID

SERVICE_ACCOUNT_EMAIL="${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

# Grant permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
  --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
  --role="roles/iam.serviceAccountUser"

# Create key
gcloud iam service-accounts keys create frontend-key.json \
  --iam-account=$SERVICE_ACCOUNT_EMAIL \
  --project=$PROJECT_ID

# View key
cat frontend-key.json
```

Then update GitHub secret `GCP_SA_KEY` with the contents of `frontend-key.json`

