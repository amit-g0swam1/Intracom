"use client";

import Link from 'next/link';
import { ThreadMap } from '@/types/chat.types';
import { Badge, Avatar, AvatarFallback, Typography, List, ListItem, ListItemIcon, ListItemText, ListItemTitle, ListItemDescription, Input } from 'intracom-ui';
import { Search } from 'lucide-react';

interface InboxListProps {
  isConnected: boolean;
  threads: ThreadMap;
  activeConversationIds: string[];
  activeThreadId: string | null;
}

export function InboxList({ isConnected, threads, activeConversationIds, activeThreadId }: InboxListProps) {
  return (
    <aside className="w-[320px] bg-white border-r flex flex-col shrink-0 shadow-[1px_0_0_0_rgba(0,0,0,0.05)] z-10">
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <Typography variant="h3" className="font-bold tracking-tight border-0 m-0 text-xl">Inbox</Typography>
          <Badge 
            variant={isConnected ? "default" : "destructive"} 
            className={`rounded-full px-2 py-0 h-5 text-[10px] font-bold uppercase tracking-wider ${
              isConnected ? 'bg-green-500 hover:bg-green-600 text-white' : ''
            }`}
          >
             {isConnected ? 'Online' : 'Offline'}
          </Badge>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <Input 
            placeholder="Search conversations..." 
            className="pl-10 h-10 bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-lg"
          />
        </div>
      </div>

      <div className="px-3 pb-4">
        <Typography variant="muted" className="text-[11px] font-bold uppercase tracking-widest px-3 mb-2 opacity-70">
          Active Conversations
        </Typography>
        
        <List className="gap-1">
          {activeConversationIds.length === 0 ? (
             <div className="py-12 px-4 text-center">
               <Typography variant="muted" className="text-sm">No active conversations</Typography>
             </div>
          ) : (
            activeConversationIds.map((id) => {
              const latestMessage = threads[id][threads[id].length - 1];
              const isActive = activeThreadId === id;
              
              return (
                <Link key={id} href={`/chat/${id}`} className="block">
                  <ListItem 
                    className={`p-3 rounded-xl cursor-pointer flex gap-3 transition-all duration-200 border border-transparent ${
                      isActive 
                        ? 'bg-blue-50/80 border-blue-100 shadow-sm' 
                        : 'hover:bg-gray-50 active:scale-[0.98]'
                    }`}
                  >
                     <ListItemIcon className="relative">
                       <Avatar className="w-11 h-11 border-2 border-white shadow-sm">
                         <AvatarFallback className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 font-bold text-xs">
                           {id.substring(0, 2).toUpperCase()}
                         </AvatarFallback>
                       </Avatar>
                       {isConnected && (
                         <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm"></span>
                       )}
                     </ListItemIcon>
                     <ListItemText className="flex-1 overflow-hidden">
                       <div className="flex justify-between items-start mb-0.5">
                         <ListItemTitle className={`truncate text-sm ${isActive ? 'text-blue-700 font-bold' : 'text-gray-900 font-semibold'}`}>
                           Visitor #{id.substring(0, 6)}
                         </ListItemTitle>
                         <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap ml-2">2m ago</span>
                       </div>
                       <ListItemDescription className={`truncate text-xs leading-relaxed ${isActive ? 'text-blue-600/70' : 'text-gray-500'}`}>
                          {latestMessage.text}
                       </ListItemDescription>
                     </ListItemText>
                  </ListItem>
                </Link>
              );
            })
          )}
        </List>
      </div>
    </aside>
  );
}
