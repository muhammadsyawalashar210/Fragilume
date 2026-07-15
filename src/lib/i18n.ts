// Internationalization dictionary for Fragilume.
// Locale "id" is the source of truth; "en-US" mirrors the same keys.
// Interpolation: t("key", { name: "Tania" }) replaces {name} in the string.

export type Locale = "id" | "en-US";

export const DEFAULT_LOCALE: Locale = "id";

export const LOCALE_STORAGE_KEY = "fragilume-locale";

export type LocaleMeta = {
  code: Locale;
  label: string; // native name
  englishLabel: string; // English name
  flag: "id" | "us";
};

export const LOCALES: LocaleMeta[] = [
  {
    code: "id",
    label: "Bahasa Indonesia",
    englishLabel: "Indonesian",
    flag: "id",
  },
  {
    code: "en-US",
    label: "English (US)",
    englishLabel: "English (United States)",
    flag: "us",
  },
];

// The dictionary. Keys are flat dot-notation strings.
const id: Record<string, string> = {
  // ---- Common ----
  "common.cancel": "Batal",
  "common.delete": "Hapus",
  "common.add": "Tambah",
  "common.save": "Simpan",
  "common.saving": "Menyimpan…",
  "common.saved": "Tersimpan",
  "common.create": "Buat",
  "common.edit": "Edit",
  "common.open": "Buka",
  "common.back": "Kembali",
  "common.loading": "Memuat…",
  "common.error": "Terjadi kesalahan",
  "common.tryAgain": "Coba lagi nanti.",

  // ---- App / brand ----
  "app.tagline": "Studio catatan untuk penulis novel, komik, film & game",
  "app.dataLocal": "data tersimpan lokal di perangkat ini",

  // ---- Navigation ----
  "nav.dashboard": "Dashboard",
  "nav.editBook": "Edit Buku",
  "nav.plot": "Plot",
  "nav.worldBuilding": "World Building",
  "nav.wiki": "Wiki",
  "nav.settings": "Pengaturan",
  "nav.dashboardDesc": "Rak buku Anda",
  "nav.editBookDesc": "Plot · World Building · Wiki",
  "nav.plotDesc": "Struktur cerita",
  "nav.worldDesc": "Dunia cerita",
  "nav.wikiDesc": "Karakter & ensiklopedia",
  "nav.settingsDesc": "Profil, tema, backup",
  "nav.openMenu": "Buka menu",
  "nav.closeMenu": "Tutup menu",
  "nav.minimize": "Minimalkan",
  "nav.maximize": "Maksimalkan",
  "nav.close": "Tutup",
  "nav.noProfile": "Tanpa profil",
  "nav.noName": "Tanpa nama",
  "nav.openSettings": "Buka pengaturan",
  "nav.manageProfile": "Kelola profil",
  "nav.selectBook": "pilih buku",

  // ---- Status bar ----
  "status.dashboard": "Dashboard",
  "status.editorPlot": "Editor Plot",
  "status.editorWorld": "Editor World Building",
  "status.editorWiki": "Editor Wiki",
  "status.settings": "Pengaturan",
  "status.savedLocal": "Tersimpan lokal",

  // ---- Onboarding ----
  "onboarding.firstRun": "Pertama kali di sini — mari atur profil Anda",
  "onboarding.title": "Siapa nama pena Anda?",
  "onboarding.subtitle":
    "Nama pena ini adalah profil pertama Anda. Setiap profil punya rak bukunya sendiri. Anda bisa menambah profil lain nanti di Pengaturan.",
  "onboarding.penName": "Nama Pena",
  "onboarding.penNameRequired": "Nama pena diperlukan",
  "onboarding.penNameHint": "Masukkan nama pena Anda untuk memulai.",
  "onboarding.bio": "Bio singkat",
  "onboarding.bioOptional": "(opsional)",
  "onboarding.bioPlaceholder":
    "Ceritakan sedikit tentang diri atau genre yang Anda tulis.",
  "onboarding.start": "Mulai Menulis",
  "onboarding.preparing": "Menyiapkan studio…",
  "onboarding.welcome": "Selamat datang, {name}!",
  "onboarding.studioReady": "Studio Anda siap digunakan.",
  "onboarding.footer":
    "{app} · {version} — data disimpan secara lokal di perangkat ini. Backup tersedia di Pengaturan.",

  // ---- Dashboard ----
  "dashboard.badge": "DASHBOARD",
  "dashboard.welcome": "Selamat datang, {name}",
  "dashboard.writerFallback": "Penulis",
  "dashboard.subtitle":
    "Kelola semua karya Anda di satu rak. Buat, atur, edit, dan hapus buku dengan bebas.",
  "dashboard.createBook": "Buat Buku",
  "dashboard.search": "Cari judul, genre…",
  "dashboard.all": "Semua",
  "dashboard.errorLoad": "Gagal memuat buku.",
  "dashboard.errorLoadShelf": "Gagal memuat rak buku",
  "dashboard.deleted": "Buku dihapus",
  "dashboard.deletedDesc": "\"{title}\" telah dihapus.",
  "dashboard.errorDelete": "Gagal menghapus buku.",
  "dashboard.errorDeleteTitle": "Gagal menghapus",
  "dashboard.deleteTitle": "Hapus buku ini?",
  "dashboard.deleteDesc":
    "Buku \"{title}\" beserta semua plot, world building, dan wiki di dalamnya akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.",
  "dashboard.openBook": "Buka",
  "dashboard.editRename": "Edit / Ganti Nama",
  "dashboard.bookOptions": "Opsi buku",
  "dashboard.noMatch": "Tidak ada buku yang cocok",
  "dashboard.empty": "Rak buku Anda masih kosong",
  "dashboard.noMatchDesc":
    "Coba ubah kata kunci pencarian atau filter jenis karya.",
  "dashboard.emptyDesc":
    "Mulai buat buku pertama Anda — novel, komik, plot film, atau game. Semua bisa diatur dari sini.",
  "dashboard.createFirst": "Buat Buku Pertama",

  // ---- Book editor ----
  "editor.errorLoad": "Gagal memuat buku",
  "editor.errorLoadDesc": "Buka dashboard dan coba lagi.",
  "editor.editBook": "Edit Buku",
  "editor.noBookTitle": "Belum ada buku dipilih",
  "editor.noBookDesc":
    "Pilih buku dari dashboard untuk mulai mengedit plot, world building, atau wiki.",
  "editor.openDashboard": "Buka Dashboard",

  // ---- Plot editor ----
  "plot.structure": "Struktur Plot",
  "plot.search": "Cari bab/adegan…",
  "plot.newSection": "Bagian Baru",
  "plot.noSummary": "Tanpa ringkasan",
  "plot.deleteTitle": "Hapus bagian ini?",
  "plot.deleteDesc": "\"{title}\" akan dihapus dari struktur plot.",
  "plot.editorLabel": "Editor Plot",
  "plot.titlePlaceholder": "Judul bab / adegan…",
  "plot.kind": "Jenis",
  "plot.summary": "Ringkasan",
  "plot.summaryPlaceholder": "Satu kalimat singkat tentang bagian ini.",
  "plot.content": "Naskah / Catatan",
  "plot.contentPlaceholder": "Tulis adegan, dialog, atau catatan plot di sini…",

  // ---- World editor ----
  "world.search": "Cari lokasi, budaya…",
  "world.newEntry": "Entri Dunia Baru",
  "world.noun": "entri dunia",
  "world.deleteTitle": "Hapus entri ini?",
  "world.deleteDesc": "\"{title}\" akan dihapus dari world building.",
  "world.editorLabel": "World Building",
  "world.titlePlaceholder": "Nama lokasi / budaya / sistem…",
  "world.category": "Kategori",
  "world.content": "Deskripsi & Detail",
  "world.contentPlaceholder":
    "Geografi, sejarah, budaya, aturan magis, teknologi… jelaskan detail dunia Anda.",

  // ---- Wiki editor ----
  "wiki.listTitle": "Wiki Karya",
  "wiki.search": "Cari karakter, item…",
  "wiki.newEntry": "Entri Wiki Baru",
  "wiki.noun": "entri wiki",
  "wiki.deleteTitle": "Hapus entri wiki ini?",
  "wiki.deleteDesc": "\"{title}\" akan dihapus dari wiki.",
  "wiki.editorLabel": "Wiki",
  "wiki.titlePlaceholder": "Nama karakter / item / faksi…",
  "wiki.category": "Kategori",
  "wiki.tags": "Tag (pisahkan dengan koma)",
  "wiki.tagsPlaceholder": "protagonis, ksatria, api",
  "wiki.content": "Deskripsi",
  "wiki.contentPlaceholder":
    "Latar belakang, sifat, penampilan, hubungan, kekuatan…",

  // ---- Master detail ----
  "masterDetail.selectHint": "Pilih item di sebelah kiri untuk mulai mengedit.",

  // ---- List empty (shared) ----
  "listEmpty.noMatch": "Tidak ada yang cocok.",
  "listEmpty.empty": "Belum ada {noun}.",

  // ---- Book form dialog ----
  "bookForm.titleRequired": "Judul wajib diisi",
  "bookForm.titleHint": "Beri judul untuk buku Anda.",
  "bookForm.noProfile": "Profil aktif tidak ditemukan.",
  "bookForm.errorSave": "Gagal menyimpan buku.",
  "bookForm.created": "Buku dibuat",
  "bookForm.updated": "Perubahan disimpan",
  "bookForm.createdDesc": "\"{title}\" siap. Klik untuk mulai mengedit.",
  "bookForm.updatedDesc": "\"{title}\" siap.",
  "bookForm.createTitle": "Buat Buku Baru",
  "bookForm.editTitle": "Edit Buku",
  "bookForm.createDesc": "Mulai proyek baru — novel, komik, plot film, atau game.",
  "bookForm.editDesc": "Ubah detail buku Anda.",
  "bookForm.titleLabel": "Judul",
  "bookForm.titlePlaceholder": "cth. Senja di Kota Tua",
  "bookForm.typeLabel": "Jenis Karya",
  "bookForm.statusLabel": "Status",
  "bookForm.genreLabel": "Genre",
  "bookForm.genrePlaceholder": "cth. Fantasi, Romansa, Thriller",
  "bookForm.descLabel": "Sinopsis / Deskripsi",
  "bookForm.descPlaceholder": "Ringkasan singkat tentang karya ini.",
  "bookForm.coverColor": "Warna Sampul",
  "bookForm.colorLabel": "Warna {color}",
  "bookForm.createBtn": "Buat Buku",
  "bookForm.saveBtn": "Simpan",

  // ---- Profile form dialog ----
  "profileForm.nameRequired": "Nama pena wajib diisi",
  "profileForm.errorSave": "Gagal menyimpan profil.",
  "profileForm.created": "Profil dibuat",
  "profileForm.updated": "Profil diperbarui",
  "profileForm.createTitle": "Tambah Profil",
  "profileForm.editTitle": "Edit Profil",
  "profileForm.createDesc":
    "Buat profil penulis baru. Tiap profil punya rak buku sendiri.",
  "profileForm.editDesc": "Ubah nama pena atau bio profil ini.",
  "profileForm.nameLabel": "Nama Pena",
  "profileForm.namePlaceholder": "cth. Tania Rengganis",
  "profileForm.bioLabel": "Bio (opsional)",
  "profileForm.bioPlaceholder": "Ceritakan sedikit tentang penulis ini.",
  "profileForm.createBtn": "Buat",

  // ---- Settings ----
  "settings.badge": "PENGATURAN",
  "settings.title": "Pengaturan",
  "settings.subtitle":
    "Kelola profil penulis, tampilan, dan backup data studio Anda.",

  // Profiles section
  "settings.profiles.title": "Profil Penulis",
  "settings.profiles.desc": "Tiap profil punya rak buku sendiri.",
  "settings.profiles.add": "Tambah",
  "settings.profiles.empty": "Belum ada profil.",
  "settings.profiles.active": "Aktif",
  "settings.profiles.activate": "Aktifkan",
  "settings.profiles.editProfile": "Edit profil",
  "settings.profiles.deleteProfile": "Hapus profil",
  "settings.profiles.noBio": "Tanpa bio",
  "settings.profiles.bookCount": "{count} buku",
  "settings.profiles.deleteTitle": "Hapus profil ini?",
  "settings.profiles.deleteDesc":
    "Profil \"{name}\" beserta semua buku, plot, world building, dan wiki di dalamnya akan dihapus permanen.",
  "settings.profiles.deleted": "Profil dihapus",
  "settings.profiles.deletedDesc":
    "\"{name}\" beserta semua bukunya telah dihapus.",
  "settings.profiles.errorDelete": "Gagal menghapus",
  "settings.profiles.errorDeleteMsg": "Gagal menghapus profil.",
  "settings.profiles.errorLoadMsg": "Gagal memuat profil.",
  "settings.profiles.errorLoadTitle": "Gagal memuat profil",
  "settings.profiles.activated": "Profil aktif diganti",

  // Theme section
  "settings.theme.title": "Tampilan",
  "settings.theme.desc": "Pilih mode terang, gelap, atau ikut sistem.",
  "settings.theme.light": "Terang",
  "settings.theme.lightDesc": "Mode terang",
  "settings.theme.dark": "Gelap",
  "settings.theme.darkDesc": "Mode gelap",
  "settings.theme.system": "Sistem",
  "settings.theme.systemDesc": "Ikut sistem",

  // Accent section
  "settings.accent.title": "Warna Aksen",
  "settings.accent.desc": "Personalisasi warna utama studio Anda.",
  "settings.accent.updated": "Aksen diperbarui",
  "settings.accent.updatedDesc": "Warna utama: {name}",
  "settings.accent.hint":
    "Aksen diterapkan ke seluruh studio: sidebar, tombol utama, indikator aktif, dan fokus ring. Pilihan disimpan di perangkat ini.",

  // Language section
  "settings.language.title": "Bahasa",
  "settings.language.desc": "Pilih bahasa antarmuka aplikasi.",
  "settings.language.updated": "Bahasa diperbarui",
  "settings.language.hint":
    "Pilihan bahasa disimpan di perangkat ini dan langsung diterapkan ke seluruh studio.",

  // Backup section
  "settings.backup.title": "Backup & Restore",
  "settings.backup.desc":
    "Ekspor seluruh studio ke satu file, atau pulihkan dari backup.",
  "settings.backup.export": "Ekspor Backup",
  "settings.backup.exporting": "Mengekspor…",
  "settings.backup.import": "Impor / Restore",
  "settings.backup.importing": "Memulihkan…",
  "settings.backup.exportOk": "Backup berhasil disimpan",
  "settings.backup.exportOkFs": "File tersimpan ke folder Documents.",
  "settings.backup.exportOkDl": "File diunduh ke folder unduhan.",
  "settings.backup.exportFail": "Gagal backup",
  "settings.backup.importOk": "Backup berhasil dipulihkan",
  "settings.backup.importOkDesc": "{profiles} profil · {books} buku.",
  "settings.backup.importFail": "Gagal restore",
  "settings.backup.aboutTitle": "Tentang format & penyimpanan",
  "settings.backup.fmtJson":
    "Format file: .json — menyimpan semua profil, buku, plot, world building, & wiki secara utuh dan bisa dipulihkan.",
  "settings.backup.fmtDocs":
    "File disimpan ke folder Documents default (Windows lokal/OneDrive, macOS, Linux). Pada browser tanpa File System Access, file akan diunduh ke folder unduhan.",
  "settings.backup.fmtRestore":
    "Restore mengganti seluruh data saat ini dengan isi file backup.",

  // ---- Domain labels ----
  // Book types
  "bookType.Novel": "Novel",
  "bookType.Komik": "Komik",
  "bookType.Film": "Film",
  "bookType.Game": "Game",
  "bookType.Lainnya": "Lainnya",
  // Book statuses
  "bookStatus.draft": "Draf",
  "bookStatus.writing": "Menulis",
  "bookStatus.editing": "Revisi",
  "bookStatus.done": "Selesai",
  // Plot kinds
  "plotKind.act": "Adegan Besar",
  "plotKind.chapter": "Bab",
  "plotKind.scene": "Adegan",
  "plotKind.beat": "Beat",
  "plotKind.note": "Catatan",
  // World categories
  "worldCategory.location": "Lokasi",
  "worldCategory.culture": "Budaya",
  "worldCategory.history": "Sejarah",
  "worldCategory.magic": "Sistem Magis",
  "worldCategory.tech": "Teknologi",
  "worldCategory.religion": "Agama & Mitos",
  "worldCategory.geography": "Geografi",
  "worldCategory.lore": "Lore",
  "worldCategory.other": "Lainnya",
  // Wiki categories
  "wikiCategory.character": "Karakter",
  "wikiCategory.item": "Item",
  "wikiCategory.faction": "Faksi",
  "wikiCategory.location": "Lokasi",
  "wikiCategory.event": "Peristiwa",
  "wikiCategory.concept": "Konsep",
  "wikiCategory.other": "Lainnya",

  // ---- CRUD hook errors ----
  "crud.errorLoad": "Gagal memuat data",
  "crud.errorLoadMsg": "Gagal memuat data.",
  "crud.errorCreate": "Gagal membuat item",
  "crud.errorCreateMsg": "Gagal membuat item.",
  "crud.errorSave": "Gagal menyimpan",
  "crud.errorSaveMsg": "Gagal menyimpan.",
  "crud.errorDelete": "Gagal menghapus",
  "crud.errorDeleteMsg": "Gagal menghapus.",
};

