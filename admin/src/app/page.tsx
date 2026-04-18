"use client";

import { useSocket } from '@/components/SocketProvider';
import { useState } from 'react';
import { MessageSquare, Users, Settings } from 'lucide-react';

export default function Dashboard() {
  const { socket, isConnected, messages } = useSocket();
  const [replyText, setReplyText] = useState('');
  
  // Group messages by conversation ID
  const threads = messages.reduce((acc: any, msg: any) => {
    if (!acc[msg.conversationId]) acc[msg.conversationId] = [];
    acc[msg.conversationId].push(msg);
    return acc;
  }, {});

  const activeConversationIds = Object.keys(threads);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  const activeMessages = activeThreadId ? threads[activeThreadId] : [];

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || !replyText.trim() || !activeThreadId) return;

    socket.emit('send_message', {
      conversationId: activeThreadId,
      senderId: 'admin',
      text: replyText.trim(),
      isAdmin: true
    });

    setReplyText('');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar Navigation */}
      <nav className="w-16 bg-white border-r flex flex-col items-center py-4 gap-8 shrink-0">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold cursor-pointer hover:bg-blue-700 transition">
          IC
        </div>
        <div className="flex flex-col gap-4">
           <button className="p-3 bg-blue-50 text-blue-600 rounded-xl relative group">
              <MessageSquare size={24} />
           </button>
           <button className="p-3 text-gray-400 hover:text-blue-600 hover:bg-gray-50 rounded-xl transition">
              <Users size={24} />
           </button>
           <button className="p-3 text-gray-400 hover:text-blue-600 hover:bg-gray-50 rounded-xl transition">
              <Settings size={24} />
           </button>
        </div>
      </nav>

      {/* Inbox List */}
      <aside className="w-80 bg-white border-r flex flex-col shrink-0">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Inbox</h2>
          <div className="flex items-center text-sm mt-1 gap-2 text-gray-500">
             <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
             {isConnected ? 'Connected to Gateway' : 'Disconnected'}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {activeConversationIds.length === 0 ? (
             <div className="p-8 text-center text-gray-400 text-sm">No active conversations</div>
          ) : (
            activeConversationIds.map((id) => (
              <div 
                key={id}
                onClick={() => setActiveThreadId(id)}
                className={`p-4 border-b cursor-pointer transition-colors ${activeThreadId === id ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-gray-50 border-l-4 border-l-transparent'}`}
              >
                 <div className="font-medium text-sm text-gray-900 truncate">Visitor #{id.substring(0, 8)}</div>
                 <div className="text-xs text-gray-500 mt-1 truncate">
                    {threads[id][threads[id].length - 1].text}
                 </div>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col bg-white">
         {activeThreadId ? (
            <>
              {/* Thread Header */}
              <header className="p-4 border-b bg-white flex justify-between items-center">
                 <h3 className="font-semibold text-gray-800">Thread: {activeThreadId}</h3>
              </header>

              {/* Messages Area */}
              <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 bg-gray-50">
                 {activeMessages.map((msg: any, i: number) => {
                    const isAdmin = msg.isAdmin;
                    return (
                      <div key={i} className={`flex w-full ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                         <div className={`max-w-[70%] p-3 rounded-2xl ${isAdmin ? 'bg-blue-600 text-white rounded-br-sm shadow-md' : 'bg-white border text-gray-800 rounded-bl-sm shadow-sm'}`}>
                            {msg.text}
                         </div>
                      </div>
                    )
                 })}
              </div>

              {/* Reply Input */}
              <div className="p-4 bg-white border-t">
                 <form onSubmit={handleReply} className="flex gap-2">
                    <input 
                      type="text" 
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type a reply to visitor..." 
                      className="flex-1 p-3 bg-gray-100 rounded-xl border border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    />
                    <button 
                       type="submit" 
                       disabled={!replyText.trim() || !isConnected}
                       className="px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                     >
                       Send
                    </button>
                 </form>
              </div>
            </>
         ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
               <MessageSquare size={48} className="mx-auto mb-4 text-blue-200" />
               <p className="text-gray-500">Select a conversation to start chatting</p>
            </div>
         )}
      </main>
    </div>
  );
}
