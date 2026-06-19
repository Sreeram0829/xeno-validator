#!/bin/bash

echo "================================================================"
echo "🚀 Xeno Transaction Validator - Setup"
echo "================================================================"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not installed. Please install Node.js v16+"
    exit 1
fi
echo "✅ Node.js $(node -v) found"

# Install Backend
echo "📦 Installing Backend..."
cd backend && npm install
echo "✅ Backend installed"

# Install Frontend
echo "📦 Installing Frontend..."
cd ../frontend && npm install
echo "✅ Frontend installed"

# Create directories
cd ../backend
mkdir -p src/uploads src/outputs/cleaned src/outputs/chunks src/outputs/reports
echo "✅ Directories created"

echo ""
echo "================================================================"
echo "✅ Setup Complete!"
echo "================================================================"
echo ""
echo "Start Backend: cd backend && npm run dev"
echo "Start Frontend: cd frontend && npm run dev"
echo ""
echo "Access: http://localhost:5173"
echo "================================================================"