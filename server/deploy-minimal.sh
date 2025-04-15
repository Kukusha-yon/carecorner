#!/bin/bash

# Exit on error
set -e

echo "🚀 Deploying minimal CareCorner backend to Vercel..."

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

# Create a temporary directory for the minimal server
TEMP_DIR=$(mktemp -d)
echo "📁 Created temporary directory: $TEMP_DIR"

# Copy the minimal server files to the temporary directory
cp minimal-server.js $TEMP_DIR/
cp minimal-vercel.json $TEMP_DIR/vercel.json
cp package.json $TEMP_DIR/

# Deploy to Vercel from the temporary directory
echo "📦 Deploying minimal server to Vercel..."
cd $TEMP_DIR
vercel --prod

echo "✅ Deployment complete!"
echo "🔍 Check your Vercel dashboard for deployment status and logs."
echo "🌐 Your minimal server should be available at the URL provided by Vercel."
echo "🔎 Try accessing the /api/test and /api/health endpoints to verify it's working." 