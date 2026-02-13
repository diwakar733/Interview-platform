# Interview Platform - Complete Project

This workspace contains a production-ready real-time interview platform with the following structure:

## Project Organization

```
INTERVIEW/
├── frontend/          # React + Vite frontend application
├── backend/           # Node.js + Express backend server
└── README.md          # Project documentation
```

## Installation & Setup

### Step 1: Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB connection string
npm run dev
```

Server will run on: `http://localhost:5000`

### Step 2: Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

App will run on: `http://localhost:5173`

## Quick Reference

### Backend Features
- JWT Authentication with bcryptjs
- MongoDB with Mongoose
- Express REST API
- Socket.io for real-time communication
- WebRTC signaling server

### Frontend Features
- React Router for navigation
- Tailwind CSS for styling
- Monaco Editor for code collaboration
- WebRTC video calls
- Real-time code synchronization
- Interview timer and rating system

## First Test

1. Open two browser windows
2. Navigate to `http://localhost:5173`
3. Register as Interviewer (Role: Interviewer)
4. Register as Candidate (Role: Candidate)
5. Interviewer creates a room
6. Candidate joins the room code
7. Test video, code editor, and features

## Environment Variables

**Backend (.env)**
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (default: 5000)
- `FRONTEND_URL`: Frontend URL for CORS

**Frontend (.env)**
- `VITE_API_URL`: Backend API URL
- `VITE_SOCKET_URL`: Socket.io server URL

## Available Scripts

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Key Folders

```
backend/
├── models/           # Database schemas (User, Interview)
├── routes/          # API endpoints
├── middleware/      # JWT authentication
├── socket/          # Socket.io event handlers
├── config/          # Database configuration
└── server.js        # Main server file

frontend/
├── src/
│   ├── pages/       # Page components (Login, Dashboard, etc)
│   ├── components/  # Reusable components (CodeEditor, VideoCall, etc)
│   ├── context/     # React Context for auth
│   ├── utils/       # API and Socket utility files
│   └── App.jsx      # Main app component
```

## Default Ports
- Frontend: `5173`
- Backend: `5000`
- MongoDB: `27017` (if local)

## Next Steps

1. Install MongoDB locally or use MongoDB Atlas
2. Configure .env files with actual values
3. Install all dependencies
4. Run both frontend and backend
5. Test the complete interview flow

---

For detailed information, see [README.md](./README.md)
