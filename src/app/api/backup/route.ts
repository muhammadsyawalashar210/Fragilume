import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Export the entire studio as a single JSON document.
// Format: { version, app, exportedAt, profiles[], books[] (with nested entries) }
export async function GET() {
  const profiles = await db.profile.findMany({
    orderBy: { createdAt: "asc" },
  });

  const books = await db.book.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      plotNodes: { orderBy: { order: "asc" } },
      worldEntries: { orderBy: { order: "asc" } },
      wikiEntries: { orderBy: { order: "asc" } },
    },
  });

  const payload = {
    version: 1,
    app: "Writer's Studio",
    exportedAt: new Date().toISOString(),
    profiles,
    books,
  };

  return NextResponse.json(payload);
}
