import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { PLOT_KINDS } from "@/lib/domain";

type Params = { params: Promise<{ id: string }> };

// List plot nodes for a book ordered by `order`.
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const nodes = await db.plotNode.findMany({
    where: { bookId: id },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json({ nodes });
}

// Create a plot node.
export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  if (!title) {
    return NextResponse.json({ error: "Judul tidak boleh kosong." }, { status: 400 });
  }
  const kind = PLOT_KINDS.includes(body?.kind) ? body.kind : "chapter";
  const summary =
    typeof body?.summary === "string" ? body.summary.trim() : null;
  const content =
    typeof body?.content === "string" ? body.content : null;

  const count = await db.plotNode.count({ where: { bookId: id } });
  const node = await db.plotNode.create({
    data: {
      bookId: id,
      title,
      summary,
      content,
      kind,
      order: typeof body?.order === "number" ? body.order : count,
    },
  });
  return NextResponse.json({ node }, { status: 201 });
}
