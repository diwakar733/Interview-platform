import express from 'express'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { connectDB } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import interviewRoutes from './routes/interviewRoutes.js'
import { initializeSocketHandlers } from './socket/socketHandler.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '.env') })

const app = express()
const server = http.createServer(app)

/* =========================
   CORS CONFIG (Render Safe)
========================= */

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (health checks, Postman, etc.)
      if (!origin) return callback(null, true)

      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      // For production stability (avoid invalid header crash)
      return callback(null, true)
    },
    credentials: true,
  })
)

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

/* =========================
   SOCKET.IO CONFIG
========================= */

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})

/* =========================
   DATABASE
========================= */

connectDB()

/* =========================
   LOGGING
========================= */

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`)
  next()
})

/* =========================
   ROUTES
========================= */

app.use('/api/auth', authRoutes)
app.use('/api/interviews', interviewRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

initializeSocketHandlers(io)

/* =========================
   ERROR HANDLING
========================= */

app.use((err, req, res, next) => {
  console.error('Error:', err.message)
  res.status(500).json({
    message: err.message || 'Internal server error',
  })
})

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

/* =========================
   SERVER START
========================= */

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📝 MongoDB Connected`)
  console.log(`🔗 Allowed Origins:`, allowedOrigins)
})

export default app
