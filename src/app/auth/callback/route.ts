// src/app/auth/callback/route.ts
import { handleAuthCallback } from '@/features/auth/actions';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  return handleAuthCallback(request);
}