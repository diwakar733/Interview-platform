# Architecture & Design Decisions

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Pages: Login, Register, Dashboard, CreateRoom, Interview│   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Components: VideoCall, CodeEditor, Timer, RatingPanel   │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Infrastructure: AuthContext, API client, Socket client  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                             │
                    HTTP REST APIs
                    WebSocket/Socket.io
                             │
┌─────────────────────────────────────────────────────────────────┐
│                     Backend (Express)                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Routes: /api/auth, /api/interviews                       │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Middleware: Authentication, Validation, CORS            │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Socket.io: Room management, WebRTC signaling, Code sync │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                             │
                        MongoDB
                             │
┌─────────────────────────────────────────────────────────────────┐
│                    Database (MongoDB)                            │
│  Collections: Users, Interviews                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
User Registration/Login
    ↓
Node.js handles credential verification
    ↓
Generate JWT Token
    ↓
Store in localStorage (Frontend)
    ↓
Include in Authorization header for protected routes
    ↓
Backend middleware verifies token
    ↓
Request proceeds if valid
```

## Real-Time Communication

### WebRTC (Video/Audio)
```
Candidate                           Interviewer
  │                                      │
  ├─ Request camera/mic ────────────────┤
  │                                      │
  ├─ Create WebRTC connection ─────────┤
  │                                      │
  ├─ Send Offer (via Socket.io) ──────→│
  │                                      │
  │← Send Answer (via Socket.io) ──────┤
  │                                      │
  ├─ Exchange ICE Candidates ←────────→│
  │                                      │
  ├─ Establish P2P connection ────────→│
  │                                      │
  ├─ Video stream flows P2P ┌────────→┐│
  │  (no server involvement)│          ││
  │                         └←────────┘│
```

### Socket.io (Code Sync & Signaling)
```
User A                Socket Server                User B
  │                         │                         │
  ├─ join-room ─────────────┤                         │
  │                         ├─ room-joined ───────────┤
  │                         │                         │
  ├─ code-change ──────────→┼─→ receive-code ────────→│
  │                         │                         │
  ├─ offer ────────────────→┼─→ offer ───────────────→│
  │                         │                         │
  │← ice-candidate ─────────┼─← ice-candidate ────────┤
  │                         │                         │
```

## Data Models

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String ('interviewer' | 'candidate'),
  createdAt: Date,
  updatedAt: Date
}
```

### Interview Model
```javascript
{
  _id: ObjectId,
  roomId: String (unique),
  interviewer: ObjectId (ref: User),
  candidate: ObjectId (ref: User),
  code: String,
  language: String,
  status: String ('active' | 'completed' | 'cancelled'),
  rating: Number (1-10),
  feedback: String,
  startTime: Date,
  endTime: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Key Design Decisions

### 1. WebRTC for Video
**Why**: 
- Low latency (direct peer-to-peer)
- No server-side streaming cost
- Better privacy (content doesn't go through server)

**Alternatives Considered**:
- Twilio: More features, but paid service
- Agora: Good alternative, also paid
- HLS Streaming: High latency

---

### 2. Socket.io for Real-Time Features
**Why**:
- Bi-directional communication
- Automatic fallback to polling
- Good for room-based events
- Efficient for code synchronization

**Alternatives Considered**:
- Raw WebSocket: No fallback, more complex
- Server-Sent Events: One-way only
- Polling: High server load

---

### 3. JWT Authentication
**Why**:
- Stateless (scales horizontally)
- Token-based (no session storage needed)
- Can work across subdomains
- Industry standard

**Flow**:
1. User registers → Password hashed with bcrypt
2. User logs in → Credentials verified
3. JWT token created with user ID and exp time
4. Token stored in localStorage
5. Token sent with every API request
6. Backend middleware validates token

---

### 4. MongoDB + Mongoose
**Why**:
- Document-based (flexible schema)
- Good for interviews with varying data
- Built-in indexing support
- Horizontal scaling with sharding

**Indexes Created**:
- `roomId` (unique)
- `interviewer` + `candidate` (for queries)
- `createdAt` (for sorting)

---

### 5. Monaco Editor
**Why**:
- Full IDE features (autocomplete, refactoring)
- Supports 50+ languages
- Lightweight and performant
- Used in VS Code

**Alternatives**:
- CodeMirror: Good but fewer features
- Ace Editor: Legacy, less active maintenance
- Prism.js: Highlighter only, not full editor

---

### 6. Tailwind CSS
**Why**:
- Utility-first approach
- Small bundle size
- Easy theming
- Large community

---

## Security Considerations

### Password Security
```javascript
// Using bcryptjs with 10 salt rounds
const hashedPassword = await bcryptjs.hash(password, 10)
```

### JWT Secrets
- Must be long (32+ characters)
- Should be random
- Never commit to repository
- Rotate periodically in production

### CORS Protection
```javascript
cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
})
```

### Input Validation
- Email format validation
- Password length requirement
- XSS protection through React
- SQL injection prevention (MongoDB documents)

### HTTPS in Production
- Enforce HTTPS for all requests
- Use secure cookies
- Enable HSTS header

---

## Scalability Considerations

### Current Limitations
- Single server (no horizontal scaling)
- MongoDB on free tier limits connections
- No caching layer

### Future Improvements

#### 1. Load Balancing
```
Nginx/HAProxy
    ├─ Backend Server 1
    ├─ Backend Server 2
    └─ Backend Server 3
