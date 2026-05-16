"use client";

import { useSocket } from '@/components/SocketProvider';
import { ThreadMap, MessagePayload } from '@/types/chat.types';
import { InboxList } from '@/components/chat/InboxList';
import { MessageSquare } from 'lucide-react';
import { Typography } from 'intracom-ui';

export default function ChatRootPage() {
  const { isConnected, messages } = useSocket();
  
  const threads: ThreadMap = messages.reduce((acc: ThreadMap, msg: MessagePayload) => {
    if (!acc[msg.conversationId]) acc[msg.conversationId] = [];
    acc[msg.conversationId].push(msg);
    return acc;
  }, {});

  const activeConversationIds = Object.keys(threads);

  return (
    <>
      <InboxList 
        isConnected={isConnected}
        threads={threads}
        activeConversationIds={activeConversationIds}
        activeThreadId={null}
      />
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
        <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6 text-blue-600 shadow-sm">
          <MessageSquare size={40} />
        </div>
        <Typography variant="h3" className="text-gray-900 border-0 mb-2">Select a conversation</Typography>
        <Typography variant="muted">Choose a visitor thread from the list to start messaging</Typography>
      </div>
    </>
  );
}
