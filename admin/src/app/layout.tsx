import type { Metadata } from 'next';
import './globals.css';
import { SocketProvider } from '@/components/SocketProvider';

export const metadata: Metadata = {
  title: 'Intracom Admin Dashboard',
  description: 'Manage active chats in real-time',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 text-gray-900">
        <SocketProvider>
          {children}
        </SocketProvider>
      </body>
    </html>
  );
}
