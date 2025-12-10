import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import express from "express";
import passport from "passport";
import { configurePassport } from "./passport/jwt.strategy.js";
import authRoutes from "./routes/auth.route.js";
import accountHolderRoutes from "./routes/accountHolder.route.js";
import accountManagementRoutes from "./routes/accountManagement.route.js";
import { ApiError } from "./utils/ApiError.js";
import { Server } from "socket.io";
import { createServer } from "http";

// --- __dirname fix ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// --- Load env first ---
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

// --- Adjust Prisma engine path if running inside Electron ---
const electronProcess = process as typeof process & { resourcesPath?: string };

// This is only necessary when running inside packaged Electron
if (electronProcess.resourcesPath) {
  const prismaEnginePath = path.join(
    electronProcess.resourcesPath,
    "backend",
    "node_modules",
    ".prisma",
    "client",
    "query_engine.node"
  );
  process.env.PRISMA_QUERY_ENGINE_LIBRARY = prismaEnginePath;
}

// --- Serve frontend ---
const distPath = join(__dirname, "../../frontend/dist");

// --- io at module scope ---
let io: Server;
export { io };

// --- Wrap server in a function ---
export function startServer() {
  const app = express();
  const PORT = process.env.PORT || 5174;
  const server = createServer(app);

  // --- Initialize socket.io ---
  io = new Server(server, {
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

  // --- Middleware ---
  app.use(express.json());
  app.use(passport.initialize());
  configurePassport(passport);

  // --- API Routes ---
  app.get("/api/hello", (req, res) => {
    res.json({ message: "Hello from Express + React + Electron!" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/account", accountHolderRoutes);
  app.use("/api/account-managment", accountManagementRoutes);

  // --- Global error handler ---
  app.use(
    (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      const isProduction = process.env.NODE_ENV === "production";
      if (!isProduction) console.error("Unhandled error:", err);

      const statusCode = err instanceof ApiError ? err.statusCode : 500;
      const message = err instanceof ApiError ? err.message : "Internal server error";

      res.status(statusCode).json({ error: message });
    }
  );

  // --- Serve static frontend ---
  app.use(express.static(distPath));

  // --- SPA fallback ---
  app.use((req, res) => res.sendFile(join(distPath, "index.html")));

  // --- Start server ---
  server.listen(PORT, () => {
    console.log(`🚀 Backend + Socket.IO running at http://localhost:${PORT}`);
  });

  return { io };
}

// --- Only start server if not running inside Electron ---
// Electron will call startServer() manually
if (!process.versions.electron) {
  startServer();
}
