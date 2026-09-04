import { create } from 'zustand';
import type { User } from '@/types';

interface UserState {
  user: User | null;
  isRegistered: boolean;
  setOpenid: (openid: string) => void;
  setUser: (user: User) => void;
  clear: () => void;
}

/** 用户状态管理 */
export const useUserStore = create<UserState>((set) => ({
  user: null,
  isRegistered: false,
  setOpenid: (_openid: string) => set((state) => ({ ...state })),
  setUser: (user: User) => set({ user, isRegistered: true }),
  clear: () => set({ user: null, isRegistered: false })
}));
