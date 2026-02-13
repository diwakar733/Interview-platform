# Real-Time Interview Platform

A comprehensive full-stack application for conducting technical interviews with real-time video communication, shared code editor, and interview management system.

## 🎯 Features

- **User Authentication**: Register/Login with JWT tokens
- **Interview Rooms**: Create and join interview rooms
- **Real-Time Video**: WebRTC-based video conferencing
- **Shared Code Editor**: Monaco Editor with real-time synchronization
- **Interview Timer**: Track interview duration
- **Rating System**: Rate candidates and provide feedback
- **Interview History**: View past interviews and results
- **Responsive Design**: Works on desktop and tablet devices

## 🏗️ Project Structure

```
interview-platform/
├── frontend/                 # React + Vite
│   ├── src/
│   │   ├── pages/           # Login, Register, Dashboard, InterviewRoom, CreateRoom
│   │   ├── components/      # CodeEditor, VideoCall, Timer, RatingPanel
│   │   ├── context/         # AuthContext for state management
│   │   ├── utils/           # API and Socket.io utilities
│   │   └── App.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/                  # Express + Node.js
│   ├── models/              # User, Interview
│   ├── routes/              # Authentication, Interviews
│   ├── middleware/          # JWT verification
│   ├── socket/              # Socket.io event handlers
│   ├── config/              # Database configuration
│   ├── package.json
│   └── server.js
│
└── README.md

```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (locally or Atlas)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB connection and settings
npm run dev
```

The backend will start on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Interviews
- `POST /api/interviews/create-room` - Create interview room
- `GET /api/interviews` - Get user's interviews
- `GET /api/interviews/room/:roomId` - Get specific interview
- `PUT /api/interviews/:roomId/code` - Save code
- `POST /api/interviews/:roomId/rate` - Rate interview

## 🔌 Socket.io Events

### Joining Room
```javascript
socket.emit('join-room', { roomId, userId, userName })
```

### Code Collaboration
```javascript
socket.emit('code-change', { roomId, code })
socket.emit('language-change', { roomId, language })
```

### WebRTC Signaling
```javascript
socket.emit('offer', { roomId, offer })
socket.emit('answer', { roomId, answer })
socket.emit('ice-candidate', { roomId, candidate })
```

## 🔐 Authentication Flow

1. User registers with name, email, password, and role (interviewer/candidate)
2. JWT token is generated and stored in localStorage
3. Protected routes check token validity
4. Token is sent with every API request via Authorization header

## 🎥 Video Communication

- Uses WebRTC for peer-to-peer video/audio
- Signaling through Socket.io
- STUN servers for NAT traversal
- Video preview in picture-in-picture mode

## 📝 Code Editor Features

- Real-time code synchronization
- Support for multiple languages (JavaScript, Python, Java, C++, SQL)
- Auto-save every 5 seconds
- Monaco Editor for syntax highlighting and IntelliSense

## ⏱️ Interview Timer

- Tracks interview duration in HH:MM:SS format
- Displays at the top of interview room
- Synchronized across participants

## ⭐ Rating System

- Interviewer can rate candidate (1-10)
- Add detailed feedback
- Auto-saves to database
- Accessible in interview history

## 🌐 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy dist folder to Vercel
```

### Backend (Render)
```bash
# Push to GitHub
# Connect repository to Render
# Set environment variables
# Deploy
```

### Database (MongoDB Atlas)
1. Create account on MongoDB Atlas
2. Create cluster
3. Get connection string
4. Set MONGODB_URI in backend .env

## 📚 Tech Stack

### Frontend
- React 18
- Vite
- React Router v6
- Tailwind CSS
- Axios
- Socket.io-client
- Monaco Editor
- WebRTC API

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT + bcrypt
- Socket.io
- CORS

## 🛠️ Development

### Run Both Projects Locally

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

### Testing

1. Create two browser tabs/windows
2. Register as Interviewer in first tab
3. Register as Candidate in second tab
4. Interviewer creates room
5. Candidate joins room
6. Test video, code editor, and features

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/interview-platform
JWT_SECRET=your_very_secure_secret_key
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

MIT License - See LICENSE file for details

## 🆘 Troubleshooting

### MongoDB Connection Issues
- Check MongoDB is running
- Verify connection string in .env
- Check firewall settings

### WebRTC Connection Issues
- Ensure HTTPS in production
- Check STUN server availability
- Test camera/microphone permissions

### Socket.io Connection Issues
- Verify backend URL in frontend
- Check CORS settings
- Ensure Socket.io version compatibility

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Happy Interviewing! 🎉**