```

#### 2. Caching
```
Redis for:
- User session cache
- Room metadata cache
- Reduce database queries
```

#### 3. Database Optimization
```
- Add indexes on frequently queried fields
- Archive old interviews
- Implement pagination
- Use connection pooling
```

#### 4. Socket.io Scaling
```
Redis Adapter:
- Share socket events across servers
- Support multiple containers
- Save state in Redis
```

---

## Performance Optimization

### Frontend
1. **Code Splitting**: Load routes only when needed
2. **Lazy Loading**: Components loaded on demand
3. **Memoization**: React.memo for expensive components
4. **Image Optimization**: Use WebP format
5. **Service Workers**: Offline support (future)

### Backend
1. **Database Indexes**: Fast queries
2. **Caching**: Reduce database hits
3. **Compression**: Gzip responses
4. **Connection Pooling**: Reuse connections
5. **Rate Limiting**: Prevent abuse

### Network
1. **CDN**: Serve static files from edge
2. **Compression**: Reduce payload size
3. **Bundling**: Combine CSS/JS files
4. **Lazy Loading**: Load on scroll
5. **Service Workers**: Cache assets

---

## Testing Strategy

### Unit Tests
- Test individual functions
- Mock external dependencies
- 80%+ code coverage target

### Integration Tests
- Test API endpoints
- Test database operations
- Test Socket events

### E2E Tests
- Full user flow
- Cross-browser testing
- Performance testing

---

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│         Frontend (Vercel)               │
│  - Static site hosting                  │
│  - CDN for global distribution          │
│  - Automatic HTTPS                      │
│  - Free tier available                  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         Backend (Render)                │
│  - Node.js hosting                      │
│  - Auto-scaling capabilities            │
│  - Environment variables support        │
│  - Free tier available                  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│      Database (MongoDB Atlas)           │
│  - Cloud MongoDB                        │
│  - Automatic backups                    │
│  - Free tier (512MB)                    │
│  - Global availability                  │
└─────────────────────────────────────────┘
```

---

## Monitoring & Logging

### Frontend
- Error tracking (Sentry optional)
- Analytics (Google Analytics optional)
- Performance monitoring

### Backend
- Request logging
- Error logging with stack traces
- Database query monitoring

### Production
- Uptime monitoring
- Performance alerts
- Error notifications

---

## Future Features

1. **Screen Sharing**: Share entire screen or window
2. **Chat**: Real-time text chat
3. **Code Execution**: Run code and show output
4. **Code Snippets**: Save and reuse snippets
5. **Interview Templates**: Predefined questions
6. **Analytics**: Interview analytics dashboard
7. **Mobile App**: React Native version
8. **AI Features**: Plagiarism detection, code assessment
9. **Integration**: Calendar integration, email notifications
10. **Recording**: Video recording capabilities

---

**Architecture documentation updated: January 2024**
