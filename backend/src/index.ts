import express from "express";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import passport from "passport";
import { configurePassport } from "./passport/jwt.strategy.js";
import authRoutes from "./routes/auth.route.js";
import accountHolderRoutes from "./routes/accountHolder.route.js";
import accountManagementRoutes from "./routes/accountManagement.route.js";
import { ApiError } from "./utils/ApiError.js";

// socket.io
import { Server } from "socket.io";
import { createServer } from "http";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5174;

// Create HTTP server for Socket.IO
const server = createServer(app);

// Create socket instance (export to use in controllers)
export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

app.use(express.json());
app.use(passport.initialize());
configurePassport(passport);

// --- API routes ---
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Express + React + Electron!" });
});

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/account", accountHolderRoutes);
app.use("/api/account-managment", accountManagementRoutes);

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const isProduction = process.env.NODE_ENV === "production";
  if (!isProduction) { // Show full error in development 
    console.error("Unhandled error:", err);
  }
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err instanceof ApiError ? err.message : "Internal server error";

  res.status(statusCode).json({ error: message });
});

// --- Serve static frontend (production only) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distPath = join(__dirname, "../../frontend/dist");

app.use(express.static(distPath));

// SPA fallback
app.use((req, res) => {
  res.sendFile(join(distPath, "index.html"));
});

// Start server WITH socket.io
server.listen(PORT, () => {
  console.log(`🚀 Backend + Socket.IO running at http://localhost:${PORT}`);
});
