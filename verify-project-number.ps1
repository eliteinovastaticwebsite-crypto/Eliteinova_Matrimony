# Verify Project Number - PowerShell Script
# Run this locally to check your project number

$PROJECT_ID = "eliteinova"
$SUSPECTED_PROJECT_NUMBER = "22341588900"

Write-Host "Verifying Project Information" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Get current project details
Write-Host "Current Project: $PROJECT_ID" -ForegroundColor Yellow
try {
    $CURRENT_PROJECT_NUMBER = gcloud projects describe $PROJECT_ID --format="value(projectNumber)" 2>$null
    $CURRENT_PROJECT_STATE = gcloud projects describe $PROJECT_ID --format="value(lifecycleState)" 2>$null
    
    if ($CURRENT_PROJECT_NUMBER) {
        Write-Host "Current Project Number: $CURRENT_PROJECT_NUMBER" -ForegroundColor Green
        Write-Host "Current Project State: $CURRENT_PROJECT_STATE" -ForegroundColor Green
        Write-Host ""
        
        # Check if they match
        if ($CURRENT_PROJECT_NUMBER -eq $SUSPECTED_PROJECT_NUMBER) {
            Write-Host "WARNING: The project number matches!" -ForegroundColor Yellow
            Write-Host "But you're getting 'deleted' errors. This means:" -ForegroundColor Yellow
            Write-Host "  - The project was deleted and recreated" -ForegroundColor White
            Write-Host "  - Your service account key is from the OLD project" -ForegroundColor White
            Write-Host "  - You need to create a NEW service account key" -ForegroundColor White
        } else {
            Write-Host "The project number does NOT match!" -ForegroundColor Red
            Write-Host "Suspected: $SUSPECTED_PROJECT_NUMBER" -ForegroundColor Red
            Write-Host "Current:   $CURRENT_PROJECT_NUMBER" -ForegroundColor Green
            Write-Host ""
            Write-Host "Your service account is from a DIFFERENT project!" -ForegroundColor Red
            Write-Host "You need a service account from: $PROJECT_ID" -ForegroundColor Yellow
        }
    } else {
        Write-Host "Cannot access project $PROJECT_ID" -ForegroundColor Red
    }
} catch {
    Write-Host "Error checking project: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "Solution:" -ForegroundColor Yellow
Write-Host "1. Create new service account key in Cloud Shell:" -ForegroundColor White
Write-Host "   gcloud iam service-accounts keys create new-key.json --iam-account=run-service-account-ece2de@eliteinova.iam.gserviceaccount.com --project=eliteinova" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Update GitHub secret GCP_SA_KEY with the new JSON" -ForegroundColor White

