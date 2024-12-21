// import env from "@/env";
import { app, BrowserWindow, ipcMain } from "electron";
import { spawn } from "node:child_process";
import path from "node:path";
import "dotenv";

class ElectronApp {
  mainWindow = null;
  backendProcess = null;
  requestCount = 0;
  startTime = Date.now();

  constructor() {
    this.initializeApp();
    this.setupIpcHandlers();
  }

  initializeApp() {
    app.on("ready", this.createWindow.bind(this));

    app.on("window-all-closed", () => {
      if (process.platform !== "darwin") {
        this.cleanup();
        app.quit();
      }
    });

    app.on("activate", () => {
      if (this.mainWindow === null) {
        this.createWindow();
      }
    });
  }

  setupIpcHandlers() {
    ipcMain.on("restart-server", () => {
      this.restartBackend();
    });

    ipcMain.on("open-devtools", () => {
      this.mainWindow?.webContents.openDevTools();
    });

    setInterval(() => {
      const uptime = this.formatUptime(Date.now() - this.startTime);
      this.mainWindow?.webContents.send("server-uptime", uptime);
    }, 1000);
  }

  formatUptime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  pad(num) {
    return num.toString().padStart(2, "0");
  }

  createWindow() {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    this.mainWindow.loadFile(path.join(import.meta.dirname, "index.html"));

    this.startBackend();

    this.mainWindow.on("closed", () => {
      this.mainWindow = null;
      this.cleanup();
    });
  }

  startBackend() {
    this.backendProcess = spawn("bun", ["run", "dev"], {
      stdio: "inherit",
      env: {
        // eslint-disable-next-line node/no-process-env
        ...process.env,
        ELECTRON_RUN: "true",
      },
    });

    this.backendProcess.on("error", (err) => {
      console.error("Failed to start backend process:", err);
    });
  }

  cleanup() {
    if (this.backendProcess) {
      try {
        this.backendProcess.kill();
      }
      catch (err) {
        console.error("Error killing backend process:", err);
      }
    }
  }

  restartBackend() {
    if (this.backendProcess) {
      try {
        this.backendProcess.kill();
      }
      catch (err) {
        console.error("Error killing existing backend process:", err);
      }
    }

    this.startTime = Date.now();

    this.mainWindow?.webContents.send("server-status", "Restarting");

    this.startBackend();
  }
}

// eslint-disable-next-line no-new
new ElectronApp();
