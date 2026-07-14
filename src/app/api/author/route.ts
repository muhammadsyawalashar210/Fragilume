import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET the singleton author record (the writer's pen name).
export async function GET() {
  const author = await db.author.findFirst({
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ author });
}

// Create or update the pen name (first-run onboarding uses this).
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const penName = typeof body?.penName === "string" ? body.penName.trim() : "";
  if (!penName) {
    return NextResponse.json(
      { error: "Nama pena tidak boleh kosong." },
      { status: 400 }
    );
  }
  const bio = typeof body?.bio === "string" ? body.bio.trim() : null;

  const existing = await db.author.findFirst();
  let author;
  if (existing) {
    author = await db.author.update({
      where: { id: existing.id },
      data: { penName, bio },
    });
  } else {
    author = await db.author.create({ data: { penName, bio } });
  }
  return NextResponse.json({ author });
}
