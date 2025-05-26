// This file ensures TypeScript can find the login form component
declare module '@/features/auth/components/login-form' {
  import { FC } from 'react';
  
  const LoginForm: FC;
  export default LoginForm;
}
