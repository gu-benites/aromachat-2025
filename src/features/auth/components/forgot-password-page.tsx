'use client';

import { ForgotPasswordForm } from './auth-forms/forgot-password-form';
import { AuthLayout } from './auth-layout';

export function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Reset your password"
      description="Enter your email and we'll send you a link to reset your password"
      footerText="Remember your password?"
      footerLink={{
        href: "/login",
        text: "Sign in"
      }}
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
