# Quick Start Guide

Get the Interview Platform up and running in 5 minutes!

## Prerequisites
- Node.js 16+ ([Download](https://nodejs.org/))
- MongoDB local or Atlas account ([Free Tier](https://www.mongodb.com/cloud/atlas))
- Git (optional)

## Option 1: Using Setup Script (Recommended)

### Windows
```bash
cd INTERVIEW
setup.bat
```

### macOS/Linux
```bash
cd INTERVIEW
chmod +x setup.sh
./setup.sh
```

The script will:
- ✅ Check Node.js installation
- ✅ Install all dependencies
- ✅ Create .env files from templates
- ✅ Guide you through configuration

## Option 2: Manual Setup

### Step 1: Install Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add MongoDB URI
npm run dev
```

**Expected Output:**
```
🚀 Server running on port 5000
📝 MongoDB: mongodb://localhost:27017/interview-platform
🔗 CORS enabled for: http://localhost:5173
```

### Step 2: Install Frontend (New Terminal)
```bash
cd frontend
npm install
npm run dev
```

**Expected Output:**
```
  ➜  Local:   http://localhost:5173/
```

### Step 3: Open in Browser
Navigate to: `http://localhost:5173`

## First Test

### 1️⃣ Register as Interviewer
- Go to Register page
- Fill in details
- Select **Interviewer** role
- Click Register

### 2️⃣ Register as Candidate
- Open new **Incognito/Private** window
- Go to same URL
- Fill in different email
- Select **Candidate** role
- Click Register

### 3️⃣ Create Interview Room
- In Interviewer window
- Click "Create New Interview Room"
- Copy the Room ID

### 4️⃣ Candidate Joins Room
- In Candidate window
- Click "Dashboard"
- Find the room
- Click "Join"

### 5️⃣ Test Features
- ✅ **Video**: Both cameras should display
- ✅ **Code**: Type code, should sync in real-time
- ✅ **Timer**: Should start counting
- ✅ **Rating**: Interviewer can rate after interview

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/interview-platform
JWT_SECRET=change_this_to_random_string
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### Frontend (no .env needed for local)
Uses defaults in code for localhost

## Troubleshooting

### "Cannot connect to MongoDB"
```bash
# Check if MongoDB is running
mongosh  # opens MongoDB shell

# If not installed, install or use MongoDB Atlas instead
# Get connection string from: https://cloud.mongodb.com
```

### "Port 5000 already in use"
```bash
# Linux/Mac - Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Windows - Use different port
# Edit backend/.env and change PORT=5001
```

### "Module not found"
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### "CORS error"
- Ensure both frontend and backend are running
- Check FRONTEND_URL in backend .env matches frontend URL

## Useful Commands

### Backend
```bash
npm run dev      # Start development server
npm start        # Start production server
npm test         # Run tests (if configured)
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Both (from root)
```bash
npm install:all  # Install all dependencies
npm run dev      # Run both simultaneously (needs concurrently)
```

## Docker Setup (Optional)

```bash
# Make sure Docker Desktop is installed
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all
docker-compose down
```

## Common Issues

| Issue | Solution |
|-------|----------|
| Video not showing | Check camera permissions in browser |
| Code not syncing | Ensure both users on same room |
| Slow performance | Check MongoDB connection |
| Can't login | Clear localStorage and try again |

## Next Steps

1. **Customize**: Edit colors in `tailwind.config.js`
2. **Add Features**: Follow [DEVELOPMENT.md](./DEVELOPMENT.md)
3. **Deploy**: Follow [DEPLOYMENT.md](./DEPLOYMENT.md)
4. **Test**: Check [TESTING.md](./TESTING.md)

## Project Structure

```
INTERVIEW/
├── frontend/          # React app (runs on 5173)
├── backend/           # Express API (runs on 5000)
├── README.md          # Full documentation
├── SETUP.md          # Setup instructions
├── DEPLOYMENT.md     # Deployment guide
├── DEVELOPMENT.md    # Development guide
├── TESTING.md        # Testing guide
└── docker-compose.yml # Docker setup
```

## Support

- 📖 Read full [README.md](./README.md)
- 🔍 Check [API_DOCS.md](./API_DOCS.md) for API details
- 💻 See [DEVELOPMENT.md](./DEVELOPMENT.md) for extending
- 🚀 Follow [DEPLOYMENT.md](./DEPLOYMENT.md) to deploy

---

**Happy interviewing! 🎉**
