# Public URL Setup Guide

If you want to share interview links with people outside your local network, follow these steps:

## Method 1: Using ngrok (Recommended)

### Option A: Without Authentication (Free)
```powershell
# Install ngrok
npm install -g ngrok

# Start ngrok tunnel (will show you a public URL)
ngrok http 5173
```

You'll see output like:
```
ngrok                                       (Ctrl+C to quit)
Session Status                online
Session Expires              2 hours

Version                       3.x.x
Region                        us-central (US)
Latency                       25ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123def456.ngrok.io -> localhost:5173
```

Copy the forwarding URL (e.g., `https://abc123def456.ngrok.io`)

### Option B: Set Public URL in Environment

Once you have a public URL from ngrok or other service:

1. **Update frontend/.env.local:**
```
VITE_PUBLIC_URL=https://abc123def456.ngrok.io
VITE_API_URL=https://abc123def456.ngrok.io:5000
```

2. **Update backend/.env:**
```
FRONTEND_URL=https://abc123def456.ngrok.io
```

3. **Restart both servers:**
```powershell
# Kill existing servers
Get-Process node | Stop-Process -Force

# Backend
cd backend
node server.js

# Frontend (in new terminal)
cd frontend
npm run dev
```

## Method 2: Using Vercel/Netlify

Deploy your app to a free hosting service:
- Vercel: `vercel deploy`
- Netlify: `netlify deploy`

## Once Public URL is Set Up

Share the interview link with the candidate:
1. Create a new interview room
2. Click "Invite Candidate"
3. Copy the link (now will show your public URL)
4. Send to candidate

**Example public link:**
```
https://abc123def456.ngrok.io/room/abc12xyz789
```

The candidate can click this link directly and it will work from anywhere!

## Troubleshooting

**Link doesn't work:**
- Make sure both backend and frontend are running
- Check that ngrok/tunnel is still active
- Verify VITE_PUBLIC_URL matches your actual public domain

**Backend connection issues:**
- Update VITE_API_URL in frontend/.env.local to match backend URL
- Check CORS is enabled for your public domain in backend
