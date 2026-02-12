import { create } from 'zustand';

interface UIState {
  isSidebarCollapsed: boolean;
  language: 'ar' | 'en';
  toggleSidebar: () => void;
  setLanguage: (lang: 'ar' | 'en') => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarCollapsed: false,
  language: 'ar', // Default to Arabic as per routing config
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setLanguage: (lang) => set({ language: lang }),
}));
