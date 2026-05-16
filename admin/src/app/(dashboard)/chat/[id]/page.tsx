"use client";

import { useSocket } from '@/components/SocketProvider';
import { useParams } from 'next/navigation';
import { ThreadMap, MessagePayload } from '@/types/chat.types';
import { InboxList } from '@/components/chat/InboxList';
import { ChatWindow } from '@/components/chat/ChatWindow';

export default function ChatDetailPage() {
  const { id } = useParams();
  const activeThreadId = (Array.isArray(id) ? id[0] : id) || null;
  
  const { socket, isConnected, messages } = useSocket();
  
  const threads: ThreadMap = messages.reduce((acc: ThreadMap, msg: MessagePayload) => {
    if (!acc[msg.conversationId]) acc[msg.conversationId] = [];
    acc[msg.conversationId].push(msg);
    return acc;
  }, {});

  const activeConversationIds = Object.keys(threads);
  const activeMessages = activeThreadId ? threads[activeThreadId] || [] : [];

  const handleReply = (text: string) => {
    if (!socket || !activeThreadId) return;

    socket.emit('send_message', {
      conversationId: activeThreadId,
      senderId: 'admin',
      text,
      isAdmin: true
    });
  };

  return (
    <>
      <InboxList 
        isConnected={isConnected}
        threads={threads}
        activeConversationIds={activeConversationIds}
        activeThreadId={activeThreadId}
      />
      <ChatWindow 
        activeThreadId={activeThreadId}
        activeMessages={activeMessages}
        isConnected={isConnected}
        handleReply={handleReply}
      />
    </>
  );
}
