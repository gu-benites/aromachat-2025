import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/providers/theme-provider';
import { QueryProvider } from '@/providers/query-client-provider';
import { AuthSessionProvider } from '@/providers/auth-session-provider';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AromaChat 2025',
  description: 'Next generation chat application',
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Session is now handled by the Providers component

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', inter.className)}>
        <QueryProvider>
          <AuthSessionProvider initialSession={null}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
              enableColorScheme
            >
              <div className="min-h-screen bg-background">
                {children}
                <Toaster position="top-center" />
              </div>
            </ThemeProvider>
          </AuthSessionProvider>
        </QueryProvider>
      </body>
    </html>
  );
}