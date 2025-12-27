#!/bin/bash

# Firebase Hosting Setup Script
# This script helps you set up Firebase Hosting for the frontend

echo "🔥 Firebase Hosting Setup"
echo "========================"
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed."
    echo "Installing Firebase CLI..."
    npm install -g firebase-tools
fi

echo "✅ Firebase CLI found"
echo ""

# Check if user is logged in
if ! firebase projects:list &> /dev/null; then
    echo "🔐 Please login to Firebase..."
    firebase login
fi

echo "✅ Firebase authentication verified"
echo ""

# Check if firebase.json exists
if [ -f "firebase.json" ]; then
    echo "✅ firebase.json already exists"
else
    echo "📝 Creating firebase.json..."
    # The file should already be created, but just in case
    echo "firebase.json should already exist. If not, create it manually."
fi

echo ""
echo "🚀 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure GitHub secrets (see FRONTEND_DEPLOYMENT_GUIDE.md)"
echo "2. Push to main/master branch to trigger deployment"
echo "3. Or deploy manually: firebase deploy --only hosting"
echo ""
echo "Your frontend will be available at:"
echo "  - https://eliteinova.web.app"
echo "  - https://eliteinova.firebaseapp.com"

