/**
 * Application-wide constants
 * 
 * This file contains constants that are used throughout the application.
 * Avoid adding environment-specific values here; use environment variables instead.
 */

// API-related constants
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Local storage keys
export const LOCAL_STORAGE_KEYS = {
  THEME: 'theme',
  TOKEN: 'auth_token',
  USER: 'user',
} as const;

// Route paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  CHAT: '/chat',
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_PAGE: 1,
} as const;

// Feature flags
export const FEATURES = {
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  ENABLE_MAINTENANCE: process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true',
} as const;

// Date/time formats
export const DATE_FORMATS = {
  DATE: 'yyyy-MM-dd',
  DATE_TIME: 'yyyy-MM-dd HH:mm',
  TIME: 'HH:mm',
  READABLE_DATE: 'MMM d, yyyy',
  READABLE_DATE_TIME: 'MMM d, yyyy h:mm a',
} as const;

// Validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W_]{8,}$/,
  PHONE: /^\+?[0-9\s-()]{10,}$/,
  URL: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/,
} as const;
