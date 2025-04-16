#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting client build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Set environment variables
echo "🔧 Setting environment variables..."
export NODE_ENV=production
export VITE_API_URL=https://carecorner-az5h51aua-yonatans-projects-2f1159da.vercel.app/api

# Build the application
echo "🔨 Building the application..."
npm run build:prod

# Analyze the bundle
echo "📊 Analyzing the bundle..."
npm run analyze

echo "✅ Client build completed successfully!"
echo "📁 Build output is in the 'dist' directory" 