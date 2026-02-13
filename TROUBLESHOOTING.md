# Troubleshooting Guide

## Common Issues & Solutions

### 🔴 MongoDB Connection Issues

**Problem**: "Cannot connect to MongoDB"

**Solution 1: Check if MongoDB is running (Local)**
```bash
# macOS
brew services start mongodb-community

# Windows
# Go to Services and start MongoDB

# Linux
sudo systemctl start mongod
```

**Solution 2: Verify Connection String**
```bash
# Format: mongodb://username:password@host:port/database
# Example for local:
mongodb://localhost:27017/interview-platform

# Example for Atlas:
mongodb+srv://user:pass@cluster.mongodb.net/interview-platform?retryWrites=true&w=majority
```

**Solution 3: Check Firewall**
```bash
# Allow MongoDB port (27017) in firewall
```

**Solution 4: Whitelist IP (for MongoDB Atlas)**
- Go to MongoDB Atlas > Network Access
- Add your IP address (or 0.0.0.0 for all)

---

### 🔴 Port Already in Use

**Problem**: "EADDRINUSE: address already in use ::5000"

**Solution 1: Linux/macOS**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

**Solution 2: Windows**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID)
taskkill /PID <PID> /F

# Or use different port
# Edit backend/.env:
PORT=5001
```

**Solution 3: Use Different Port**
```bash
# Edit backend/.env
PORT=5001  # Change to any free port
```

---

### 🔴 WebRTC Not Working

**Problem**: "Remote video not showing" or "Cannot capture camera"

**Solution 1: Camera Permissions**
- Chrome: Settings → Privacy → Camera → Allow
- Firefox: about:permissions → Camera → Allow
- Safari: System Preferences → Security → Camera

**Solution 2: HTTPS Required**
- Production must use HTTPS
- Local development works with HTTP
- Self-signed certificates work for testing

**Solution 3: STUN Server Issue**
```javascript
// In VideoCall.jsx, test STUN server
const peerConnection = new RTCPeerConnection({
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
})
```

**Solution 4: Browser Console Errors**
- Press F12 to open Developer Tools
- Go to Console tab
- Look for WebRTC errors
- Check Network tab for connection issues

---

### 🔴 Socket.io Connection Issues

**Problem**: "Socket disconnected" or "Real-time features not working"

**Solution 1: Check Backend Running**
```bash
# Ensure backend is running on correct port
npm run dev  # in backend folder
# Should see: 🚀 Server running on port 5000
```

**Solution 2: Verify Socket URL**
```javascript
// frontend/src/utils/socket.js
const SOCKET_URL = 'http://localhost:5000'  // Must match backend

// Or use environment variable
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'
```

**Solution 3: Check CORS Settings**
```javascript
// Backend server.js
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
  }
})
```

**Solution 4: Browser Console Check**
- Open DevTools (F12)
- Go to Console
- Look for Socket.io connection messages
- Should see "Connected" message

---

### 🔴 Code Sync Not Working

**Problem**: "Code changes not synchronizing"

**Solution 1: Check Room ID**
```javascript
// Verify both users are in same room
// Add this to console:
console.log('Room ID:', roomId)
```

**Solution 2: Check Socket Events**
```javascript
// In CodeEditor.jsx, add logging
const handleCodeChange = (value) => {
  console.log('Sending code change...', value.length)
  socket.emit('code-change', { roomId, code: value })
}

