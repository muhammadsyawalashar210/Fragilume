import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

type BackupProfile = {
  id: string;
  penName: string;
  bio?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type BackupEntry = {
  id: string;
  title: string;
  content?: string | null;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
};

type BackupBook = BackupEntry & {
  description?: string | null;
  type?: string;
  genre?: string | null;
  accent?: string;
  status?: string;
  profileId: string;
  plotNodes?: BackupPlotNode[];
  worldEntries?: BackupWorldEntry[];
  wikiEntries?: BackupWikiEntry[];
};

type BackupPlotNode = BackupEntry & {
  summary?: string | null;
  kind?: string;
  bookId?: string;
};

type BackupWorldEntry = BackupEntry & {
  category?: string;
  bookId?: string;
};

type BackupWikiEntry = BackupEntry & {
  category?: string;
  tags?: string | null;
  bookId?: string;
};

function toDate(v: unknown): Date {
  if (typeof v === "string" || typeof v === "number" || v instanceof Date) {
    const d = new Date(v);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return new Date();
}

// Restore (replace) the entire studio from a backup JSON document.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Backup tidak valid." }, { status: 400 });
  }

  const profiles = Array.isArray(body.profiles) ? (body.profiles as BackupProfile[]) : [];
  const books = Array.isArray(body.books) ? (body.books as BackupBook[]) : [];

  if (profiles.length === 0 && books.length === 0) {
    return NextResponse.json(
      { error: "Backup kosong — tidak ada data untuk dipulihkan." },
      { status: 400 }
    );
  }

  const profileIds = new Set(profiles.map((p) => p.id));

  try {
    // Wipe everything, then re-insert from the backup.
    await db.$transaction([
      db.wikiEntry.deleteMany(),
      db.worldEntry.deleteMany(),
      db.plotNode.deleteMany(),
      db.book.deleteMany(),
      db.profile.deleteMany(),
    ]);

    for (const p of profiles) {
      if (!p.id || !p.penName) continue;
      await db.profile.create({
        data: {
          id: p.id,
          penName: p.penName,
          bio: p.bio ?? null,
          createdAt: toDate(p.createdAt),
          updatedAt: toDate(p.updatedAt ?? p.createdAt),
        },
      });
    }

    let bookCount = 0;
    for (const b of books) {
      if (!b.id || !b.title || !profileIds.has(b.profileId)) continue;
      await db.book.create({
        data: {
          id: b.id,
          title: b.title,
          description: b.description ?? null,
          type: b.type ?? "Novel",
          genre: b.genre ?? null,
          accent: b.accent ?? "amber",
          status: b.status ?? "draft",
          profileId: b.profileId,
          createdAt: toDate(b.createdAt),
          updatedAt: toDate(b.updatedAt ?? b.createdAt),
        },
      });
      bookCount++;

      for (const n of b.plotNodes ?? []) {
        if (!n.id || !n.title) continue;
        await db.plotNode.create({
          data: {
            id: n.id,
            bookId: b.id,
            title: n.title,
            summary: n.summary ?? null,
            content: n.content ?? null,
            kind: n.kind ?? "chapter",
            order: n.order ?? 0,
            createdAt: toDate(n.createdAt),
            updatedAt: toDate(n.updatedAt ?? n.createdAt),
          },
        });
      }
      for (const w of b.worldEntries ?? []) {
        if (!w.id || !w.title) continue;
        await db.worldEntry.create({
          data: {
            id: w.id,
            bookId: b.id,
            title: w.title,
            category: w.category ?? "other",
            content: w.content ?? null,
            order: w.order ?? 0,
            createdAt: toDate(w.createdAt),
            updatedAt: toDate(w.updatedAt ?? w.createdAt),
          },
        });
      }
      for (const w of b.wikiEntries ?? []) {
        if (!w.id || !w.title) continue;
        await db.wikiEntry.create({
          data: {
            id: w.id,
            bookId: b.id,
            title: w.title,
            category: w.category ?? "character",
            content: w.content ?? null,
            tags: w.tags ?? null,
            order: w.order ?? 0,
            createdAt: toDate(w.createdAt),
            updatedAt: toDate(w.updatedAt ?? w.createdAt),
          },
        });
      }
    }

    return NextResponse.json({
      ok: true,
      counts: { profiles: profiles.length, books: bookCount },
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Gagal memulihkan backup.",
      },
      { status: 500 }
    );
  }
}
