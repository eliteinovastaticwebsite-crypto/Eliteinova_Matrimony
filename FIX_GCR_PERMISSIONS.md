# Fix GCR (Google Container Registry) Permissions

## Error
```
denied: gcr.io repo does not exist. Creating on push requires the artifactregistry.repositories.createOnPush permission
```

## Solution Options

### Option 1: Grant Service Account Permissions (Recommended)

The service account used in GitHub Actions needs permission to push to GCR.

**Steps:**

1. **Get your service account email from GitHub Secrets:**
   - Go to: GitHub → Settings → Secrets → `GCP_SA_KEY`
   - Decode the JSON and find the `client_email` field
   - Or check which service account you're using

2. **Grant Storage Admin role to service account:**
   ```bash
   # Replace run-service-account-ece2de@eliteinova.iam.gserviceaccount.com with your actual service account email
   gcloud projects add-iam-policy-binding eliteinova \
     --member="serviceAccount:run-service-account-ece2de@eliteinova.iam.gserviceaccount.com" \
     --role="roles/storage.admin"
   ```

3. **Grant Container Registry Service Agent role:**
   ```bash
   gcloud projects add-iam-policy-binding eliteinova \
     --member="serviceAccount:run-service-account-ece2de@eliteinova.iam.gserviceaccount.com" \
     --role="roles/containerregistry.ServiceAgent"
   ```

### Option 2: Enable GCR API and Create Repository Manually

1. **Enable Container Registry API:**
   ```bash
   gcloud services enable containerregistry.googleapis.com
   ```

2. **Create the repository by pushing a dummy image first:**
   ```bash
   # This will create the repository automatically
   docker pull hello-world
   docker tag hello-world gcr.io/eliteinova/matrimony-frontend:test
   docker push gcr.io/eliteinova/matrimony-frontend:test
   ```

### Option 3: Use Artifact Registry (Modern Alternative)

Artifact Registry is Google's newer container registry service. Update the workflow to use it:

**Update workflow to use Artifact Registry:**

1. **Create Artifact Registry repository:**
   ```bash
   gcloud artifacts repositories create matrimony-repo \
     --repository-format=docker \
     --location=us-central1 \
     --description="Docker repository for matrimony app"
   ```

2. **Update workflow image paths:**
   - Change from: `gcr.io/eliteinova/matrimony-frontend`
   - Change to: `us-central1-docker.pkg.dev/eliteinova/matrimony-repo/matrimony-frontend`

3. **Update Docker auth:**
   ```yaml
   - name: Configure Docker for Artifact Registry
     run: gcloud auth configure-docker us-central1-docker.pkg.dev
   ```

## Quick Fix Script

Run this PowerShell script to fix permissions:

```powershell
# Get service account email from your GCP_SA_KEY secret
# Or set it manually:
run-service-account-ece2de@eliteinova.iam.gserviceaccount.com = "your-service-account@eliteinova.iam.gserviceaccount.com"
eliteinova = "eliteinova"

# Enable APIs
gcloud services enable containerregistry.googleapis.com --project=eliteinova
gcloud services enable run.googleapis.com --project=eliteinova
gcloud services enable cloudbuild.googleapis.com --project=eliteinova

# Grant permissions
gcloud projects add-iam-policy-binding eliteinova `
  --member="serviceAccount:run-service-account-ece2de@eliteinova.iam.gserviceaccount.com" `
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding eliteinova `
  --member="serviceAccount:run-service-account-ece2de@eliteinova.iam.gserviceaccount.com" `
  --role="roles/containerregistry.ServiceAgent"

Write-Host "Permissions granted! Try pushing again."
```

## Verify Setup

After fixing permissions, verify:

```bash
# Check if you can access GCR
gcloud auth configure-docker gcr.io

# Test push (optional)
docker pull hello-world
docker tag hello-world gcr.io/eliteinova/matrimony-frontend:test
docker push gcr.io/eliteinova/matrimony-frontend:test
```

## Common Service Account Emails

If you're not sure which service account to use, check:

1. **GitHub Actions service account:**
   - Check `GCP_SA_KEY` secret in GitHub
   - Look for `client_email` in the JSON

2. **Cloud Build service account:**
   - Format: `PROJECT_NUMBER@cloudbuild.gserviceaccount.com`
   - Check: `gcloud projects describe eliteinova --format="value(projectNumber)"`

3. **Compute Engine default:**
   - Format: `PROJECT_NUMBER-compute@developer.gserviceaccount.com`

## Still Having Issues?

1. **Check service account has correct permissions:**
   ```bash
   gcloud projects get-iam-policy eliteinova \
     --flatten="bindings[].members" \
     --filter="bindings.members:run-service-account-ece2de@eliteinova.iam.gserviceaccount.com"
   ```

2. **Verify GCR API is enabled:**
   ```bash
   gcloud services list --enabled --project=eliteinova | grep containerregistry
   ```

3. **Check if billing is enabled:**
   - GCR requires billing to be enabled on the project

4. **Try creating repository manually first:**
   ```bash
   # This forces repository creation
   gsutil mb -p eliteinova -c STANDARD -l us gs://artifacts.eliteinova.appspot.com
   ```

