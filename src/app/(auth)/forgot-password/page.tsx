import { ForgotPasswordForm } from '@/features/auth/components/auth-forms/forgot-password-form';
import { AuthLayout } from '@/features/auth/components/auth-layout';

export default function ForgotPasswordPage() {
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
