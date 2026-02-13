# Deployment Guide

## Option 1: Vercel + Render + MongoDB Atlas (Recommended)

### Prerequisites
- GitHub account (to host code)
- MongoDB Atlas account (free tier available)
- Vercel account (free)
- Render account (free tier available)

### Step 1: MongoDB Atlas Setup
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free
3. Create a new project
4. Create a cluster (select free tier)
5. Add a database user with username and password
6. Get connection string: `mongodb+srv://<username>:<password>@cluster.mongodb.net/interview-platform`

### Step 2: Backend Deployment (Render)
1. Push backend code to GitHub
2. Go to https://render.com
3. Sign up and connect GitHub
4. Create new "Web Service"
5. Select your backend repository
6. Configure:
   - Name: `interview-platform-backend`
   - Environment: `Node`
   - Build command: `npm install`
   - Start command: `npm start`
7. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Generate a secure key
   - `FRONTEND_URL`: https://your-frontend.vercel.app
   - `NODE_ENV`: production
8. Deploy and get your backend URL (e.g., https://interview-platform-backend.onrender.com)

### Step 3: Frontend Deployment (Vercel)
1. Push frontend code to GitHub
2. Go to https://vercel.com
3. Sign up and connect GitHub
4. Create new project, select frontend repository
5. Configure build settings:
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
6. Add environment variables:
   - `VITE_API_URL`: https://interview-platform-backend.onrender.com/api
   - `VITE_SOCKET_URL`: https://interview-platform-backend.onrender.com
7. Deploy and get your frontend URL

## Option 2: Docker + Self-Hosted Server

### Create Docker Compose File

Create `docker-compose.yml` in root:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: password

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    environment:
      MONGODB_URI: mongodb://root:password@mongodb:27017/interview-platform
      JWT_SECRET: ${JWT_SECRET}
      FRONTEND_URL: http://localhost:5173

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

### Deploy with Docker
```bash
docker-compose up --build
```

## Option 3: Heroku Deployment (Legacy)

Note: Heroku stopped free tier, but here's the configuration for reference.

### Backend Procfile
Create `backend/Procfile`:
```
web: npm start
```

### Deploy
```bash
cd backend
heroku create interview-platform-backend
heroku addons:create mongolab:sandbox
git push heroku main
```

## Environment Variables Checklist

### Backend
- [ ] MONGODB_URI (MongoDB Atlas connection string)
- [ ] JWT_SECRET (Random 32+ character string)
- [ ] FRONTEND_URL (Your frontend domain)
- [ ] NODE_ENV (set to 'production')
- [ ] PORT (6000 for Render)

### Frontend
- [ ] VITE_API_URL (Your backend API URL)
- [ ] VITE_SOCKET_URL (Your backend Socket.io URL)

## Testing Deployed Application

1. Navigate to your frontend URL in browser
2. Create account as Interviewer
3. In incognito window, create account as Candidate
4. Test all features:
   - Video call
   - Code sharing
   - Timer
   - Rating system

## Performance Optimization Tips

### Frontend
- Use production build: `npm run build`
- Enable gzip compression
- Set up CDN for static assets
- Optimize images

### Backend
- Use connection pooling for MongoDB
- Enable caching headers
- Set up load balancing for high traffic
- Monitor with PM2 or New Relic

## Monitoring & Logging

### Render Dashboard
- View logs
- Monitor CPU and memory
- Set up alerts

### MongoDB Atlas
- Monitor connection count
- Set up backups
- Enable encryption

## SSL/HTTPS

Both Vercel and Render provide free SSL certificates automatically.

For custom domains:
1. Add domain to Vercel/Render settings
2. Update DNS records
3. Certificates auto-provisioned

## Troubleshooting Deployment

### WebRTC not working
- Ensure HTTPS in production
- Check STUN server availability
- Verify firewall allows WebRTC

### Socket.io connection issues
- Check CORS settings match frontend URL
- Ensure WebSocket support enabled
- Verify polling fallback enabled

### Slow performance
- Check MongoDB indexing
- Enable response compression
- Use CDN for static files
- Monitor database connection limits

---

**For detailed support, check the main README.md**
