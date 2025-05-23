import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome to AromaChat 2025
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Experience the next generation of chat applications with real-time messaging, secure
                  communications, and an intuitive interface.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild size="lg">
                  <Link href="/chat">Get Started</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Features
                </h2>
                <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Discover what makes AromaChat the best choice for your messaging needs.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: 'Real-time Messaging',
                  description: 'Chat with friends and colleagues in real-time with our lightning-fast messaging system.',
                },
                {
                  title: 'Secure Communications',
                  description: 'End-to-end encryption ensures your conversations stay private and secure.',
                },
                {
                  title: 'Intuitive Interface',
                  description: 'A clean, modern interface that makes chatting simple and enjoyable.',
                },
              ].map((feature, index) => (
                <div key={index} className="rounded-lg border bg-card p-6 shadow-sm">
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}