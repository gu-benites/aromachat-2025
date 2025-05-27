'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useSignIn, useResendConfirmationEmail } from '@/features/auth/queries';
import { UnconfirmedEmailError } from '@/features/auth/errors/auth.errors';
import { Separator } from '@/components/ui/separator';
import { Mail, CheckCircle2 } from 'lucide-react';

/**
 * Form schema for login form validation
 */
const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

/**
 * Type definition for form values
 */
type FormValues = z.infer<typeof formSchema>;

/**
 * Login form component
 */
export const LoginForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const signUpSuccess = searchParams.get('signup') === 'success';
  const urlError = searchParams.get('error');
  
  /**
   * Form hook with validation and default values
   */
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signInMutation = useSignIn();
  const { mutate: signIn, isPending, error: signInError } = signInMutation;
  const { mutate: resendConfirmation, isPending: isResending } = useResendConfirmationEmail();
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  
  // Force update hook
  const [, updateState] = useState({});
  const forceUpdate = useCallback(() => updateState({}), []);

  /**
   * Tracks the visibility of the password input
   */
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Toggles the visibility of the password input
   */
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  /**
   * Handles resending the confirmation email to the unconfirmed email address
   * Implements rate limiting with a 60-second cooldown between requests
   */
  const handleResendConfirmation = () => {
    if (!unconfirmedEmail || isResending || cooldown > 0) return;
    
    resendConfirmation(unconfirmedEmail, {
      onSuccess: () => {
        setResendSuccess(true);
        setCooldown(60);
        
        // Start cooldown timer
        const timer = setInterval(() => {
          setCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      },
    });
  };

  /**
   * Form submission handler
   */
  const onSubmit = (values: FormValues) => {
    // Reset all error and success states on new submission
    setUnconfirmedEmail(null);
    setResendSuccess(false);
    
    // Clear any previous form errors
    form.clearErrors();
    
    console.log('Submitting login form with email:', values.email);
    
    signIn({
      email: values.email,
      password: values.password,
    });
  };

  // Handle URL errors from redirects
  useEffect(() => {
    if (signUpSuccess) {
      toast.success('Account created successfully! Please sign in.');
    }
    
    if (urlError) {
      toast.error(decodeURIComponent(urlError));
      // Clear the error from the URL
      router.replace('/login', { scroll: false });
    }
  }, [signUpSuccess, urlError, router]);

  // Handle sign-in errors to detect unconfirmed emails
  /**
   * Effect to handle authentication errors and display appropriate UI
   * for unconfirmed email addresses
   */
  useEffect(() => {
    if (!signInError) return;
    
    // Log detailed error information for debugging
    console.log('Sign in error detected:', {
      message: signInError.message,
      name: signInError.name,
      constructor: signInError.constructor?.name,
      isUnconfirmedEmailError: signInError.message?.toLowerCase().includes('unconfirmed') || 
                             signInError.message?.toLowerCase().includes('email not confirmed') ||
                             signInError.message?.toLowerCase().includes('verify your email')
    });
    
    // Check if this is an unconfirmed email error
    const errorMessage = signInError.message?.toLowerCase() || '';
    const isUnconfirmed = (
      signInError instanceof UnconfirmedEmailError ||
      signInError.name === 'UnconfirmedEmailError' ||
      errorMessage.includes('unconfirmed') || 
      errorMessage.includes('email not confirmed') ||
      errorMessage.includes('verify your email') ||
      errorMessage.includes('email not verified')) &&
      !errorMessage.includes('invalid login credentials'); // Make sure it's not just invalid credentials
    
    console.log('Is unconfirmed email error?', { 
      isUnconfirmed, 
      error: signInError,
      message: signInError.message,
      name: signInError.name,
      constructor: signInError.constructor?.name
    });
    
    if (isUnconfirmed) {
      try {
        // First clear any previous form errors
        form.clearErrors();
        
        // Get the email from the form
        const email = form.getValues('email');
        console.log('Setting unconfirmed email:', email);
        
        // Set the unconfirmed email to trigger the UI
        setUnconfirmedEmail(email);
        
        // Force a re-render to ensure the UI updates
        setTimeout(() => {
          forceUpdate({});
        }, 0);
      } catch (error) {
        console.error('Error handling unconfirmed email:', error);
        // Fallback to showing the error in a toast
        toast.error('Please confirm your email address before signing in');
      }
    } else {
      // Show error toast for other errors
      toast.error(signInError.message || 'Failed to sign in');
    }
  }, [signInError, form]);

  return (
    <div className="w-full space-y-6">
      <Button
        variant="outline"
        type="button"
        className="w-full flex items-center justify-center gap-2 bg-background hover:bg-accent"
        disabled={isPending}
      >
        <svg className="w-4 h-4 text-foreground" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="currentColor" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor" />
        </svg>
        Continue with Google
      </Button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 text-xs font-medium text-gray-600 bg-gray-100">
            OR CONTINUE WITH EMAIL
          </span>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    autoComplete="email"
                    disabled={isPending}
                    className="h-10"
                    placeholder="name@example.com"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-sm font-medium">Password</FormLabel>
                  <Link 
                    href="/forgot-password" 
                    className="text-xs font-medium text-primary hover:underline"
                    tabIndex={isPending ? -1 : 0}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    disabled={isPending}
                    className="h-10 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    disabled={isPending}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none disabled:opacity-50"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full h-10 font-medium mt-2" 
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>
      </Form>

      {/* Unconfirmed email UI - shown when user tries to log in with unverified email */}
      {unconfirmedEmail && (
        <div 
          className="mt-4 p-4 border border-warning/20 bg-warning/10 rounded-md text-sm text-warning-foreground"
          role="alert"
          aria-live="polite"
        >
          <div className="flex flex-col space-y-3">
            <p className="font-medium">Your email address hasn't been confirmed yet.</p>
            <p>
              Please check your inbox at{' '}
              <span className="font-semibold text-foreground">{unconfirmedEmail}</span> for a confirmation link.
            </p>
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResendConfirmation}
                disabled={isResending || cooldown > 0}
                className="w-fit hover:bg-warning/20 hover:text-warning-foreground"
                aria-label="Resend confirmation email"
              >
                {isResending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="mr-2 h-4 w-4" />
                )}
                {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Confirmation Email'}
              </Button>
              {resendSuccess && (
                <div className="flex items-center text-success text-sm">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Email sent!
                </div>
              )}
            </div>
            <p className="text-xs text-warning-foreground/80">
              Can't find the email? Check your spam folder or request a new confirmation link.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginForm;
