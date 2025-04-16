#!/bin/bash
set -e

echo "Starting production build for CareCorner client..."

# Install dependencies
echo "Installing dependencies..."
npm ci

# Build the application
echo "Building the application..."
npm run build:prod

echo "Build completed successfully!"
echo "Output is in the 'dist' directory" 