import { z } from 'zod';

/**
 * Zod schema for user registration form validation.
 * Validates email, password strength, and ensures password confirmation matches.
 */
export const signUpSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
    confirmPassword: z.string(),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

/**
 * Zod schema for user sign-in form validation.
 * Validates email format and requires a non-empty password.
 */
export const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

/** Type representing the shape of registration form data */
export type SignUpFormData = z.infer<typeof signUpSchema>;

/** Type representing the shape of sign-in form data */
export type SignInFormData = z.infer<typeof signInSchema>;