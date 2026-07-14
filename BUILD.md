# BUILD — Packaging Fragilume for Desktop &amp; Mobile

This document is **honest** about what works, what is scaffolded, and what requires a refactor. Read it end-to-end before running packaging commands.

Fragilume is a Next.js 16 App Router app that uses **API routes + Prisma/SQLite on the server**. That fact drives every packaging decision below.

```
┌───────────────────────────────────────────────────────────────┐
│  Browser UI (React)  ──►  /api/* (Next.js server)  ──►  SQLite │
│                         ▲ needs a Node.js runtime ▲             │
└───────────────────────────────────────────────────────────────┘
```

| Target        | Tool                       | Status             | Notes                                       |
| ------------- | -------------------------- | ------------------ | ------------------------------------------- |
| Windows .exe  | Electron + electron-builder | Scaffolded         | Recommended. Bundles Node runtime.          |
| Linux .AppImage | Electron + electron-builder | Scaffolded         | Same as above.                              |
| macOS .dmg    | Electron + electron-builder | Scaffolded         | Code signing optional (Apple Dev ID needed). |
| Android .apk  | Capacitor                  | **Requires refactor** | See section B.                              |
| iOS .ipa      | Capacitor                  | **Requires refactor** | Same as Android; macOS + Xcode required.    |
| All-in-one    | Tauri 2                    | Not scaffolded     | See section C.                              |

---

## A. Desktop packaging via Electron + electron-builder (RECOMMENDED)

### Why Electron?

Fragilume uses **Next.js API routes** (`/api/profiles`, `/api/books/...`, `/api/backup`, `/api/restore`) backed by **Prisma + SQLite**. Those run **only on a Node.js server**. Electron bundles a Node.js runtime, so the existing Next.js standalone server can run inside the desktop app **unchanged** — no refactor of the data layer needed.

Tauri/Capacitor wrap a *static* web app and cannot host API routes (see sections B and C).

### Step-by-step

#### 1. Build Next.js for production

```bash
bun run build
```

This produces `.next/standalone/` (a self-contained Node server) plus static assets. The `package.json` `build` script already copies `.next/static` and `public/` into `.next/standalone/`.

#### 2. Install desktop dev dependencies

```bash
bun add -D electron electron-builder concurrently wait-on cross-env
```

(These keys are already present in `package.json#devDependencies` as `"latest"` placeholders — `bun install` will resolve them.)

#### 3. Understand the scaffold

The following files are already created for you in this repo:

- [`electron/main.cjs`](./electron/main.cjs) — Electron main process. Spawns `.next/standalone/server.js` on `127.0.0.1:0` (random port), then opens a `BrowserWindow` (1280×800, min 900×600) that loads `http://127.0.0.1:${port}`. Handles `app.whenReady()`, `window-all-closed` (quit on non-mac), `activate` (re-create on mac).
- [`electron/preload.cjs`](./electron/preload.cjs) — Minimal preload; exposes `appVersion` via `contextBridge`.
- [`electron-builder.yml`](./electron-builder.yml) — `electron-builder` config: `appId: com.fragilume.app`, `productName: Fragilume`, files for `.next/standalone/**`, `electron/**`, `public/**`, with `asarUnpack` for the Prisma query-engine binaries. Targets:
  - **win** → NSIS installer (`.exe`)
  - **linux** → AppImage + `.deb`
  - **mac** → `.dmg` + `.zip`

#### 4. Prepare the icon

`electron-builder` requires a **512×512 PNG** named `build/icon.png` (and an `.icns` for macOS). Convert the SVG logo:

```bash
# Requires ImageMagick or Inkscape
mkdir -p build
convert -background none -density 1024 ./public/fragilume-logo.svg -resize 512x512 build/icon.png
# macOS icns (run on a Mac, or use png2icns on Linux)
mkdir -p build/icon.iconset
sips -z 512 512 build/icon.png --out build/icon.iconset/icon_512x512.png
iconutil -c icns build/icon.iconset -o build/icon.icns
```

If you skip this, `electron-builder` will use a default electron icon — fine for testing.

#### 5. Run desktop dev (live reload)

