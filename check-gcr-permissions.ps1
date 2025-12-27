# Quick Check: Verify GCR Permissions
# This checks if your service account already has the necessary permissions

$PROJECT_ID = "eliteinova"
$SERVICE_ACCOUNT_EMAIL = "run-service-account-ece2de@eliteinova.iam.gserviceaccount.com"

Write-Host "Checking GCR permissions for: $SERVICE_ACCOUNT_EMAIL" -ForegroundColor Cyan
Write-Host ""

# Check current IAM policy
Write-Host "Checking current permissions..." -ForegroundColor Yellow
$permissions = gcloud projects get-iam-policy $PROJECT_ID `
  --flatten="bindings[].members" `
  --filter="bindings.members:serviceAccount:$SERVICE_ACCOUNT_EMAIL" `
  --format="value(bindings.role)" 2>$null

if ($permissions) {
    Write-Host "Current roles for this service account:" -ForegroundColor Green
    $permissions | ForEach-Object { Write-Host "  - $_" -ForegroundColor White }
    Write-Host ""
    
    $hasStorageAdmin = $permissions -contains "roles/storage.admin"
    $hasContainerRegistry = $permissions -contains "roles/containerregistry.ServiceAgent"
    
    if ($hasStorageAdmin -and $hasContainerRegistry) {
        Write-Host "✅ Permissions are already granted!" -ForegroundColor Green
        Write-Host ""
        Write-Host "The issue might be:" -ForegroundColor Yellow
        Write-Host "  1. GCR repository doesn't exist yet (first push creates it)" -ForegroundColor White
        Write-Host "  2. Try pushing again - first push should create the repository" -ForegroundColor White
        Write-Host ""
        Write-Host "If it still fails, the service account might need:" -ForegroundColor Yellow
        Write-Host "  roles/storage.objectCreator" -ForegroundColor White
        Write-Host "  roles/storage.objectViewer" -ForegroundColor White
    } else {
        Write-Host "⚠️ Missing some permissions:" -ForegroundColor Yellow
        if (-not $hasStorageAdmin) {
            Write-Host "  ❌ Missing: roles/storage.admin" -ForegroundColor Red
        }
        if (-not $hasContainerRegistry) {
            Write-Host "  ❌ Missing: roles/containerregistry.ServiceAgent" -ForegroundColor Red
        }
        Write-Host ""
        Write-Host "Run fix-gcr-permissions.ps1 to grant missing permissions." -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ No permissions found for this service account!" -ForegroundColor Red
    Write-Host "Run fix-gcr-permissions.ps1 to grant permissions." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Checking if GCR API is enabled..." -ForegroundColor Yellow
$gcrEnabled = gcloud services list --enabled --project=$PROJECT_ID --filter="name:containerregistry.googleapis.com" --format="value(name)" 2>$null

if ($gcrEnabled) {
    Write-Host "✅ Container Registry API is enabled" -ForegroundColor Green
} else {
    Write-Host "❌ Container Registry API is NOT enabled" -ForegroundColor Red
    Write-Host "Run: gcloud services enable containerregistry.googleapis.com --project=$PROJECT_ID" -ForegroundColor Yellow
}