const enUS: Record<string, string> = {
  // ---- Common ----
  "common.cancel": "Cancel",
  "common.delete": "Delete",
  "common.add": "Add",
  "common.save": "Save",
  "common.saving": "Saving…",
  "common.saved": "Saved",
  "common.create": "Create",
  "common.edit": "Edit",
  "common.open": "Open",
  "common.back": "Back",
  "common.loading": "Loading…",
  "common.error": "Something went wrong",
  "common.tryAgain": "Please try again later.",

  // ---- App / brand ----
  "app.tagline": "A note studio for novel, comic, film & game writers",
  "app.dataLocal": "data stored locally on this device",

  // ---- Navigation ----
  "nav.dashboard": "Dashboard",
  "nav.editBook": "Edit Book",
  "nav.plot": "Plot",
  "nav.worldBuilding": "World Building",
  "nav.wiki": "Wiki",
  "nav.settings": "Settings",
  "nav.dashboardDesc": "Your bookshelf",
  "nav.editBookDesc": "Plot · World Building · Wiki",
  "nav.plotDesc": "Story structure",
  "nav.worldDesc": "Story world",
  "nav.wikiDesc": "Characters & encyclopedia",
  "nav.settingsDesc": "Profile, theme, backup",
  "nav.openMenu": "Open menu",
  "nav.closeMenu": "Close menu",
  "nav.minimize": "Minimize",
  "nav.maximize": "Maximize",
  "nav.close": "Close",
  "nav.noProfile": "No profile",
  "nav.noName": "No name",
  "nav.openSettings": "Open settings",
  "nav.manageProfile": "Manage profile",
  "nav.selectBook": "select book",

  // ---- Status bar ----
  "status.dashboard": "Dashboard",
  "status.editorPlot": "Plot Editor",
  "status.editorWorld": "World Building Editor",
  "status.editorWiki": "Wiki Editor",
  "status.settings": "Settings",
  "status.savedLocal": "Saved locally",

  // ---- Onboarding ----
  "onboarding.firstRun": "First time here — let's set up your profile",
  "onboarding.title": "What is your pen name?",
  "onboarding.subtitle":
    "This pen name is your first profile. Each profile has its own bookshelf. You can add more profiles later in Settings.",
  "onboarding.penName": "Pen Name",
  "onboarding.penNameRequired": "Pen name is required",
  "onboarding.penNameHint": "Enter your pen name to get started.",
  "onboarding.bio": "Short bio",
  "onboarding.bioOptional": "(optional)",
  "onboarding.bioPlaceholder":
    "Tell us a bit about yourself or the genres you write.",
  "onboarding.start": "Start Writing",
  "onboarding.preparing": "Preparing your studio…",
  "onboarding.welcome": "Welcome, {name}!",
  "onboarding.studioReady": "Your studio is ready to use.",
  "onboarding.footer":
    "{app} · {version} — data is stored locally on this device. Backup is available in Settings.",

  // ---- Dashboard ----
  "dashboard.badge": "DASHBOARD",
  "dashboard.welcome": "Welcome, {name}",
  "dashboard.writerFallback": "Writer",
  "dashboard.subtitle":
    "Manage all your works on one shelf. Create, organize, edit, and delete books freely.",
  "dashboard.createBook": "New Book",
  "dashboard.search": "Search title, genre…",
  "dashboard.all": "All",
  "dashboard.errorLoad": "Failed to load books.",
  "dashboard.errorLoadShelf": "Failed to load bookshelf",
  "dashboard.deleted": "Book deleted",
  "dashboard.deletedDesc": "\"{title}\" has been deleted.",
  "dashboard.errorDelete": "Failed to delete book.",
  "dashboard.errorDeleteTitle": "Failed to delete",
  "dashboard.deleteTitle": "Delete this book?",
  "dashboard.deleteDesc":
    "Book \"{title}\" along with all its plot, world building, and wiki entries will be permanently deleted. This action cannot be undone.",
  "dashboard.openBook": "Open",
  "dashboard.editRename": "Edit / Rename",
  "dashboard.bookOptions": "Book options",
  "dashboard.noMatch": "No matching books",
  "dashboard.empty": "Your bookshelf is still empty",
  "dashboard.noMatchDesc":
    "Try changing your search keywords or work type filter.",
  "dashboard.emptyDesc":
    "Start by creating your first book — novel, comic, film plot, or game. Everything can be managed from here.",
  "dashboard.createFirst": "Create First Book",

  // ---- Book editor ----
  "editor.errorLoad": "Failed to load book",
  "editor.errorLoadDesc": "Open the dashboard and try again.",
  "editor.editBook": "Edit Book",
  "editor.noBookTitle": "No book selected",
  "editor.noBookDesc":
    "Select a book from the dashboard to start editing its plot, world building, or wiki.",
  "editor.openDashboard": "Open Dashboard",

  // ---- Plot editor ----
  "plot.structure": "Plot Structure",
  "plot.search": "Search chapters/scenes…",
  "plot.newSection": "New Section",
  "plot.noSummary": "No summary",
  "plot.deleteTitle": "Delete this section?",
  "plot.deleteDesc": "\"{title}\" will be removed from the plot structure.",
  "plot.editorLabel": "Plot Editor",
  "plot.titlePlaceholder": "Chapter / scene title…",
  "plot.kind": "Type",
  "plot.summary": "Summary",
  "plot.summaryPlaceholder": "One short sentence about this section.",
  "plot.content": "Manuscript / Notes",
  "plot.contentPlaceholder":
    "Write scenes, dialogue, or plot notes here…",

  // ---- World editor ----
  "world.search": "Search locations, cultures…",
  "world.newEntry": "New World Entry",
  "world.noun": "world entry",
  "world.deleteTitle": "Delete this entry?",
  "world.deleteDesc": "\"{title}\" will be removed from world building.",
  "world.editorLabel": "World Building",
  "world.titlePlaceholder": "Location / culture / system name…",
  "world.category": "Category",
  "world.content": "Description & Details",
  "world.contentPlaceholder":
    "Geography, history, culture, magic rules, technology… describe your world in detail.",

  // ---- Wiki editor ----
  "wiki.listTitle": "Work Wiki",
  "wiki.search": "Search characters, items…",
  "wiki.newEntry": "New Wiki Entry",
  "wiki.noun": "wiki entry",
  "wiki.deleteTitle": "Delete this wiki entry?",
  "wiki.deleteDesc": "\"{title}\" will be removed from the wiki.",
  "wiki.editorLabel": "Wiki",
  "wiki.titlePlaceholder": "Character / item / faction name…",
  "wiki.category": "Category",
  "wiki.tags": "Tags (comma-separated)",
  "wiki.tagsPlaceholder": "protagonist, knight, fire",
  "wiki.content": "Description",
  "wiki.contentPlaceholder":
    "Background, personality, appearance, relationships, abilities…",

  // ---- Master detail ----
  "masterDetail.selectHint": "Select an item on the left to start editing.",

  // ---- List empty (shared) ----
  "listEmpty.noMatch": "No matches.",
  "listEmpty.empty": "No {noun} yet.",

  // ---- Book form dialog ----
  "bookForm.titleRequired": "Title is required",
  "bookForm.titleHint": "Give your book a title.",
  "bookForm.noProfile": "Active profile not found.",
  "bookForm.errorSave": "Failed to save book.",
  "bookForm.created": "Book created",
  "bookForm.updated": "Changes saved",
  "bookForm.createdDesc": "\"{title}\" is ready. Click to start editing.",
  "bookForm.updatedDesc": "\"{title}\" is ready.",
  "bookForm.createTitle": "Create New Book",
  "bookForm.editTitle": "Edit Book",
  "bookForm.createDesc":
    "Start a new project — novel, comic, film plot, or game.",
  "bookForm.editDesc": "Change your book details.",
  "bookForm.titleLabel": "Title",
  "bookForm.titlePlaceholder": "e.g. Dusk in the Old Town",
  "bookForm.typeLabel": "Work Type",
  "bookForm.statusLabel": "Status",
  "bookForm.genreLabel": "Genre",
  "bookForm.genrePlaceholder": "e.g. Fantasy, Romance, Thriller",
  "bookForm.descLabel": "Synopsis / Description",
  "bookForm.descPlaceholder": "A brief summary of this work.",
  "bookForm.coverColor": "Cover Color",
  "bookForm.colorLabel": "Color {color}",
  "bookForm.createBtn": "Create Book",
  "bookForm.saveBtn": "Save",

  // ---- Profile form dialog ----
  "profileForm.nameRequired": "Pen name is required",
  "profileForm.errorSave": "Failed to save profile.",
  "profileForm.created": "Profile created",
  "profileForm.updated": "Profile updated",
  "profileForm.createTitle": "Add Profile",
  "profileForm.editTitle": "Edit Profile",
  "profileForm.createDesc":
    "Create a new author profile. Each profile has its own bookshelf.",
  "profileForm.editDesc": "Change the pen name or bio for this profile.",
  "profileForm.nameLabel": "Pen Name",
  "profileForm.namePlaceholder": "e.g. Tania Rengganis",
  "profileForm.bioLabel": "Bio (optional)",
  "profileForm.bioPlaceholder": "Tell us a bit about this writer.",
  "profileForm.createBtn": "Create",

  // ---- Settings ----
  "settings.badge": "SETTINGS",
  "settings.title": "Settings",
  "settings.subtitle":
    "Manage your author profiles, appearance, and studio data backup.",

  // Profiles section
  "settings.profiles.title": "Author Profiles",
  "settings.profiles.desc": "Each profile has its own bookshelf.",
  "settings.profiles.add": "Add",
  "settings.profiles.empty": "No profiles yet.",
  "settings.profiles.active": "Active",
  "settings.profiles.activate": "Activate",
  "settings.profiles.editProfile": "Edit profile",
  "settings.profiles.deleteProfile": "Delete profile",
  "settings.profiles.noBio": "No bio",
  "settings.profiles.bookCount": "{count} books",
  "settings.profiles.deleteTitle": "Delete this profile?",
  "settings.profiles.deleteDesc":
    "Profile \"{name}\" along with all its books, plot, world building, and wiki entries will be permanently deleted.",
  "settings.profiles.deleted": "Profile deleted",
  "settings.profiles.deletedDesc":
    "\"{name}\" and all its books have been deleted.",
  "settings.profiles.errorDelete": "Failed to delete",
  "settings.profiles.errorDeleteMsg": "Failed to delete profile.",
  "settings.profiles.errorLoadMsg": "Failed to load profiles.",
  "settings.profiles.errorLoadTitle": "Failed to load profiles",
  "settings.profiles.activated": "Active profile switched",

  // Theme section
  "settings.theme.title": "Appearance",
  "settings.theme.desc": "Choose light, dark, or system mode.",
  "settings.theme.light": "Light",
  "settings.theme.lightDesc": "Light mode",
  "settings.theme.dark": "Dark",
  "settings.theme.darkDesc": "Dark mode",
  "settings.theme.system": "System",
  "settings.theme.systemDesc": "Follow system",

  // Accent section
  "settings.accent.title": "Accent Color",
  "settings.accent.desc": "Personalize your studio's main color.",
  "settings.accent.updated": "Accent updated",
  "settings.accent.updatedDesc": "Main color: {name}",
  "settings.accent.hint":
    "The accent is applied across the studio: sidebar, primary buttons, active indicators, and focus rings. Your choice is saved on this device.",

  // Language section
  "settings.language.title": "Language",
  "settings.language.desc": "Choose the app interface language.",
  "settings.language.updated": "Language updated",
  "settings.language.hint":
    "Your language choice is saved on this device and applied instantly across the studio.",

  // Backup section
  "settings.backup.title": "Backup & Restore",
  "settings.backup.desc":
    "Export your entire studio to a single file, or restore from a backup.",
  "settings.backup.export": "Export Backup",
  "settings.backup.exporting": "Exporting…",
  "settings.backup.import": "Import / Restore",
  "settings.backup.importing": "Restoring…",
  "settings.backup.exportOk": "Backup saved successfully",
  "settings.backup.exportOkFs": "File saved to your Documents folder.",
  "settings.backup.exportOkDl": "File downloaded to your downloads folder.",
  "settings.backup.exportFail": "Backup failed",
  "settings.backup.importOk": "Backup restored successfully",
  "settings.backup.importOkDesc": "{profiles} profiles · {books} books.",
  "settings.backup.importFail": "Restore failed",
  "settings.backup.aboutTitle": "About format & storage",
  "settings.backup.fmtJson":
    "File format: .json — stores all profiles, books, plot, world building, & wiki entries intact and can be fully restored.",
  "settings.backup.fmtDocs":
    "Files are saved to the default Documents folder (Windows local/OneDrive, macOS, Linux). On browsers without File System Access, the file will be downloaded to your downloads folder.",
  "settings.backup.fmtRestore":
    "Restore replaces all current data with the contents of the backup file.",

  // ---- Domain labels ----
  // Book types
  "bookType.Novel": "Novel",
  "bookType.Komik": "Comic",
  "bookType.Film": "Film",
  "bookType.Game": "Game",
  "bookType.Lainnya": "Other",
  // Book statuses
  "bookStatus.draft": "Draft",
  "bookStatus.writing": "Writing",
  "bookStatus.editing": "Editing",
  "bookStatus.done": "Done",
  // Plot kinds
  "plotKind.act": "Act",
  "plotKind.chapter": "Chapter",
  "plotKind.scene": "Scene",
  "plotKind.beat": "Beat",
  "plotKind.note": "Note",
  // World categories
  "worldCategory.location": "Location",
  "worldCategory.culture": "Culture",
  "worldCategory.history": "History",
  "worldCategory.magic": "Magic System",
  "worldCategory.tech": "Technology",
  "worldCategory.religion": "Religion & Myth",
  "worldCategory.geography": "Geography",
  "worldCategory.lore": "Lore",
  "worldCategory.other": "Other",
  // Wiki categories
  "wikiCategory.character": "Character",
  "wikiCategory.item": "Item",
  "wikiCategory.faction": "Faction",
  "wikiCategory.location": "Location",
  "wikiCategory.event": "Event",
  "wikiCategory.concept": "Concept",
  "wikiCategory.other": "Other",

  // ---- CRUD hook errors ----
  "crud.errorLoad": "Failed to load data",
  "crud.errorLoadMsg": "Failed to load data.",
  "crud.errorCreate": "Failed to create item",
  "crud.errorCreateMsg": "Failed to create item.",
  "crud.errorSave": "Failed to save",
  "crud.errorSaveMsg": "Failed to save.",
  "crud.errorDelete": "Failed to delete",
  "crud.errorDeleteMsg": "Failed to delete.",
};

const DICTS: Record<Locale, Record<string, string>> = {
  id,
  "en-US": enUS,
};

export function translate(
  locale: Locale,
  key: string,
  params?: Record<string, string | number>,
): string {
  const dict = DICTS[locale] ?? DICTS[DEFAULT_LOCALE];
  let str = dict[key];
  if (str === undefined) {
    // Fallback to default locale, then to the key itself.
    str = DICTS[DEFAULT_LOCALE][key] ?? key;
  }
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return str;
}

export function isLocale(v: unknown): v is Locale {
  return (
    typeof v === "string" &&
    (LOCALES as Array<{ code: string }>).some((l) => l.code === v)
  );
}

// date-fns locale mapping for relative dates.
export async function getDateFnsLocale(
  locale: Locale,
): Promise<typeof import("date-fns/locale")> {
  if (locale === "en-US") {
    return await import("date-fns/locale/en-US");
  }
  return await import("date-fns/locale/id");
}
