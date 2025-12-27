# Firebase Hosting Setup Script (PowerShell)
# This script helps you set up Firebase Hosting for the frontend

Write-Host "Firebase Hosting Setup" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host ""

# Check if Firebase CLI is installed
try {
    $firebaseVersion = firebase --version 2>$null
    Write-Host "Firebase CLI found (version: $firebaseVersion)" -ForegroundColor Green
} catch {
    Write-Host "Firebase CLI is not installed." -ForegroundColor Yellow
    Write-Host "Installing Firebase CLI..." -ForegroundColor Yellow
    npm install -g firebase-tools
}

Write-Host ""

# Check if user is logged in
try {
    firebase projects:list 2>$null | Out-Null
    Write-Host "Firebase authentication verified" -ForegroundColor Green
} catch {
    Write-Host "Please login to Firebase..." -ForegroundColor Yellow
    firebase login
}

Write-Host ""

# Check if firebase.json exists
if (Test-Path "firebase.json") {
    Write-Host "firebase.json already exists" -ForegroundColor Green
} else {
    Write-Host "firebase.json should already exist. If not, create it manually." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Configure GitHub secrets (see FRONTEND_DEPLOYMENT_GUIDE.md)" -ForegroundColor White
Write-Host "2. Push to main/master branch to trigger deployment" -ForegroundColor White
Write-Host "3. Or deploy manually: firebase deploy --only hosting" -ForegroundColor White
Write-Host ""
Write-Host "Your frontend will be available at:" -ForegroundColor Yellow
Write-Host "  - https://eliteinova.web.app" -ForegroundColor Cyan
Write-Host "  - https://eliteinova.firebaseapp.com" -ForegroundColor Cyan

