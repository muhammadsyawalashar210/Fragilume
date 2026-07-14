import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { BOOK_ACCENTS, BOOK_STATUSES, BOOK_TYPES } from "@/lib/domain";

type Params = { params: Promise<{ id: string }> };

// Get a single book with counts.
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const book = await db.book.findUnique({
    where: { id },
    include: {
      _count: {
        select: { plotNodes: true, worldEntries: true, wikiEntries: true },
      },
    },
  });
  if (!book) {
    return NextResponse.json({ error: "Buku tidak ditemukan." }, { status: 404 });
  }
  return NextResponse.json({ book });
}

// Update a book (rename, change type/status/accent/description).
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const data: Record<string, unknown> = {};
  if (typeof body?.title === "string" && body.title.trim()) {
    data.title = body.title.trim();
  }
  if (typeof body?.description === "string") {
    data.description = body.description.trim() || null;
  }
  if (typeof body?.genre === "string") {
    data.genre = body.genre.trim() || null;
  }
  if (BOOK_TYPES.includes(body?.type)) data.type = body.type;
  if (BOOK_STATUSES.includes(body?.status)) data.status = body.status;
  if (BOOK_ACCENTS.includes(body?.accent)) data.accent = body.accent;

  const book = await db.book.update({ where: { id }, data });
  return NextResponse.json({ book });
}

// Delete a book (cascades to plot/world/wiki).
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  await db.book.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
