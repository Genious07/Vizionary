"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Video } from 'lucide-react';
import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/studio', label: 'Live Studio' },
];

export function Header() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.fromTo(headerRef.current, { y: -100 }, { y: 0, duration: 1, ease: 'power3.out' });
  }, []);

  return (
    <header ref={headerRef} className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Video className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Vizionary</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'transition-colors hover:text-primary',
                pathname === href ? 'text-primary font-semibold' : 'text-foreground/60'
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
