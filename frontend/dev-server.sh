#!/bin/bash

# Simple development server launcher
echo "🚀 Starting RWA Tokenization Frontend"
echo "===================================="

# Check if in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the frontend directory"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🌟 Starting Vite development server..."
echo ""
echo "The frontend will be available at: http://localhost:3000"
echo "Make sure:"
echo "  1. Anvil blockchain is running (anvil)"
echo "  2. Smart contracts are deployed"
echo "  3. MetaMask is configured for Anvil network"
echo ""

# Try multiple approaches to start Vite
if [ -f "node_modules/.bin/vite" ]; then
    exec node_modules/.bin/vite --host
elif [ -f "node_modules/vite/bin/vite.js" ]; then
    exec node node_modules/vite/bin/vite.js --host
else
    echo "❌ Could not find Vite. Trying to reinstall..."
    rm -rf node_modules package-lock.json
    npm install
    exec node_modules/.bin/vite --host
fi
