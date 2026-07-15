"use client";

// Client-side backup/restore helpers.
// Prefer the File System Access API (defaulting the picker to the OS
// "Documents" well-known directory). Fall back to a normal download / file
// input for browsers that don't support it.

type FSWindow = Window & {
  showSaveFilePicker?: (opts: unknown) => Promise<FileSystemFileHandle>;
  showOpenFilePicker?: (opts: unknown) => Promise<FileSystemFileHandle[]>;
};

function pickerOpts() {
  return {
    types: [
      {
        description: "Fragilume Backup",
        accept: { "application/json": [".json"] },
      },
    ],
  };
}

function downloadText(text: string, filename: string) {
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function pickFileViaInput(): Promise<string | null> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return resolve(null);
      const text = await file.text();
      resolve(text);
    };
    // If the user cancels the picker, onchange never fires. We can't detect
    // cancellation reliably with the input fallback, so we resolve null on
    // window focus after a short delay if no file was chosen.
    input.click();
  });
}

export type ExportResult = {
  ok: boolean;
  cancelled?: boolean;
  method?: "filesystem" | "download";
  error?: string;
};

export async function exportBackup(): Promise<ExportResult> {
  let json: string;
  try {
    const res = await fetch("/api/backup");
    if (!res.ok) throw new Error("Gagal mengambil data backup.");
    const data = await res.json();
    json = JSON.stringify(data, null, 2);
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Gagal export.",
    };
  }

  const date = new Date().toISOString().slice(0, 10);
  const filename = `fragilume-backup-${date}.json`;
  const w = window as FSWindow;

  if (typeof w.showSaveFilePicker === "function") {
    try {
      const handle = await w.showSaveFilePicker({
        suggestedName: filename,
        startIn: "documents",
        ...pickerOpts(),
      });
      const writable = await (
        handle as unknown as {
          createWritable: () => Promise<{
            write: (data: string) => Promise<void>;
            close: () => Promise<void>;
          }>;
        }
      ).createWritable();
      await writable.write(json);
      await writable.close();
      return { ok: true, method: "filesystem" };
    } catch (e) {
      const name = (e as DOMException)?.name;
      if (name === "AbortError") return { ok: false, cancelled: true };
      // fall through to download fallback on other errors
    }
  }

  downloadText(json, filename);
  return { ok: true, method: "download" };
}

export type ImportResult = {
  ok: boolean;
  cancelled?: boolean;
  error?: string;
  counts?: { profiles: number; books: number };
};

export async function importBackup(): Promise<ImportResult> {
  const w = window as FSWindow;
  let text: string | null = null;

  if (typeof w.showOpenFilePicker === "function") {
    try {
      const [handle] = await w.showOpenFilePicker({
        startIn: "documents",
        multiple: false,
        ...pickerOpts(),
      });
      const file = await (
        handle as unknown as { getFile: () => Promise<File> }
      ).getFile();
      text = await file.text();
    } catch (e) {
      const name = (e as DOMException)?.name;
      if (name === "AbortError") return { ok: false, cancelled: true };
      return { ok: false, error: "Gagal membaca file." };
    }
  } else {
    text = await pickFileViaInput();
    if (!text) return { ok: false, cancelled: true };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: "File bukan JSON yang valid." };
  }
  if (!parsed || typeof parsed !== "object") {
    return { ok: false, error: "Format backup tidak dikenali." };
  }

  try {
    const res = await fetch("/api/restore", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      return { ok: false, error: d?.error || "Gagal memulihkan backup." };
    }
    const data = await res.json();
    return { ok: true, counts: data.counts };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Gagal restore.",
    };
  }
}
