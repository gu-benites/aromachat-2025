import { type NextRequest, NextResponse } from 'next/server';
import { z, type ZodSchema } from 'zod';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { Database } from '@/types/database.types';

export type ApiHandlerContext<TBody = unknown, TQuery = unknown> = {
  user: AuthenticatedUser;
  validatedBody: TBody;
  validatedQuery: TQuery;
  params: Record<string, string>;
};

export type AuthenticatedUser = {
  id: string;
  email: string;
  // Add other user properties as needed
};

type CreateApiRouteHandlerOptions<TBody extends ZodSchema, TQuery extends ZodSchema> = {
  schema?: TBody;
  querySchema?: TQuery;
  requireAuth?: boolean;
  handler: (
    req: NextRequest,
    context: ApiHandlerContext<
      TBody extends ZodSchema ? z.infer<TBody> : undefined,
      TQuery extends ZodSchema ? z.infer<TQuery> : undefined
    >
  ) => Promise<NextResponse>;
};

export function createApiRouteHandler<TBody extends ZodSchema, TQuery extends ZodSchema>({
  schema,
  querySchema,
  requireAuth = true,
  handler,
}: CreateApiRouteHandlerOptions<TBody, TQuery>) {
  return async function (req: NextRequest, { params }: { params: Record<string, string> }) {
    try {
      // Get authenticated user
      const { user, error: authError } = await getAuthenticatedUserFromRequest(req);
      
      if (requireAuth && authError) {
        return NextResponse.json(
          { message: 'Unauthorized', error: authError.message },
          { status: 401 }
        );
      }

      // Parse and validate request body if schema is provided
      let validatedBody: unknown;
      if (schema && ['POST', 'PUT', 'PATCH'].includes(req.method)) {
        const result = await validateRequestBodyWithZod(req, schema);
        if (result.error) {
          return result.error;
        }
        validatedBody = result.data;
      }

      // Parse and validate query params if querySchema is provided
      let validatedQuery: unknown;
      if (querySchema) {
        const searchParams = Object.fromEntries(req.nextUrl.searchParams);
        const result = querySchema.safeParse(searchParams);
        if (!result.success) {
          return NextResponse.json(
            { message: 'Validation error', errors: result.error.format() },
            { status: 400 }
          );
        }
        validatedQuery = result.data;
      }

      // Call the handler with validated data
      return await handler(req, {
        user: user!,
        validatedBody: validatedBody as TBody extends ZodSchema ? z.infer<TBody> : undefined,
        validatedQuery: validatedQuery as TQuery extends ZodSchema ? z.infer<TQuery> : undefined,
        params,
      });
    } catch (error) {
      console.error('API Error:', error);
      return NextResponse.json(
        { message: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

async function getAuthenticatedUserFromRequest(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient<Database>(
      process.env['NEXT_PUBLIC_SUPABASE_URL']!,
      process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session?.user) {
      return { user: null, error: error || new Error('No active session') };
    }

    return {
      user: {
        id: session.user.id,
        email: session.user.email!,
        // Map other user properties as needed
      },
      error: null,
    };
  } catch (error) {
    console.error('Auth error:', error);
    return { user: null, error: error instanceof Error ? error : new Error('Authentication failed') };
  }
}

async function validateRequestBodyWithZod<T extends ZodSchema>(
  req: NextRequest,
  schema: T
): Promise<{ data: z.infer<T>; error: null } | { data: null; error: NextResponse }> {
  try {
    const body = await req.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return {
        data: null,
        error: NextResponse.json(
          { message: 'Validation error', errors: result.error.format() },
          { status: 400 }
        ),
      };
    }

    return { data: result.data, error: null };
  } catch (error) {
    console.error('Request body parsing error:', error);
    return {
      data: null,
      error: NextResponse.json(
        { message: 'Invalid request body' },
        { status: 400 }
      ),
    };
  }
}

// Frontend API utilities
export async function authenticatedGet<T>(url: string, options?: RequestInit): Promise<T> {
  return authenticatedFetch<T>(url, { ...options, method: 'GET' });
}

export async function authenticatedPost<T, U = unknown>(
  url: string,
  body: U,
  options?: RequestInit
): Promise<T> {
  return authenticatedFetch<T>(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
}

export async function authenticatedFormPost<T>(
  url: string,
  formData: FormData,
  options?: RequestInit
): Promise<T> {
  return authenticatedFetch<T>(url, {
    ...options,
    method: 'POST',
    body: formData,
    // Don't set Content-Type header, let the browser set it with the correct boundary
    headers: {
      ...options?.headers,
    },
  });
}

async function authenticatedFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Request failed with status ${response.status}`
    );
  }

  return response.json();
}
