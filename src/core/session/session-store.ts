import { create } from 'zustand';
import { SessionUser } from './session.types';

export interface SessionState {
  user: SessionUser | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  setUser: (user: SessionUser | null) => void;
  setSession: (user: SessionUser) => void;
  clearSession: () => void;
  setInitializing: (isInitializing: boolean) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitializing: true,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setSession: (user) => set({ user, isAuthenticated: true, isInitializing: false }),
  clearSession: () => set({ user: null, isAuthenticated: false, isInitializing: false }),
  setInitializing: (isInitializing) => set({ isInitializing }),
}));

