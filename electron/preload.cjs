// Minimal preload for Fragilume.
// Context-isolated; exposes only the app version to the renderer for now.
// Extend cautiously — do NOT expose ipcRenderer or Node APIs directly.

const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("fragilume", {
  platform: process.platform,
  versions: {
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node,
  },
  // Read from package.json at build time if you need a custom version string.
  appVersion: "v0.1",
});
