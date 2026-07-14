// Electron main process for Fragilume.
//
// Spawns the Next.js standalone server (built with `bun run build` → .next/standalone/server.js)
// on a random local port, then opens a BrowserWindow that loads http://127.0.0.1:${port}.
//
// See ../BUILD.md for full packaging instructions and caveats (Prisma engine + SQLite path).

const { app, BrowserWindow, shell } = require("electron");
const path = require("node:path");
const fs = require("node:fs");
const { spawn } = require("node:child_process");

const isDev = process.env.NODE_ENV === "development";
const DEV_SERVER_URL = "http://127.0.0.1:3000";

// ---- SQLite DB path (production) -------------------------------------------
// In a packaged app, .next/standalone is read-only inside app.asar, so we MUST
// point Prisma's DATABASE_URL at a writable user directory. See BUILD.md §A.
if (!isDev) {
  const userDataDir = app.getPath("userData");
  const dbPath = path.join(userDataDir, "fragilume.db");
  if (!fs.existsSync(dbPath)) {
    // Create an empty file so `file:` URL doesn't error on first launch.
    fs.writeFileSync(dbPath, "");
  }
  process.env.DATABASE_URL = `file:${dbPath}`;
}

// ---- Spawn the Next.js standalone server (production only) ------------------
let nextServer = null;

function startNextServer() {
  // .next/standalone/server.js is produced by `bun run build`.
  // In a packaged app, app.getAppPath() points inside the asar; the standalone
  // output is shipped alongside electron/main.cjs per electron-builder.yml.
  const standaloneDir = isDev
    ? null
    : path.join(process.resourcesPath, ".next", "standalone");
  if (!standaloneDir || !fs.existsSync(path.join(standaloneDir, "server.js"))) {
    console.error(
      "[fragilume] standalone server not found. Run `bun run build` first."
    );
    return null;
  }

  nextServer = spawn(process.execPath, ["server.js"], {
    cwd: standaloneDir,
    env: {
      ...process.env,
      NODE_ENV: "production",
      ELECTRON_RUN_AS_NODE: "1", // run the bundled Node, not a new Electron window
      PORT: "3000", // fixed port for simple loadURL below; use 0 + stdout parsing for random
      HOSTNAME: "127.0.0.1",
    },
    stdio: ["pipe", "pipe", "pipe"],
  });

  nextServer.stdout.on("data", (d) => process.stdout.write(d));
  nextServer.stderr.on("data", (d) => process.stderr.write(d));
  nextServer.on("exit", (code) =>
    console.log(`[fragilume] Next.js server exited with code ${code}`)
  );
  return nextServer;
}

// ---- Window ----------------------------------------------------------------
let mainWindow = null;

function createWindow(url) {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: "#0b0b0c",
    title: "Fragilume",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.loadURL(url);

  // Open external links in the system browser, not inside the app.
  mainWindow.webContents.setWindowOpenHandler(({ url: target }) => {
    if (target.startsWith("http://") || target.startsWith("https://")) {
      shell.openExternal(target);
      return { action: "deny" };
    }
    return { action: "allow" };
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// ---- Lifecycle -------------------------------------------------------------
app.whenReady().then(() => {
  if (isDev) {
    createWindow(DEV_SERVER_URL);
  } else {
    startNextServer();
    // Retry the load — the standalone server takes ~1s to boot.
    const tryLoad = (attemptsLeft) => {
      if (!mainWindow) createWindow("http://127.0.0.1:3000");
      const handler = () => {
        if (mainWindow && attemptsLeft > 0) {
          setTimeout(() => tryLoad(attemptsLeft - 1), 1000);
        }
      };
      mainWindow.webContents.once("did-fail-load", handler);
    };
    setTimeout(() => tryLoad(5), 800);
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow(isDev ? DEV_SERVER_URL : "http://127.0.0.1:3000");
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    if (nextServer) nextServer.kill();
    app.quit();
  }
});

app.on("before-quit", () => {
  if (nextServer) nextServer.kill();
});
