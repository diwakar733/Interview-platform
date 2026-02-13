#!/bin/bash

# Development startup script
echo "🚀 Starting Interview Platform..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Node.js found: $(node -v)"
echo "✅ npm found: $(npm -v)"

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
cd ..

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
cd ..

# Create backend .env if not exists
if [ ! -f backend/.env ]; then
    echo ""
    echo "📝 Creating backend/.env..."
    cp backend/.env.example backend/.env
    echo "✅ backend/.env created (please configure MongoDB URI)"
fi

# Create frontend .env if not exists
if [ ! -f frontend/.env ]; then
    echo ""
    echo "📝 Creating frontend/.env..."
    cp frontend/.env.example frontend/.env
    echo "✅ frontend/.env created"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup complete! You're ready to start development."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Next steps:"
echo "  1. Configure backend/.env with your MongoDB URI"
echo "  2. Open two terminals"
echo "  3. In terminal 1: cd backend && npm run dev"
echo "  4. In terminal 2: cd frontend && npm run dev"
echo "  5. Open http://localhost:5173 in your browser"
echo ""
