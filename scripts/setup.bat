@echo off
echo ================================================================
echo 🚀 Xeno Transaction Validator - Setup
echo ================================================================

echo 📦 Installing Backend...
cd backend
call npm install
echo ✅ Backend installed

echo 📦 Installing Frontend...
cd ..\frontend
call npm install
echo ✅ Frontend installed

echo 📁 Creating directories...
cd ..\backend
mkdir src\uploads 2>nul
mkdir src\outputs\cleaned 2>nul
mkdir src\outputs\chunks 2>nul
mkdir src\outputs\reports 2>nul

echo.
echo ================================================================
echo ✅ Setup Complete!
echo ================================================================
echo.
echo Start Backend: cd backend ^&^& npm run dev
echo Start Frontend: cd frontend ^&^& npm run dev
echo.
echo Access: http://localhost:5173
echo ================================================================
pause