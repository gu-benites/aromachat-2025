import { RegisterForm } from './auth-forms/register-form';
import { AuthLayout } from './auth-layout';

export function RegisterPage() {
  return (
    <AuthLayout
      footerText="Already have an account?"
      footerLink={{
        href: "/login",
        text: "Sign in"
      }}
    >
      <div className="w-full flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-card p-6 sm:p-8 shadow-lg">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight">Create an account</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Enter your information to get started
            </p>
          </div>
          <RegisterForm />
        </div>
      </div>
    </AuthLayout>
  );
}
