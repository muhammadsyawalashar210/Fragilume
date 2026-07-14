// Lightweight shared types for the API payloads (decoupled from Prisma internals).

export type ProfileT = {
  id: string;
  penName: string;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { books: number };
};

export type BookWithCounts = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  genre: string | null;
  accent: string;
  status: string;
  profileId: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    plotNodes: number;
    worldEntries: number;
    wikiEntries: number;
  };
};

export type PlotNodeT = {
  id: string;
  bookId: string;
  title: string;
  summary: string | null;
  content: string | null;
  kind: string;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type WorldEntryT = {
  id: string;
  bookId: string;
  title: string;
  category: string;
  content: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type WikiEntryT = {
  id: string;
  bookId: string;
  title: string;
  category: string;
  content: string | null;
  tags: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
};
