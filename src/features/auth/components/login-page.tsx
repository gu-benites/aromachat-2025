import { LoginForm } from './auth-forms/login-form';
import { AuthLayout } from './auth-layout';

export function LoginPage() {
  return (
    <AuthLayout
      footerText="Don't have an account?"
      footerLink={{
        href: "/register",
        text: "Sign up"
      }}
    >
      <div className="w-full flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-card p-6 sm:p-8 shadow-lg">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Enter your email and password to sign in
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </AuthLayout>
  );
}