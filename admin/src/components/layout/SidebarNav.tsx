"use client";

import Link from 'next/link';
import { MessageSquare, BarChart3, Settings, LogOut } from 'lucide-react';
import { Button, Avatar, AvatarFallback, Sidebar, SidebarContent, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'intracom-ui';
import { useAuth } from '@/contexts/AuthContext';

export function SidebarNav({ activeTab }: { activeTab: string }) {
  const { logout } = useAuth();

  return (
    <TooltipProvider delayDuration={0}>
      <Sidebar className="w-[72px] flex !lg:w-[72px] !xl:w-[72px] border-r flex-col items-center py-6 gap-8 shrink-0 bg-white shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">
        <Link href="/chat">
          <Avatar className="w-10 h-10 cursor-pointer hover:scale-105 transition-transform duration-200 ring-2 ring-transparent hover:ring-blue-100">
            <AvatarFallback className="bg-blue-600 text-white font-bold text-sm tracking-tighter">
              IC
            </AvatarFallback>
          </Avatar>
        </Link>
        
        <SidebarContent className="flex flex-col gap-4 w-full px-3 overflow-visible items-center">
          <NavIcon 
            href="/chat" 
            icon={<MessageSquare size={22} />} 
            label="Conversations" 
            isActive={activeTab === 'chat'} 
          />
          <NavIcon 
            href="/stats" 
            icon={<BarChart3 size={22} />} 
            label="Analytics" 
            isActive={activeTab === 'stats'} 
          />
          <NavIcon 
            href="/settings" 
            icon={<Settings size={22} />} 
            label="Settings" 
            isActive={false} 
          />
        </SidebarContent>

        <div className="mt-auto pb-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={logout}
                className="w-12 h-12 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
              >
                <LogOut size={22} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Logout</TooltipContent>
          </Tooltip>
        </div>
      </Sidebar>
    </TooltipProvider>
  );
}

function NavIcon({ href, icon, label, isActive }: { href: string, icon: React.ReactNode, label: string, isActive: boolean }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={href} className="w-full flex justify-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className={`w-12 h-12 rounded-xl transition-all duration-200 ${
              isActive 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 hover:text-white' 
                : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            {icon}
          </Button>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
