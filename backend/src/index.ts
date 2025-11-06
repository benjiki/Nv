import express from "express";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import passport from "passport";
// import { configurePassport } from "./passport/jwt.strategy";
import { configurePassport } from "./passport/jwt.strategy.js";
import authRoutes from "./routes/auth.route.js"; // ✅ Your route file
import accountHolderRoutes from "./routes/accountHolder.route.js"
import { ApiError } from "./utils/ApiError.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5174;

app.use(express.json());
app.use(passport.initialize());
configurePassport(passport); // ✅ Register JWT strategy
// --- API routes ---
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Express + React + Electron!" });
});
// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/account", accountHolderRoutes)

// ✅ Health check
app.get("/health", (req, res) => {
  res.send("Auth Service is running 🚀");
});

// ✅ Global error handler (optional)
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const isProduction = process.env.NODE_ENV === "production";

    if (!isProduction) {
      // Show full error in development
      console.error("Unhandled error:", err);
    }

    const statusCode = err instanceof ApiError ? err.statusCode : 500;
    const message =
      err instanceof ApiError ? err.message : "Internal server error";

    res.status(statusCode).json({ error: message });
  }
);

// --- Serve static frontend (production only) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distPath = join(__dirname, "../../frontend/dist");

app.use(express.static(distPath));

// Fallback for SPA routes
app.use((req, res) => {
  res.sendFile(join(distPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
