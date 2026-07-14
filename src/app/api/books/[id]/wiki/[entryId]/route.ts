import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { WIKI_CATEGORIES } from "@/lib/domain";

type Params = { params: Promise<{ id: string; entryId: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const { entryId } = await params;
  const body = await req.json().catch(() => ({}));

  const data: Record<string, unknown> = {};
  if (typeof body?.title === "string" && body.title.trim()) data.title = body.title.trim();
  if (typeof body?.content === "string") data.content = body.content;
  if (WIKI_CATEGORIES.includes(body?.category)) data.category = body.category;
  if (typeof body?.tags === "string") data.tags = body.tags.trim() || null;
  if (typeof body?.order === "number") data.order = body.order;

  const entry = await db.wikiEntry.update({ where: { id: entryId }, data });
  return NextResponse.json({ entry });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { entryId } = await params;
  await db.wikiEntry.delete({ where: { id: entryId } });
  return NextResponse.json({ ok: true });
}
