# Fix GCR Permissions Script
# This script grants the necessary permissions to push to Google Container Registry

$PROJECT_ID = "eliteinova"
$REGION = "us-central1"

Write-Host "🔧 Fixing GCR Permissions for project: $PROJECT_ID" -ForegroundColor Cyan
Write-Host ""

# Get service account email from user or GitHub secret
Write-Host "Please provide your service account email:" -ForegroundColor Yellow
Write-Host "  (Check GitHub Secrets → GCP_SA_KEY → client_email field)" -ForegroundColor Gray
$SERVICE_ACCOUNT_EMAIL = Read-Host "Service Account Email"

if ([string]::IsNullOrWhiteSpace($SERVICE_ACCOUNT_EMAIL)) {
    Write-Host "❌ Service account email is required!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Enabling required APIs..." -ForegroundColor Yellow
gcloud services enable containerregistry.googleapis.com --project=$PROJECT_ID
gcloud services enable run.googleapis.com --project=$PROJECT_ID
gcloud services enable cloudbuild.googleapis.com --project=$PROJECT_ID

Write-Host ""
Write-Host "Granting Storage Admin role..." -ForegroundColor Yellow
gcloud projects add-iam-policy-binding $PROJECT_ID `
  --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" `
  --role="roles/storage.admin"

Write-Host ""
Write-Host "Granting Container Registry Service Agent role..." -ForegroundColor Yellow
gcloud projects add-iam-policy-binding $PROJECT_ID `
  --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" `
  --role="roles/containerregistry.ServiceAgent"

Write-Host ""
Write-Host "Granting Cloud Build Service Account role (if using Cloud Build)..." -ForegroundColor Yellow
gcloud projects add-iam-policy-binding $PROJECT_ID `
  --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" `
  --role="roles/cloudbuild.builds.builder"

Write-Host ""
Write-Host "✅ Permissions granted!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Try pushing to GCR again from GitHub Actions" -ForegroundColor White
Write-Host "2. Or test locally: docker push gcr.io/$PROJECT_ID/matrimony-frontend:test" -ForegroundColor White
Write-Host ""
Write-Host "If you still have issues, check FIX_GCR_PERMISSIONS.md for more solutions." -ForegroundColor Gray

