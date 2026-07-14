import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { WIKI_CATEGORIES } from "@/lib/domain";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const entries = await db.wikiEntry.findMany({
    where: { bookId: id },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json({ entries });
}

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  if (!title) {
    return NextResponse.json({ error: "Judul tidak boleh kosong." }, { status: 400 });
  }
  const category = WIKI_CATEGORIES.includes(body?.category) ? body.category : "character";
  const content = typeof body?.content === "string" ? body.content : null;
  const tags = typeof body?.tags === "string" ? body.tags.trim() : null;

  const count = await db.wikiEntry.count({ where: { bookId: id } });
  const entry = await db.wikiEntry.create({
    data: {
      bookId: id,
      title,
      category,
      content,
      tags,
      order: typeof body?.order === "number" ? body.order : count,
    },
  });
  return NextResponse.json({ entry }, { status: 201 });
}
