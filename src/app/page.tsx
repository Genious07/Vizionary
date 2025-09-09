
'use client';

import { useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Accessibility, ShieldCheck, Clapperboard, Presentation, Cpu, Zap, Settings, Languages } from 'lucide-react';
import type { ComponentProps } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Zap,
    title: 'Real-Time Processing',
    body: 'Generates contextual sentences from webcam streams, uploaded images, or short video clips—streaming updated descriptions every 10–12 seconds.',
  },
  {
    icon: Cpu,
    title: 'Ultra-Efficient',
    body: 'Optimized to run on modest infrastructure (2 vCPU, 16 GB RAM) while maintaining fast time-to-first-text.',
  },
  {
    icon: Settings,
    title: 'Production Polish',
    body: 'FastAPI backend, React frontend with WebSocket streaming, plus rate limiting, CORS, and robust error handling.',
  },
  {
    icon: Languages,
    title: 'Extensible & Configurable',
    body: 'Easily add multi-language support, domain-specific prompts, or plug into IoT systems and surveillance pipelines.',
  },
];

const useCases = [
  {
    icon: Accessibility,
    text: 'Improve accessibility with live scene narration.',
  },
  {
    icon: ShieldCheck,
    text: 'Automate monitoring and alerts in security contexts.',
  },
  {
    icon: Clapperboard,
    text: 'Speed up content production with instant captions.',
  },
  {
    icon: Presentation,
    text: 'Run demos in classrooms and developer showcases.',
  },
];

const Section = ({
  className,
  ...props
}: ComponentProps<'section'>) => (
  <section
    className={`w-full max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-20 ${className || ''}`}
    {...props}
  />
);

export default function Home() {
  const mainRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-content',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
      );

      const sections = gsap.utils.toArray('section:not(.hero-section)');
      sections.forEach((section: any) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
        tl.fromTo(
          section.querySelectorAll('.section-title'),
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
        ).fromTo(
          section.querySelectorAll('.card, .use-case-item'),
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.15 },
          '-=0.5'
        );
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="flex flex-col items-center overflow-x-hidden">
      <section
        className="w-full text-center flex flex-col items-center justify-center hero-section min-h-[calc(100vh-theme(height.14))] px-4"
      >
        <div className="hero-content">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            Vizionary: See the World Through Words.
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
            Vizionary — High-fidelity image & video narration on minimal CPU.
          </p>
          <Button asChild size="lg" className="mt-8 font-bold text-lg transition-all duration-300 hover:scale-105">
            <Link href="/studio">Launch Live Studio</Link>
          </Button>
        </div>
      </section>

      <Section>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16 section-title">
          Core Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-secondary/50 border-primary/20 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
              <CardHeader className="flex-row items-center gap-4">
                <div className="p-3 bg-accent rounded-full">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-primary text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>
      
      <Section>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16 section-title">
          Why Vizionary?
        </h2>
        <p className="max-w-4xl mx-auto text-center text-muted-foreground text-lg">
          Vizionary is engineered as a scalable, low-latency web service for real-world deployment where compute is limited but expectations are high. Unlike academic demos, it's built for production with a modular design that helps teams iterate quickly. Swap or fine-tune the Vision Language Model, adjust prompt templates, or attach downstream analytics with ease.
        </p>
      </Section>

      <Section>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16 section-title">
          Use Cases
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
          {useCases.map((useCase, index) => (
            <div key={index} className="flex items-start gap-4 use-case-item">
              <div className="p-3 bg-accent rounded-full">
                <useCase.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="pt-2 text-lg text-foreground">{useCase.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
