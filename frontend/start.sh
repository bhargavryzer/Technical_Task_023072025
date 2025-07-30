#!/bin/bash

# RWA Tokenization Frontend Start Script

echo "🚀 Starting RWA Tokenization Platform Frontend"
echo "=============================================="

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if Anvil is running
echo "🔍 Checking if Anvil blockchain is running..."
if ! curl -s http://127.0.0.1:8545 > /dev/null; then
    echo "⚠️  Warning: Anvil blockchain is not running!"
    echo "   Please start Anvil in another terminal:"
    echo "   $ anvil"
    echo ""
fi

# Start the development server
echo "🌟 Starting development server..."
echo "   Frontend will be available at: http://localhost:3000"
echo "   Make sure MetaMask is configured for Anvil network (Chain ID: 31337)"
echo ""

npm run dev
