import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { WORLD_CATEGORIES } from "@/lib/domain";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const entries = await db.worldEntry.findMany({
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
  const category = WORLD_CATEGORIES.includes(body?.category) ? body.category : "other";
  const content = typeof body?.content === "string" ? body.content : null;

  const count = await db.worldEntry.count({ where: { bookId: id } });
  const entry = await db.worldEntry.create({
    data: {
      bookId: id,
      title,
      category,
      content,
      order: typeof body?.order === "number" ? body.order : count,
    },
  });
  return NextResponse.json({ entry }, { status: 201 });
}
