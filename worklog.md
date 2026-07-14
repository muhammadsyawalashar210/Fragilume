# Worklog — Writer's Studio App

Project: A desktop-app-style web application for novel/comic/film/game writers.
Stack: Next.js 16, TypeScript, Tailwind CSS 4, shadcn/ui, Prisma (SQLite), Zustand, next-themes.

---
Task ID: 1
Agent: main
Task: Set up Prisma schema (Author, Book, PlotNode, WorldEntry, WikiEntry) and push to DB

Work Log:
- Designed data model for a writer's studio with author + books + three editing domains (plot, world building, wiki).
- Wrote prisma/schema.prisma with models: Author, Book, PlotNode, WorldEntry, WikiEntry.
- Ran prisma db push to create tables.

Stage Summary:
- DB schema ready. Each book owns plot nodes, world entries, and wiki entries. Author is a singleton pen-name record.

---
Task ID: 2-6
Agent: main
Task: Build full frontend (app shell, onboarding, dashboard, edit book with plot/world/wiki)

Work Log:
- Added ThemeProvider (next-themes) + warm amber `--brand` accent in globals.css; default theme dark.
- Built WindowChrome title bar (desktop-app feel) + StatusBar footer (sticky bottom).
- Built FloatingSidebar: floating glass pill, monochrome Lucide icons (black in light / white in dark via text-foreground), Dashboard + Edit Buku (expandable subtree with Plot / World Building / Wiki appearing below it), author avatar.
- Onboarding: first-run screen asking for nama pena (pen name) -> POST /api/author.
- Dashboard: book grid with covers, search, type filter chips, create/edit (rename)/delete via dropdown + AlertDialog, status/genre/counts, relative dates (id locale).
- Book editor container: header with back-to-dashboard, book meta, tabs (Plot/World Building/Wiki) + Edit Book dialog.
- Plot/World/Wiki editors: master-detail layout, searchable lists, autosave (debounced) detail editors with kind/category/tags selects.
- Created API routes: /api/author, /api/books, /api/books/[id], /api/books/[id]/(plot|world|wiki) and their [nodeId|entryId] PATCH/DELETE.
- Lint passes clean (0 errors, 0 warnings).

Stage Summary:
- App is feature-complete: onboarding -> dashboard -> create/edit/delete books -> per-book Plot/World Building/Wiki editors with autosave. Floating sidebar + dark/light theme + status bar.

---
Task ID: 8
Agent: main
Task: Self-verify with Agent Browser (rendering, interactions, sticky layout, theme)

Work Log:
- Opened http://localhost:3000 — onboarding rendered ("Siapa nama pena Anda?").
- Filled pen name "Tania Rengganis" → submitted → dashboard loaded with greeting + success toast.
- Created a book (Novel, violet accent) via dialog — appeared on dashboard grid with cover + meta.
- Opened book → editor with Plot/World Building/Wiki tabs; sidebar auto-expanded the "Edit Buku" subtree (Plot/World Building/Wiki below it).
- Created a plot node, edited title/summary/content — autosave persisted after full page reload (verified "Bab 1: Jam Tujuh" survived).
- Switched to World Building and Wiki via sidebar sub-items — both editors work; created entries.
- Theme toggle dark↔light works (button label flips; icons are text-foreground so black on light / white on dark).
- Renamed book via card menu → "Edit / Ganti Nama" → persisted.
- Deleted book via card menu → "Hapus" → confirmation dialog → empty state shown.
- No runtime/console errors throughout (only HMR logs).
- Footer (status bar) verified pinned to viewport bottom: footerBottom === viewportHeight, no floating gap.
- Mobile (390x844) responsive: dashboard grid + editor master-detail stack correctly.

Stage Summary:
- All golden-path flows verified end-to-end in the browser: onboarding → dashboard → create/edit/rename/delete books → per-book Plot/World Building/Wiki editors with autosave. App is interactive, responsive, theme-aware, and error-free.

---
Task ID: 9-14
Agent: main
Task: Multi-profile + mobile drawer nav + Settings (profiles/theme/backup-restore) + cleaner layout

Work Log:
- Schema: renamed Author→Profile, Book.authorId→profileId (force-reset DB, regenerated Prisma client). Restarted dev server to clear stale module cache.
- API: /api/profiles (GET list w/ book counts, POST create); /api/profiles/[id] (PATCH, DELETE cascade); /api/books now filters by ?profileId and requires profileId on create; /api/backup (GET full JSON dump of profiles+books+entries); /api/restore (POST — wipes + re-inserts from payload, validates).
- Store: added profiles[], activeProfileId/activeProfile (persisted to localStorage 'ws-active-profile'), view now includes 'settings', mobileNavOpen state.
- Nav refactor (nav-rail.tsx): shared NavContent(showLabels) reused by (a) desktop FloatingSidebar (icon-only floating pill, hidden md:block) and (b) MobileTopBar (hamburger + app name + settings gear, md:hidden) + MobileNavDrawer (slide-out from left with backdrop, closes on nav tap or backdrop, body-scroll lock). Added Settings (gear) nav item. Edit Buku subtree shows "pilih buku" hint when no book selected.
- SettingsView: three cards — Profiles (list with active badge, Activate/Edit/Delete, add via ProfileFormDialog), Tampilan (Terang/Gelap/Sistem via next-themes, enableSystem), Backup & Restore (Ekspor via File System Access API showSaveFilePicker startIn:'documents' with download fallback; Impor via showOpenFilePicker; info box explaining .json format + Documents default).
- ThemeProvider: enableSystem=true. Removed standalone theme-toggle (theme now controlled in Settings).
- Onboarding/Dashboard/StatusBar updated for active profile; Dashboard keyed by activeProfileId so switching profile refetches books.
- Backup client (lib/backup.ts): exportBackup/importBackup with FS Access API + input fallback, AbortError treated as silent cancel.

Verification (Agent Browser):
- Onboarding → created profile "Tania Rengganis" → dashboard.
- Settings: added 2nd profile "K. Nara"; activated it → dashboard showed empty separate bookshelf (profiles isolated ✓).
- Backup API returns full JSON (2 profiles). Restore API tested with modified backup (added book) → 200, book appeared in correct profile's shelf ✓.
- Theme: dark→light class switch verified on <html> ✓.
- Mobile (390x844): top bar (hamburger+gear), floating sidebar hidden; drawer slides in with labeled items + backdrop; tapping a nav item closes drawer + navigates ✓. Footer pinned to viewport bottom on mobile (footerBottom===vh) ✓.
- Desktop (1280): floating rail restored, no hamburger ✓.
- No runtime/console errors. Lint clean (0/0).

Stage Summary:
- Mobile = top navbar + slide-out left drawer (closes on backdrop/nav tap). Desktop = floating rail. Settings page = profiles CRUD + theme (light/dark/system) + backup/restore (.json, defaults to OS Documents folder via File System Access API, download fallback). Multi-profile with isolated bookshelves. All verified end-to-end.
