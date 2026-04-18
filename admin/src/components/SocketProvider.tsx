"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  messages: any[];
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  messages: [],
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    // Admin connects with isAdmin=true
    const socketInstance = io('http://localhost:3000', {
      query: { isAdmin: 'true' },
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    socketInstance.on('admin_new_message', (payload: any) => {
      // payload matches SendMessageDto coming from ChatGateway
      setMessages((prev) => [...prev, payload]);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected, messages }}>
      {children}
    </SocketContext.Provider>
  );
};
