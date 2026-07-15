import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

// Update a profile (rename pen name / bio).
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const data: Record<string, unknown> = {};
  if (typeof body?.penName === "string" && body.penName.trim()) {
    data.penName = body.penName.trim();
  }
  if (typeof body?.bio === "string") {
    data.bio = body.bio.trim() || null;
  }

  const profile = await db.profile.update({ where: { id }, data });
  return NextResponse.json({ profile });
}

// Delete a profile (cascades to its books + entries).
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  await db.profile.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
