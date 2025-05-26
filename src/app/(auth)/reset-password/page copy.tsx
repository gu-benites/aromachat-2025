'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AuthLayout } from '@/features/auth/components/auth-layout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useResetPassword } from '@/features/auth/queries/use-auth-mutations';
import { resetPasswordSchema, ResetPasswordFormData } from '@/features/auth/schemas/auth.schemas';

// This component is shown when there's no token in the URL
function InvalidResetTokenView() {
  const router = useRouter();
  
  return (
    <div className="space-y-6">
      <div className="space-y-3 text-center">
        <h2 className="text-2xl font-bold tracking-tight">Invalid or Expired Link</h2>
        <p className="text-muted-foreground">
          It looks like you've tried to access the password reset page without a valid link.
        </p>
      </div>
      
      <Alert variant="destructive" className="text-left">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="space-y-2">
          <p>
            This can happen if the link was incomplete, or if it has expired. To ensure your account's security,
            reset links are only valid for a short time.
          </p>
          <p>
            To reset your password, please request a new link from our 'Forgot Password' page.
          </p>
        </AlertDescription>
      </Alert>
      
      <div className="space-y-3 pt-2">
        <Button 
          onClick={() => router.push('/forgot-password')}
          className="w-full"
        >
          Request New Reset Link
        </Button>
        <Button 
          variant="ghost" 
          onClick={() => router.push('/login')}
          className="w-full text-muted-foreground"
        >
          Back to Sign In
        </Button>
      </div>
    </div>
  );
}

// This component is shown when there's a valid token in the URL
function ResetPasswordForm({ token }: { token: string }) {
  const { mutate: resetPassword, isPending, isSuccess } = useResetPassword();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
      token,
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!data.token) {
      return;
    }
    
    resetPassword({
      password: data.password,
      token: data.token,
    });
  };

  if (isSuccess) {
    return (
      <div className="space-y-6">
        <div className="space-y-3 text-center">
          <h2 className="text-2xl font-bold tracking-tight">Password Reset Successful</h2>
          <p className="text-muted-foreground">
            Your password has been reset successfully. You can now sign in with your new password.
          </p>
        </div>
        <Button 
          onClick={() => window.location.href = '/login'}
          className="w-full"
        >
          Back to Login
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Enter your new password"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Confirm your new password"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resetting password...
            </>
          ) : (
            'Reset Password'
          )}
        </Button>
      </form>
    </Form>
  );
}

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  // When there's no token, we want to show a different layout without the default auth layout styling
  if (!token) {
    return (
      <AuthLayout
        title=""
        description=""
        footerText=""
        footerLink={{
          href: "/login",
          text: ""
        }}
      >
        <InvalidResetTokenView />
      </AuthLayout>
    );
  }

  // Normal reset password flow with token
  return (
    <AuthLayout
      title="Reset Password"
      description="Enter your new password below"
      footerText="Remember your password?"
      footerLink={{
        href: "/login",
        text: "Sign in"
      }}
    >
      <Suspense fallback={<div>Loading...</div>}>
        {token ? <ResetPasswordForm token={token} /> : <InvalidResetTokenView />}
      </Suspense>
    </AuthLayout>
  );
}
