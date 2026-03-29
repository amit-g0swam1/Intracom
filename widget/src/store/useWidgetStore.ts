import { create } from 'zustand'

interface WidgetState {
  isOpen: boolean
  unreadCount: number
  toggleWidget: () => void
  setUnreadCount: (count: number) => void
}

export const useWidgetStore = create<WidgetState>((set) => ({
  isOpen: false,
  unreadCount: 0,
  toggleWidget: () => set((state) => ({ isOpen: !state.isOpen })),
  setUnreadCount: (count) => set({ unreadCount: count }),
}))
