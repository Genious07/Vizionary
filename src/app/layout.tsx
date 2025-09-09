import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/Header';
import { Toaster } from "@/components/ui/toaster";
import { Inter } from 'next/font/google';
import { Footer } from '@/components/Footer';
import DevToolsDisabler from '@/components/DevToolsDisabler';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Vizionary',
  description: 'See the World Through Words.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.className
        )}
      >
        <DevToolsDisabler />
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
