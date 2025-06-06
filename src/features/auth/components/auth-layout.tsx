'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

type AuthLayoutProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  footerText: string;
  footerLink: {
    href: string;
    text: string;
  };
};

export function AuthLayout({
  children,
  title,
  description,
  footerText,
  footerLink,
}: AuthLayoutProps) {
  return (
    <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          AromaChat
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Connect with your customers through the power of scent.&rdquo;
            </p>
            <footer className="text-sm">AromaChat Team</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8 w-full">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6">
          {title && description && (
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                {title}
              </h1>
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
            </div>
          )}
          <div className="w-full">
            {children}
          </div>
          <p className="px-8 text-center text-sm text-muted-foreground">
            {footerText}{' '}
            <Link
              href={footerLink.href}
              className="underline underline-offset-4 hover:text-primary"
            >
              {footerLink.text}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
