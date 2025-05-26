import { RegisterForm } from '@/features/auth/components/auth-forms/register-form';
import { AuthLayout } from '@/features/auth/components/auth-layout';

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create an account"
      description="Enter your information to create an account"
      footerText="Already have an account?"
      footerLink={{
        href: "/login",
        text: "Sign in"
      }}
    >
      <RegisterForm />
    </AuthLayout>
  );
}
