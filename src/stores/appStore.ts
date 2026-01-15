import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState } from '@/types';

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Locale
      locale: 'en',
      setLocale: (locale) => set({ locale }),

      // User (future)
      user: null,
      setUser: (user) => set({ user }),

      // UI state
      sidebarOpen: false,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

      // Tool history (localStorage)
      recentTools: [],
      addRecentTool: (toolId) => {
        const { recentTools } = get();
        const filtered = recentTools.filter((id) => id !== toolId);
        const updated = [toolId, ...filtered].slice(0, 10); // Keep last 10
        set({ recentTools: updated });
      },

      // Favorites (localStorage)
      favoriteTools: [],
      toggleFavorite: (toolId) => {
        const { favoriteTools } = get();
        const isFavorite = favoriteTools.includes(toolId);
        const updated = isFavorite
          ? favoriteTools.filter((id) => id !== toolId)
          : [...favoriteTools, toolId];
        set({ favoriteTools: updated });
      },
    }),
    {
      name: 'devtools-hub-store',
      partialize: (state) => ({
        locale: state.locale,
        recentTools: state.recentTools,
        favoriteTools: state.favoriteTools,
      }),
    }
  )
);
