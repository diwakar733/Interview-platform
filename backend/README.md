# Interview Platform Backend

Node.js + Express backend for the real-time interview platform.

## Setup

```bash
npm install
npm run dev
```

## Environment Variables

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Configure these variables:
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: JWT secret key
- `FRONTEND_URL`: Frontend URL for CORS

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Interviews
- `POST /api/interviews/create-room` - Create interview room
- `GET /api/interviews` - Get all interviews for user
- `GET /api/interviews/room/:roomId` - Get interview by room ID
- `PUT /api/interviews/:roomId/code` - Update code
- `POST /api/interviews/:roomId/rate` - Rate interview

## Socket.io Events

### Client to Server
- `join-room` - Join interview room
- `code-change` - Share code changes
- `language-change` - Change programming language
- `offer` - WebRTC offer
- `answer` - WebRTC answer
- `ice-candidate` - ICE candidate
- `end-interview` - End interview

### Server to Client
- `room-joined` - Notifies when user joins
- `receive-code` - Receive code changes
- `language-change` - Receive language change
- `offer` - Receive WebRTC offer
- `answer` - Receive WebRTC answer
- `ice-candidate` - Receive ICE candidate
- `user-joined` - Notify user joined
- `user-left` - Notify user left
- `interview-ended` - Interview ended notification
