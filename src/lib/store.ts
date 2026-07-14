"use client";

import { create } from "zustand";

export type AppView = "dashboard" | "plot" | "world" | "wiki";

export type AuthorInfo = {
  id: string;
  penName: string;
  bio: string | null;
};

type AppState = {
  author: AuthorInfo | null;
  setAuthor: (a: AuthorInfo | null) => void;

  view: AppView;
  setView: (v: AppView) => void;

  selectedBookId: string | null;
  selectedBookTitle: string | null;
  selectBook: (id: string | null, title?: string | null) => void;

  // When entering an edit sub-view we require a book to be selected.
  openEditor: (bookId: string, title: string, view: AppView) => void;
};

export const useAppStore = create<AppState>((set) => ({
  author: null,
  setAuthor: (a) => set({ author: a }),

  view: "dashboard",
  setView: (view) => set({ view }),

  selectedBookId: null,
  selectedBookTitle: null,
  selectBook: (id, title = null) =>
    set({ selectedBookId: id, selectedBookTitle: title }),

  openEditor: (bookId, title, view) =>
    set({
      selectedBookId: bookId,
      selectedBookTitle: title,
      view,
    }),
}));
