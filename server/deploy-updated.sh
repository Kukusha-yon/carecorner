#!/bin/bash

# Exit on error
set -e

echo "🚀 Deploying updated CareCorner backend to Vercel..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "❌ Not logged in to Vercel. Please log in first."
    vercel login
fi

# Deploy to Vercel
echo "📦 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🔍 Check your Vercel dashboard for deployment status and logs."
echo "🌐 Your API should be available at the URL provided by Vercel."
echo "🔎 Try accessing the root endpoint (/) to verify it's working."
echo "⚠️ Make sure to set up your environment variables in the Vercel dashboard." 