// Should see message when you type
```

**Solution 3: Network Tab Check**
- Open DevTools
- Go to Network tab
- Look for WebSocket connection
- Should show as "101 Switching Protocols"

---

### 🔴 Login/Authentication Issues

**Problem**: "Cannot login" or "Token not working"

**Solution 1: Check Credentials**
```bash
# Verify user exists in database
# Use MongoDB Atlas dashboard or:
mongosh
use interview-platform
db.users.find({ email: 'your-email@example.com' })
```

**Solution 2: Clear LocalStorage**
```javascript
// In browser console:
localStorage.clear()
// Then refresh page
```

**Solution 3: Check Token**
```javascript
// In browser console:
console.log(localStorage.getItem('token'))
// Copy token to jwt.io to decode
```

**Solution 4: Verify JWT Secret**
```bash
# Check backend .env
# JWT_SECRET must match what was used to generate token
echo $JWT_SECRET  # Show current secret
```

---

### 🔴 Slow Performance

**Problem**: "App is slow" or "Lag when typing"

**Solution 1: Check Network Speed**
```bash
# Use Firefox Network tab
# Can see response times
# Should be < 200ms for API calls
```

**Solution 2: Database Performance**
```bash
# Check indexes are created
# In MongoDB:
db.interviews.getIndexes()
# Should have index on roomId and timestamps
```

**Solution 3: Reduce Code Editor Updates**
```javascript
// Add debouncing to code changes (in CodeEditor.jsx)
import { useCallback } from 'react'
const debouncedChange = useCallback(
  debounce((value) => {
    socket.emit('code-change', { roomId, code: value })
  }, 500),
  [roomId]
)
```

**Solution 4: Browser DevTools**
- Performance tab → Record
- Do action (type code, change settings)
- Check what's slow
- Optimize that component

---

### 🔴 Docker Issues

**Problem**: "Docker container won't start"

**Solution 1: Check Docker Running**
```bash
docker ps  # Should list containers
# If no output, Docker not running
```

**Solution 2: View Container Logs**
```bash
docker-compose logs backend    # See backend errors
docker-compose logs -f         # Follow all logs
```

**Solution 3: Rebuild Containers**
```bash
docker-compose down            # Stop all
docker-compose up --build      # Rebuild and start
```

**Solution 4: Clear Docker Cache**
```bash
docker system prune            # Clean up
docker-compose up --build      # Fresh build
```

---

### 🔴 Dependencies Issue

**Problem**: "Module not found" or "npm ERR!"

**Solution 1: Reinstall Dependencies**
```bash
# In the problematic folder (frontend or backend)
rm -rf node_modules package-lock.json
npm install
```

**Solution 2: Clear npm Cache**
```bash
npm cache clean --force
npm install
```

**Solution 3: Check Node Version**
```bash
node -v  # Should be 16.0.0 or higher
npm -v   # Should be 8.0.0 or higher
```

**Solution 4: Use Specific Version**
```bash
npm ci  # Install exact versions from package-lock.json
```

---

### 🔴 Interview Not Appearing in Dashboard

**Problem**: "Created room doesn't show in dashboard"

**Solution 1: Refresh Page**
```bash
# Press F5 or Ctrl+R
# Sometimes data takes moment to load
```

**Solution 2: Check User Role**
```javascript
// In browser console:
console.log(JSON.parse(localStorage.getItem('user')))
// Should show role: 'interviewer' or 'candidate'
```

**Solution 3: Check API Response**
- Open DevTools
- Go to Network tab
- Make request to /api/interviews
- Check response data
- Should contain your interview

**Solution 4: Clear Token and Login Again**
```javascript
localStorage.clear()
// Then login again
```

---

### 🔴 Video Permission Denied

**Problem**: "NotAllowedError" or "Permission denied for camera"

**Solution 1: Chrome/Edge**
- Click lock icon in address bar
- Click "Permissions"
- Enable Camera and Microphone
- Reload page

**Solution 2: Firefox**
- Click permissions icon (looks like info)
- Allow Camera and Microphone
- Reload page

**Solution 3: Safari**
- System Preferences → Security & Privacy → Camera
- Allow browser from list

**Solution 4: Reset Browser**
```bash
# Clear site data
DevTools → Application → Clear site data
# Then reload
```

---

### 🔴 Email/Password Validation Errors

**Problem**: "Email already exists" or "Password too short"

**Solution 1: Valid Email Format**
```
Valid: user@example.com
Invalid: user@example (missing .com)
Invalid: @example.com (missing username)
```

**Solution 2: Password Requirements**
- Minimum 6 characters
- Can be any characters (letters, numbers, symbols)

**Solution 3: Check Duplicate Email**
```javascript
// You need different email each registration
// Or delete the user first:
// MongoDB: db.users.deleteOne({email: 'existing@example.com'})
```

---

## Getting Help

### Check These First
1. ✅ Is backend running? (`npm run dev`)
2. ✅ Is frontend running? (`npm run dev`)
3. ✅ Is MongoDB running?
4. ✅ Are you using correct URLs?
5. ✅ Check browser console for errors (F12)

### Debug Checklist
```javascript
// Paste in browser console to debug:

// Check auth
console.log('Token:', localStorage.getItem('token'))
console.log('User:', JSON.parse(localStorage.getItem('user')))

// Check socket
console.log('Socket connected:', socket.connected)

// Check API
fetch('http://localhost:5000/health')
  .then(r => r.json())
  .then(d => console.log('Backend status:', d))
  .catch(e => console.log('Backend error:', e))
```

### Create Issue Report
Include:
1. Error message (exact text)
2. Steps to reproduce
3. Browser/OS info
4. Console screenshots
5. Network tab screenshots

### Useful Resources
- [React Docs](https://react.dev)
- [Express Docs](https://expressjs.com)
- [Node.js Docs](https://nodejs.org/docs)
- [MongoDB Docs](https://docs.mongodb.com)
- [Socket.io Docs](https://socket.io/docs)
- [WebRTC Docs](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)

---

**Still stuck? Check the full documentation in README.md**
