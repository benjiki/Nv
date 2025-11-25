const { app, BrowserWindow } = require("electron");
const path = require("path");
const isDev = process.env.NODE_ENV === "development";

// --- Import the backend start function ---
const { startServer } = require("../backend/dist/index.js");

async function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isDev) {
    const waitOn = require("wait-on");
    // Wait for Vite dev server
    await waitOn({ resources: ["http://localhost:5173"], timeout: 10000 });
    win.loadURL("http://localhost:5173");
  } else {
    // Start backend server manually
    startServer();
    // Wait briefly for server to start
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Load frontend served by backend
    win.loadURL("http://localhost:5174");
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
