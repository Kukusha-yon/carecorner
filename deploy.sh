#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting deployment process for CareCorner..."

# Build the client
echo "📦 Building the client..."
cd client
./build.sh
cd ..

# Build the server
echo "📦 Building the server..."
cd server
./build.sh
cd ..

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment completed successfully!" 