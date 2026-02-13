# Development Guide

## Project Architecture

### Frontend Architecture
```
React Application
├── Authentication (AuthContext)
├── Pages
│   ├── Login/Register (Public)
│   ├── Dashboard (Protected)
│   ├── CreateRoom (Protected)
│   └── InterviewRoom (Protected)
└── Components
    ├── VideoCall (WebRTC)
    ├── CodeEditor (Monaco)
    ├── Timer
    └── RatingPanel
```

### Backend Architecture
```
Express Server
├── Authentication Routes (/api/auth)
├── Interview Routes (/api/interviews)
├── Socket.io Handler
│   ├── Room Management
│   ├── Code Synchronization
│   └── WebRTC Signaling
└── Database (MongoDB)
    ├── User Collection
    └── Interview Collection
```

## Key Design Decisions

### 1. WebRTC for Video
- **Why**: Peer-to-peer connection, minimal latency
- **How**: Signaling through Socket.io, STUN servers for NAT
- **Alternative**: Could use Twilio/Agora for managed service

### 2. Socket.io for Real-time Features
- **Why**: Efficient bi-directional communication
- **Used for**: Code sync, WebRTC signaling, presence updates
- **Fallback**: HTTP polling if WebSocket unavailable

### 3. Monaco Editor for Code
- **Why**: Full IDE features, syntax highlighting, IntelliSense
- **Alternative**: CodeMirror, Ace Editor
- **Features**: Multiple language support, themes

### 4. JWT Authentication
- **Why**: Stateless, scalable, industry standard
- **Token Storage**: localStorage (frontend), HTTP-only cookies (optional)
- **Security**: HTTPS enforced in production

## Extending the Project

### Adding a New Language to Code Editor

1. Update CodeEditor component:
```javascript
<select>
  <option value="rust">Rust</option>  // Add this
</select>
```

2. Monaco automatically supports most languages

### Adding Code Execution

1. Integrate with RunKit API or similar:
```javascript
const executeCode = async (code, language) => {
  const response = await API.post('/execute', { code, language })
  return response.data.output
}
```

2. Add Execute button to CodeEditor

### Adding Screen Share

1. Update VideoCall component:
```javascript
const shareScreen = async () => {
  const screenStream = await navigator.mediaDevices.getDisplayMedia()
  // Replace video track in peer connection
}
```

### Adding Chat

1. Create Chat component
2. Add Socket event handlers:
```javascript
socket.on('message', (msg) => setMessages(prev => [...prev, msg]))
socket.emit('send-message', { roomId, message })
```

3. Add chat panel to InterviewRoom

## Testing Guidelines

### Manual Testing Checklist

**Authentication**
- [ ] Register with valid data
- [ ] Register with duplicate email (error)
- [ ] Login with correct credentials
- [ ] Login with wrong password (error)
- [ ] Token persists on refresh
- [ ] Logout clears token

**Interview Creation**
- [ ] Interviewer can create room
- [ ] Candidate cannot create room
- [ ] Room ID is unique
- [ ] Room appears in both users' histories

**Video Communication**
- [ ] Local video displays
- [ ] Remote video displays when both connected
- [ ] Camera toggle works
- [ ] Microphone toggle works
- [ ] Both see each other

**Code Collaboration**
- [ ] Code changes sync in real-time
- [ ] Language changes sync
- [ ] Code persists after refresh
- [ ] Multiple languages supported

**Interview Management**
- [ ] Timer starts on join
- [ ] Timer shows correct duration
- [ ] Rating form appears on end
- [ ] Rating saves to database

### Automated Testing (Optional)

Add to `frontend/package.json`:
```json
{
  "scripts": {
    "test": "vitest"
  }
}
```

Create tests in `frontend/src/__tests__/`

## Common Issues & Solutions

### WebRTC Connection Fails
- **Symptom**: Remote video doesn't show
- **Solution**: 
  - Check browser camera permissions
  - Verify STUN server reachable
  - Check browser console for errors
  - Test with different browser

### Code Sync Delays
- **Symptom**: Code updates appear delayed
- **Solution**:
  - Check network latency
  - Verify Socket.io connected
  - Check browser console for errors
  - Reduce change frequency if needed

### MongoDB Connection Timeout
- **Symptom**: "Cannot connect to MongoDB"
- **Solution**:
  - Verify MongoDB is running
  - Check connection string
  - Whitelist IP in MongoDB Atlas
  - Check firewall settings

### Audio Not Working
- **Symptom**: No sound in video call
- **Solution**:
  - Check browser microphone permissions
  - Verify audio devices working
  - Check browser audio settings
  - Test audio in different app

## Performance Tips

### Frontend
- Use React.memo for expensive components
- Implement virtual scrolling for large lists
- Lazy load routes
- Optimize images (WebP format)

### Backend
- Add database indexes on frequently queried fields
- Implement rate limiting
- Use caching for repeated queries
- Monitor connection pool

### Database
- Create index on roomId field
- Create index on timestamps
- Archive old interviews
- Regular backups

## Debugging Tips

### Frontend
1. Use React DevTools extension
2. Check Network tab in DevTools
3. Use Console for errors
4. Use Redux DevTools (if added)

### Backend
1. Enable verbose logging
2. Check request/response in Network tab
3. Monitor database queries
4. Use Postman for API testing

### Socket.io
1. Add debug logging to socket events
2. Use Socket.io admin panel
3. Check browser WebSocket connection
4. Verify CORS settings

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/add-chat

# Make changes and commit
git add .
git commit -m "Add chat feature"

# Push to GitHub
git push origin feature/add-chat

# Create pull request
# Review and merge
```

---

For API documentation, see [backend/README.md](./backend/README.md)
