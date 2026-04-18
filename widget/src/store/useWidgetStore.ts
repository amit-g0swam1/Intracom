import { create } from 'zustand'
import { initSocket, getSocket } from '../services/socket'

export interface Message {
  id: string
  text: string
  senderId: string
  timestamp: number
  isAdmin: boolean
}

interface WidgetState {
  isOpen: boolean
  unreadCount: number
  messages: Message[]
  isConnected: boolean
  conversationId: string | null
  
  toggleWidget: () => void
  setUnreadCount: (count: number) => void
  addMessage: (msg: Message) => void
  setConnectionStatus: (status: boolean) => void
  initChat: (url?: string) => void
  sendMessage: (text: string) => void
}

export const useWidgetStore = create<WidgetState>((set, get) => ({
  isOpen: false,
  unreadCount: 0,
  messages: [],
  isConnected: false,
  conversationId: null,

  toggleWidget: () => set((state) => ({ isOpen: !state.isOpen })),

  setUnreadCount: (count) => set({ unreadCount: count }),

  addMessage: (msg) => set((state) => {
    // Prevent duplicate messages just in case
    if (state.messages.find(m => m.id === msg.id)) return state;
    
    // Increment unread count if widget is closed and admin sent message
    const newUnreadCount = !state.isOpen && msg.isAdmin ? state.unreadCount + 1 : state.unreadCount;
    return { 
      messages: [...state.messages, msg],
      unreadCount: newUnreadCount
    };
  }),

  setConnectionStatus: (status) => set({ isConnected: status }),

  initChat: (url = 'http://localhost:3000') => {
    const state = get();
    if (state.isConnected) return;
    
    // Attempt to persist local identity per visitor
    let savedId = localStorage.getItem('intracom_conversation_id');
    if (!savedId) {
        savedId = crypto.randomUUID();
        localStorage.setItem('intracom_conversation_id', savedId);
    }
    
    set({ conversationId: savedId });

    const socket = initSocket(url, savedId);

    socket.on('connect', () => {
      set({ isConnected: true });
    });

    socket.on('disconnect', () => {
      set({ isConnected: false });
    });

    socket.on('new_message', (payload: any) => {
      // payload matches backend SendMessageDto shape
      get().addMessage({
        id: crypto.randomUUID(), // Assume generation locally for display
        text: payload.text,
        senderId: payload.senderId,
        timestamp: Date.now(),
        isAdmin: payload.isAdmin,
      });
    });
  },

  sendMessage: (text: string) => {
    const { conversationId } = get();
    const socket = getSocket();
    
    if (!socket || !conversationId) return;

    const payload = {
      conversationId,
      senderId: 'visitor',
      text,
      isAdmin: false
    };

    socket.emit('send_message', payload);
    
    // Optimistic UI update
    get().addMessage({
      id: crypto.randomUUID(),
      text,
      senderId: 'visitor',
      timestamp: Date.now(),
      isAdmin: false
    });
  }
}))
