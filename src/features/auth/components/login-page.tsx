import { LoginForm } from './auth-forms/login-form';
import { AuthLayout } from './auth-layout';

export function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      description="Enter your email and password to sign in to your account"
      footerText="Don't have an account?"
      footerLink={{
        href: "/register",
        text: "Sign up"
      }}
    >
      <LoginForm />
    </AuthLayout>
  );
}