import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { PLOT_KINDS } from "@/lib/domain";

type Params = { params: Promise<{ id: string; nodeId: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const { nodeId } = await params;
  const body = await req.json().catch(() => ({}));

  const data: Record<string, unknown> = {};
  if (typeof body?.title === "string" && body.title.trim()) data.title = body.title.trim();
  if (typeof body?.summary === "string") data.summary = body.summary.trim() || null;
  if (typeof body?.content === "string") data.content = body.content;
  if (PLOT_KINDS.includes(body?.kind)) data.kind = body.kind;
  if (typeof body?.order === "number") data.order = body.order;

  const node = await db.plotNode.update({ where: { id: nodeId }, data });
  return NextResponse.json({ node });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { nodeId } = await params;
  await db.plotNode.delete({ where: { id: nodeId } });
  return NextResponse.json({ ok: true });
}
