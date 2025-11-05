import express from "express";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5174;

app.use(express.json());

// --- API routes ---
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Express + React + Electron!" });
});

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
