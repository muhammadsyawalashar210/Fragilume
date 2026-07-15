"use client";

import { create } from "zustand";
import type { ProfileT } from "@/lib/types";

export type AppView = "dashboard" | "plot" | "world" | "wiki" | "settings";

const ACTIVE_PROFILE_KEY = "ws-active-profile";

type AppState = {
  // Profiles
  profiles: ProfileT[];
  setProfiles: (p: ProfileT[]) => void;
  activeProfileId: string | null;
  activeProfile: ProfileT | null;
  setActiveProfileId: (id: string | null) => void;

  // Navigation
  view: AppView;
  setView: (v: AppView) => void;

  selectedBookId: string | null;
  selectedBookTitle: string | null;
  selectBook: (id: string | null, title?: string | null) => void;
  openEditor: (bookId: string, title: string, view: AppView) => void;

  // Mobile drawer
  mobileNavOpen: boolean;
  setMobileNavOpen: (v: boolean) => void;
};

export const useAppStore = create<AppState>((set, get) => ({
  profiles: [],
  setProfiles: (profiles) =>
    set({
      profiles,
      activeProfile:
        profiles.find((p) => p.id === get().activeProfileId) ?? null,
    }),

  activeProfileId: null,
  activeProfile: null,
  setActiveProfileId: (id) => {
    if (id) {
      try {
        localStorage.setItem(ACTIVE_PROFILE_KEY, id);
      } catch {
        /* ignore */
      }
    } else {
      try {
        localStorage.removeItem(ACTIVE_PROFILE_KEY);
      } catch {
        /* ignore */
      }
    }
    const active = get().profiles.find((p) => p.id === id) ?? null;
    set({ activeProfileId: id, activeProfile: active });
  },

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

  mobileNavOpen: false,
  setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
}));

export function readStoredActiveProfile(): string | null {
  try {
    return localStorage.getItem(ACTIVE_PROFILE_KEY);
  } catch {
    return null;
  }
}
