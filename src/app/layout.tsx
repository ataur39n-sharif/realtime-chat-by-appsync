import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true
});

export const metadata: Metadata = {
  title: 'Team Messaging App',
  description: 'Real-time team messaging application with AWS AppSync',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="referrer" content="origin-when-cross-origin" />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}