```bash
bun run electron:dev
```

This runs `next dev` on :3000, waits for it via `wait-on`, then launches Electron pointed at it. Edit any source and both Next.js and the Electron window hot-reload.

#### 6. Build per-platform installers

```bash
# Windows .exe (NSIS) — run on Windows or via Wine
bun run electron:build:win

# Linux .AppImage + .deb — run on Linux
bun run electron:build:linux

# macOS .dmg + .zip — run on macOS
bun run electron:build:mac

# All targets (uses host platform default)
bun run electron:build
```

Output lands in `electron-builder-out/` (git-ignored).

### Important caveats

#### Prisma query engine binaries

Prisma needs its native query engine (a `.node` binary) at runtime. The standalone output already includes the engine next to `@prisma/client`. To make sure Electron's `asar` archive doesn't hide it from the runtime, `electron-builder.yml` includes:

```yml
asarUnpack:
  - "**/.prisma/client/**"
  - "**/@prisma/client/**"
```

If you see `Error: Cannot find module … query engine …` at runtime, double-check that `asarUnpack` is present and that `bun run build` actually copied `.next/standalone/node_modules/@prisma/client` (it does, by default).

For fully offline builds, you may also need to set:

```bash
export PRISMA_ENGINES_MIRROR=https://binaries.prisma.sh
```

#### SQLite database path

In **development** the DB lives at `db/dev.db` (the `DATABASE_URL` in `.env`). In a **packaged** app you must write to a writable user directory — `app.getPath('userData')` — because the `app.asar` archive is read-only.

Two clean ways to do this:

**Option A — resolve `DATABASE_URL` at runtime (recommended).**

In `electron/main.cjs`, before spawning the Next.js server:

```js
const { app } = require("electron");
const path = require("path");
const fs = require("fs");

const userDataDir = app.getPath("userData");
const dbPath = path.join(userDataDir, "fragilume.db");
if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, ""); // create empty file

process.env.DATABASE_URL = `file:${dbPath}`;
// Now spawn the standalone server — it inherits this env var.
```

Then `prisma/schema.prisma` already reads `env("DATABASE_URL")` — no schema change needed.

