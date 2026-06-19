#!/bin/bash

echo "================================================================"
echo "🚀 Deploy Instructions"
echo "================================================================"

# Build frontend
echo "📦 Building Frontend..."
cd frontend && npm run build
echo "✅ Build complete: frontend/dist/"

echo ""
echo "================================================================"
echo "📤 Deploy to Netlify"
echo "================================================================"
echo "1. Go to https://app.netlify.com"
echo "2. Drag and drop 'frontend/dist' folder"
echo "3. Set env: VITE_API_URL=https://your-backend-url/api"
echo ""

echo "================================================================"
echo "📤 Deploy Backend to Render"
echo "================================================================"
echo "1. Push code to GitHub"
echo "2. Go to https://render.com"
echo "3. New Web Service → Connect GitHub"
echo "4. Build: cd backend && npm install"
echo "5. Start: cd backend && node server.js"
echo "6. Add env variables"
echo ""

echo "================================================================"
echo "✅ Deployment instructions ready!"
echo "================================================================"