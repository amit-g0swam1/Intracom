"use client";

import { MessagePayload } from '@/types/chat.types';
import { ChatInput } from './ChatInput';
import { MessageSquare, Phone, Video, Info, MoreVertical } from 'lucide-react';
import { List, ListItem, Typography, Avatar, AvatarFallback, Button } from 'intracom-ui';

interface ChatWindowProps {
  activeThreadId: string | null;
  activeMessages: MessagePayload[];
  isConnected: boolean;
  handleReply: (text: string) => void;
}

export function ChatWindow({ activeThreadId, activeMessages, isConnected, handleReply }: ChatWindowProps) {
  if (!activeThreadId) return null; // Should be handled by route placeholder

  return (
    <main className="flex-1 flex flex-col bg-white">
      <header className="h-[72px] px-6 border-b bg-white/80 backdrop-blur-md flex justify-between items-center z-10 sticky top-0">
         <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border shadow-sm">
               <AvatarFallback className="bg-blue-50 text-blue-600 font-bold text-xs">V</AvatarFallback>
            </Avatar>
            <div>
               <Typography variant="h4" className="text-sm font-bold border-0 m-0">Visitor #{activeThreadId.substring(0, 8)}</Typography>
               <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <Typography variant="muted" className="text-[11px] font-medium">Active now • San Francisco, CA</Typography>
               </div>
            </div>
         </div>
         
         <div className="flex items-center gap-1">
            <HeaderAction icon={<Phone size={18} />} />
            <HeaderAction icon={<Video size={18} />} />
            <HeaderAction icon={<Info size={18} />} />
            <div className="w-[1px] h-6 bg-gray-100 mx-2"></div>
            <HeaderAction icon={<MoreVertical size={18} />} />
         </div>
      </header>

      <div className="flex-1 overflow-y-auto bg-gray-50/30 p-6 space-y-6">
        <div className="flex justify-center mb-8">
           <span className="px-3 py-1 bg-white border border-gray-100 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest shadow-sm">
              Today
           </span>
        </div>

        <List className="gap-6">
           {activeMessages.map((msg: MessagePayload, i: number) => {
              const isAdmin = msg.isAdmin;
              return (
                <ListItem 
                   key={i} 
                   className={`p-0 bg-transparent hover:bg-transparent dark:hover:bg-transparent flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                >
                   <div className="flex items-end gap-2 max-w-[80%]">
                      {!isAdmin && (
                         <Avatar className="w-6 h-6 border shadow-xs mb-1">
                            <AvatarFallback className="text-[8px] bg-gray-200">V</AvatarFallback>
                         </Avatar>
                      )}
                      <div className={`px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                         isAdmin 
                           ? 'bg-blue-600 text-white rounded-br-none shadow-blue-200 font-medium' 
                           : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
                      }`}>
                         {msg.text}
                      </div>
                   </div>
                   <span className="text-[10px] text-gray-400 mt-1.5 px-1 font-medium">
                      {isAdmin ? 'Delivered' : '10:24 AM'}
                   </span>
                </ListItem>
              )
           })}
        </List>
      </div>

      <div className="p-6 bg-white border-t">
        <ChatInput isConnected={isConnected} onSubmit={handleReply} />
        <div className="mt-3 flex items-center justify-between">
           <div className="flex gap-4">
              <Typography variant="muted" className="text-[10px] hover:text-blue-600 cursor-pointer transition-colors">Quick Replies (Cmd+K)</Typography>
              <Typography variant="muted" className="text-[10px] hover:text-blue-600 cursor-pointer transition-colors">Attach Files</Typography>
           </div>
           <Typography variant="muted" className="text-[10px]">Press Enter to send</Typography>
        </div>
      </div>
    </main>
  );
}

function HeaderAction({ icon }: { icon: React.ReactNode }) {
   return (
      <Button variant="ghost" size="icon" className="w-9 h-9 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
         {icon}
      </Button>
   )
}
