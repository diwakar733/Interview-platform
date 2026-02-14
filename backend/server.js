import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import { initializeSocketHandlers } from "./socket/socketHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const server = http.createServer(app);

// =======================
// CORS CONFIGURATION
// =======================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL, // Vercel URL
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Allow Postman / health checks
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Allow all for now (production safe alternative below)
    },
    credentials: true,
  })
);

// =======================
// BODY PARSING
// =======================

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// =======================
// SOCKET.IO
// =======================

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

initializeSocketHandlers(io);

// =======================
// DATABASE CONNECTION
// =======================

connectDB();

// =======================
// REQUEST LOGGER
// =======================

app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} ${req.method} ${req.originalUrl}`
  );
  next();
});

// =======================
// ROUTES
// =======================

app.use("/api/auth", authRoutes);
app.use("/api/interviews", interviewRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// =======================
// ERROR HANDLING
// =======================

app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// =======================
// START SERVER
// =======================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Allowed Origins:`, allowedOrigins);
});
