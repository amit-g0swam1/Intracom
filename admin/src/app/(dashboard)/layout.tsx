"use client";

import { SidebarNav } from '@/components/layout/SidebarNav';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const activeTab = pathname.startsWith('/chat') ? 'chat' : pathname.startsWith('/stats') ? 'stats' : 'chat';

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SidebarNav activeTab={activeTab} />
      <main className="flex-1 flex overflow-hidden">
        {children}
      </main>
    </div>
  );
}