> ⚠️ If you used `prisma migrate`, also copy the `migrations/` folder into the package and call `prisma migrate deploy` on first launch (in `main.cjs`, before spawning the server). For `prisma db push` (this project's default), the schema is created automatically on the first query — no extra step.

**Option B — bake the path into a small wrapper.** Write a tiny `db.ts` that resolves the URL the same way as Option A and re-exports the Prisma client. Less clean; not recommended.

#### Mac code signing (optional)

To distribute outside your own machine on macOS, you need:

1. An **Apple Developer ID** ($99/yr).
2. A **Developer ID Application certificate** + a **notarization** step.

`electron-builder.yml` ships with empty `notarize` config — fill in your Apple ID credentials when ready. For a portfolio project, you can skip signing entirely and tell users to right-click → Open the first time.

---

## B. Android `.apk` via Capacitor (with honest architectural note)

> **Read this twice.** Capacitor wraps a **static web app**. Fragilume currently relies on **Next.js API routes + Prisma/SQLite running on a Node server**. Those do **not** exist in a static export, so the app will not work as-is inside an APK.

You have three options. Pick one before touching Capacitor.

### Option 1 — Hosted (easiest, requires backend work)

Deploy Fragilume to Vercel/Netlify. Point the Capacitor app at the live URL. Data syncs to a server-side database (you'd swap SQLite for Postgres + Prisma, and add auth).

- ✅ No client refactor
- ❌ Requires a real backend, auth, and a hosted DB
- ❌ Offline support is weak

### Option 2 — Offline-first (RECOMMENDED for a portfolio)

Refactor the data layer to use **client-side storage** so the entire app runs as a static bundle. Replace every `fetch("/api/...")` call in `src/lib/` and `src/components/app/` with a direct local DB call.

Two good client stores:

- **`@capacitor-community/sqlite`** — native SQLite on Android/iOS via Capacitor. Closest to the existing Prisma schema.
- **Dexie (IndexedDB)** — pure JS, works in browser + Capacitor, simpler to set up.

**Estimated effort: 1–2 days** for the data-layer swap (one CRUD module per Prisma model: Profile, Book, PlotNode, WorldEntry, WikiEntry).

#### Migration mapping (Prisma → client SQLite / Dexie)

| Prisma model   | Client table / store | Notes                                              |
| -------------- | -------------------- | -------------------------------------------------- |
| `Profile`      | `profiles`           | `id`, `penName`, `bio`, `createdAt`, `updatedAt`   |
| `Book`         | `books`              | `+ profileId` foreign key                           |
| `PlotNode`     | `plot_nodes`         | `+ bookId`                                          |
| `WorldEntry`   | `world_entries`      | `+ bookId`                                          |
| `WikiEntry`    | `wiki_entries`       | `+ bookId`, `tags` (CSV string or JSON array)       |

Keep the existing `src/lib/types.ts` and `src/lib/domain.ts` constants — they're UI-only and don't depend on Prisma. Only `src/lib/store.ts` (the fetch calls) and any direct `fetch("/api/...")` in components need rewiring to the new local DB.

#### Step-by-step (after the refactor)

```bash
# 1. Add Capacitor
bun add @capacitor/core @capacitor/cli @capacitor/android
bun add @capacitor-community/sqlite   # or: bun add dexie

# 2. Initialize Capacitor (webDir = static export output)
bunx cap init Fragilume com.fragilume.app --web-dir=out

# 3. Enable static export in next.config.ts
#    (NOTE: this disables API routes — that's why Option 2 refactor is required)
#    output: "export"   ← add this
#    images: { unoptimized: true }

# 4. Build the static export
bun run build     # produces ./out/

# 5. Add the Android platform
bunx cap add android

# 6. Sync web assets into the native project
bunx cap sync

# 7. Open in Android Studio and build the APK
bunx cap open android
# In Android Studio: Build → Build Bundle(s) / APK(s) → Build APK(s)
```

The `package.json` already includes the helper scripts:

```bash
bun run cap:init          # cap init Fragilume com.fragilume.app --web-dir=out
bun run cap:add:android   # cap add android
bun run cap:sync          # cap sync
```

> **iOS** is the same flow with `@capacitor/ios` and `bunx cap add ios`. Requires macOS + Xcode.

### Option 3 — WebView + local Node server (EXPERIMENTAL)

Bundle a Node.js runtime inside the APK using [`nodejs-mobile`](https://github.com/staltz/nodejs-mobile) and run the existing Next.js server inside it.

- ✅ Preserves all existing code
- ❌ Adds ~40MB to the APK
- ❌ Experimental; fiddly on modern Android
- ❌ Not recommended for a portfolio unless you specifically want to show it off

Document this option only if you actually attempt it. Otherwise stick with Option 2.

---

## C. Tauri 2 (alternative — single tool for all targets)

[Tauri 2](https://tauri.app) can produce desktop **and** mobile binaries from one toolchain with tiny installers (a few MB instead of Electron's ~80MB).

Trade-off: Tauri's frontend is a static web view, so it has the **same API-route limitation as Capacitor** — you must refactor to client-side storage (Option 2 above) before Tauri will work.

When to choose Tauri over Electron:

- You want a single tool for desktop + mobile.
- You're OK installing the Rust toolchain.
- You're OK doing the Option 2 client-storage refactor up front.

Quickstart (after the refactor):

```bash
bun add -D @tauri-apps/cli
bunx tauri init
bunx tauri dev          # desktop
bunx tauri build        # .exe / .AppImage / .dmg
bunx tauri android dev  # Android
bunx tauri ios dev      # iOS (macOS only)
```

See https://tauri.app for full docs.

---

## TL;DR

- **For a portfolio**: ship the desktop app via Electron (`bun run electron:build:linux` on Linux, `:win` on Windows, `:mac` on macOS). It just works with the existing code.
- **For mobile**: do the Option 2 client-storage refactor first (1–2 days), then Capacitor → `.apk`.
- **For one-tool-to-rule-them-all**: Tauri 2, but only after the same refactor.
