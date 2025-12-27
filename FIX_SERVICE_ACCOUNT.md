# Fix Service Account - Project Deleted Error

## Error
```
denied: Project #22341588900 has been deleted.
```

## Problem
Your GitHub secret `GCP_SA_KEY` contains a service account JSON that belongs to a **deleted project**. The service account's `project_id` or project number points to a project that no longer exists.

## Solution

### Option 1: Create New Service Account (Recommended)

Run this in Cloud Shell:

```bash
PROJECT_ID="eliteinova" && SERVICE_ACCOUNT_NAME="github-actions-frontend" && SERVICE_ACCOUNT_EMAIL="${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" && gcloud config set project $PROJECT_ID && gcloud iam service-accounts create $SERVICE_ACCOUNT_NAME --display-name="GitHub Actions Frontend" --description="For GitHub Actions deployments" --project=$PROJECT_ID 2>/dev/null; gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" --role="roles/artifactregistry.writer" && gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" --role="roles/run.admin" && gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" --role="roles/iam.serviceAccountUser" && gcloud iam service-accounts keys create github-actions-key.json --iam-account=$SERVICE_ACCOUNT_EMAIL --project=$PROJECT_ID && echo "✅ Created! Key saved to: github-actions-key.json" && echo "Copy the contents and update GitHub secret GCP_SA_KEY"
```

Then:
1. View the key: `cat github-actions-key.json`
2. Copy the entire JSON content
3. Go to GitHub → Settings → Secrets → Actions → `GCP_SA_KEY`
4. Update the secret with the new JSON

### Option 2: Use Existing Service Account

If you have an existing service account in the `eliteinova` project:

1. **List service accounts:**
   ```bash
   gcloud iam service-accounts list --project=eliteinova
   ```

2. **Create a key for existing service account:**
   ```bash
   gcloud iam service-accounts keys create key.json \
     --iam-account=YOUR_SERVICE_ACCOUNT_EMAIL \
     --project=eliteinova
   ```

3. **View and copy the key:**
   ```bash
   cat key.json
   ```

4. **Update GitHub secret** `GCP_SA_KEY` with the new JSON

### Option 3: Use the Backend Service Account

If your backend deployment works, you can use the same service account:

**Service Account:** `run-service-account-ece2de@eliteinova.iam.gserviceaccount.com`

**Create a key for it:**
```bash
gcloud iam service-accounts keys create backend-sa-key.json \
  --iam-account=run-service-account-ece2de@eliteinova.iam.gserviceaccount.com \
  --project=eliteinova
```

Then update GitHub secret `GCP_SA_KEY` with the contents of `backend-sa-key.json`

## Verify Service Account

After updating the secret, verify the service account is in the correct project:

```bash
# Extract project_id from the JSON
# The JSON should have: "project_id": "eliteinova"
# NOT a deleted project number
```

## Required Permissions

The service account needs these roles:
- `roles/artifactregistry.writer` - Push Docker images
- `roles/artifactregistry.reader` - Read Docker images  
- `roles/run.admin` - Deploy to Cloud Run
- `roles/iam.serviceAccountUser` - Use service accounts

## Quick Check

To verify your current service account's project:

1. Go to GitHub → Settings → Secrets → `GCP_SA_KEY`
2. Copy the JSON
3. Look for `"project_id"` - it should be `"eliteinova"`
4. If it's different or points to a deleted project, create a new one

