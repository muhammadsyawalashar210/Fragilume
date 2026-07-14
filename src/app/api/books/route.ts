import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { BOOK_ACCENTS, BOOK_STATUSES, BOOK_TYPES } from "@/lib/domain";

// List all books (newest first).
export async function GET() {
  const books = await db.book.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      _count: {
        select: { plotNodes: true, worldEntries: true, wikiEntries: true },
      },
    },
  });
  return NextResponse.json({ books });
}

// Create a new book.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  if (!title) {
    return NextResponse.json(
      { error: "Judul buku tidak boleh kosong." },
      { status: 400 }
    );
  }

  const author = await db.author.findFirst();
  if (!author) {
    return NextResponse.json(
      { error: "Author belum diatur. Silakan daftarkan nama pena terlebih dahulu." },
      { status: 400 }
    );
  }

  const type = BOOK_TYPES.includes(body?.type) ? body.type : "Novel";
  const status = BOOK_STATUSES.includes(body?.status) ? body.status : "draft";
  const accent = BOOK_ACCENTS.includes(body?.accent) ? body.accent : "amber";
  const genre =
    typeof body?.genre === "string" ? body.genre.trim().slice(0, 80) : null;
  const description =
    typeof body?.description === "string" ? body.description.trim() : null;

  const book = await db.book.create({
    data: {
      title,
      description,
      type,
      genre,
      accent,
      status,
      authorId: author.id,
    },
  });
  return NextResponse.json({ book }, { status: 201 });
}
