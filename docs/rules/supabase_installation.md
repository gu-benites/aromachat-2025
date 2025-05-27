Setting Up Server-Side Authentication with Supabase in Next.js
This guide outlines how to configure server-side authentication using Supabase in a Next.js project, ensuring secure session management and optimal performance for both client-side and server-side operations.
Prerequisites
Before starting, ensure you have:

A Supabase Project: Create one at Supabase.
API Keys: Obtain your project’s URL and anon key from the Supabase dashboard:
Navigate to Settings > API.
Copy the NEXT_PUBLIC_SUPABASE_URL (e.g., https://your-project.supabase.co).
Copy the NEXT_PUBLIC_SUPABASE_ANON_KEY.


Node.js and Next.js: A Next.js project set up and running.

Step 1: Install Required Packages
Install the necessary Supabase packages for server-side authentication:

@supabase/supabase-js: Core Supabase client library.
@supabase/ssr: Package for server-side rendering support in Next.js.

Run the following command in your project’s root directory:
npm install @supabase/supabase-js @supabase/ssr

Step 2: Configure Environment Variables
Store your Supabase API keys securely in a .env.local file in the project’s root directory:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

Replace your_supabase_project_url and your_supabase_anon_key with the values from your Supabase dashboard. Next.js will load these variables automatically.
Security Note: Never expose API keys in client-side code; always use environment variables.
Step 3: Set Up Supabase Clients
Next.js requires separate Supabase clients for client-side (browser) and server-side (server components, actions, or API routes) use to handle sessions appropriately.
3.1 Client-Side Supabase Client
Create a file at src\lib\clients\supabase\client.ts for browser-based operations:
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

This client supports authentication and real-time features in the browser.
3.2 Server-Side Supabase Client
Create a file at src\lib\clients\supabase\server.ts for server-side operations, ensuring request-specific cookie handling:
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        }
      }
    }
  )
}

The cookies() helper from next/headers ensures proper session management on the server.

Step 4.1 Implement Next.js Middleware Entry Point for Auth Session Handling
Create a middleware.js file in the project’s root directory:

This file serves as the entry point for Next.js middleware, intercepting all incoming requests (except static assets) and forwarding them to the custom updateSession function. It ensures that authentication sessions are validated and managed consistently before any route is processed. It uses a matcher to exclude static files and images from middleware processing for performance reasons.

import { type NextRequest } from 'next/server'
import { updateSession } from '@/features/auth/utils/api-auth.utils'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}


Step 4.2: Supabase Session Middleware Handler
Middleware refreshes authentication tokens and manages cookies for server-side rendering. Create a src\features\auth\utils\api-auth.utils.ts file:

This module defines the updateSession function, which:
- Creates a Supabase server client with custom cookie handling.
- Retrieves the authenticated user session using supabase.auth.getUser().
- If no user is found and the route isn't public (/login or /auth), it redirects the request to the login page.
- Ensures proper syncing of session cookies between client and server by managing NextResponse correctly.

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}


Step 5: Use Supabase in Your Project

Use a Server Action to call the Supabase signup function.

Since Supabase is being called from an Action, use the client defined in @/lib/clients/supabase/server

## Example login form: src\features\auth\components\auth-forms\login-form.tsx
import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <form>
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <button formAction={login}>Log in</button>
      <button formAction={signup}>Sign up</button>
    </form>
  )
}

## Example login actions: src\features\auth\actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/clients/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

Example error usage: 

'use client'
export default function ErrorPage() {
  return <p>Sorry, something went wrong</p>
}

Step 6: Change the Auth confirmation path

If you have email confirmation turned on (the default), a new user will receive an email confirmation after signing up.

Change the email template to support a server-side authentication flow.

Go to the Auth templates page in your dashboard. In the Confirm signup template, change {{ .ConfirmationURL }} to {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email.

Step 7: Create a route handler for Auth confirmation
Create a Route Handler for auth/confirm. When a user clicks their confirmation email link, exchange their secure code for an Auth token.

Since this is a Router Handler, use the Supabase client from @/lib/clients/supabase/server

Step 8: Access user info from Server Component

Server Components can read cookies, so you can get the Auth status and user info.

Since you're calling Supabase from a Server Component, use the client created in @/lib/clients/supabase/server

Create a private page (@/app/private/page.tsx) that users can only access if they're logged in. The page displays their email.

import { redirect } from 'next/navigation'

import { createClient } from '@/lib/clients/supabase/server'

export default async function PrivatePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return <p>Hello {data.user.email}</p>
}