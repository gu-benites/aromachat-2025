import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names and merges Tailwind CSS classes
 * @param inputs - Class values to combine
 * @returns A single string of combined class names
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date string or timestamp into a human-readable format
 * @param input - Date string or timestamp
 * @returns Formatted date string (e.g., "May 23, 2023")
 */
export function formatDate(input: string | number): string {
  const date = new Date(input);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Creates an absolute URL by appending the path to the base URL
 * @param path - The path to append to the base URL
 * @returns The complete absolute URL
 */
export function absoluteUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  // Ensure the path starts with a slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  // Remove any trailing slashes from the base URL
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, '');
  return `${normalizedBaseUrl}${normalizedPath}`;
}

// Re-export commonly used utilities
export * from './utils';
