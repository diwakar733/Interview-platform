@echo off
REM Development startup script for Windows

echo 🚀 Starting Interview Platform...

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)

echo ✅ Node.js found: 
node -v

echo ✅ npm found:
npm -v

REM Install backend dependencies
echo.
echo 📦 Installing backend dependencies...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed
cd ..

REM Install frontend dependencies
echo.
echo 📦 Installing frontend dependencies...
cd frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed
cd ..

REM Create backend .env if not exists
if not exist "backend\.env" (
    echo.
    echo 📝 Creating backend\.env...
    copy backend\.env.example backend\.env
    echo ✅ backend\.env created (please configure MongoDB URI)
)

REM Create frontend .env if not exists
if not exist "frontend\.env" (
    echo.
    echo 📝 Creating frontend\.env...
    copy frontend\.env.example frontend\.env
    echo ✅ frontend\.env created
)

echo.
echo ==========================================
echo ✅ Setup complete! You're ready to start development.
echo ==========================================
echo.
echo 📋 Next steps:
echo   1. Configure backend\.env with your MongoDB URI
echo   2. Open two PowerShell/CMD terminals
echo   3. In terminal 1: cd backend ^&^& npm run dev
echo   4. In terminal 2: cd frontend ^&^& npm run dev
echo   5. Open http://localhost:5173 in your browser
echo.
pause
