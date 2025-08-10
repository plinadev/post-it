import { create } from "zustand";
import type { User } from "../../types";

interface AuthState {
  user: User | null;
  isAuthReady: boolean;
  setUser: (user: User | null) => void;
  setAuthReady: (ready: boolean) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthReady: false,
  setUser: (user) => set({ user, isAuthReady: true }),
  setAuthReady: (isAuthReady) => set({ isAuthReady }),
  clearUser: () => set({ user: null, isAuthReady: true }),
}));
