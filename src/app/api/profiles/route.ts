import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// List all profiles with book counts (oldest first).
export async function GET() {
  const profiles = await db.profile.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { books: true } } },
  });
  return NextResponse.json({ profiles });
}

// Create a new profile (pen name).
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const penName = typeof body?.penName === "string" ? body.penName.trim() : "";
  if (!penName) {
    return NextResponse.json(
      { error: "Nama pena tidak boleh kosong." },
      { status: 400 }
    );
  }
  const bio = typeof body?.bio === "string" ? body.bio.trim() || null : null;

  const profile = await db.profile.create({ data: { penName, bio } });
  return NextResponse.json({ profile }, { status: 201 });
}
