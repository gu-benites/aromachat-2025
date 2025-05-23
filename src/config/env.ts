import { z } from 'zod';

const envSchema = z.object({
  // Core
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  
  // NextAuth
  NEXTAUTH_SECRET: z.string().min(1, 'NEXTAUTH_SECRET is required'),
  NEXTAUTH_URL: z.string().url().default('http://localhost:3000'),
  
  // Database
  DATABASE_URL: z.string().url('Invalid database URL'),
  
  // Authentication Providers
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  
  // Hasura
  HASURA_GRAPHQL_ENDPOINT: z
    .string()
    .url('HASURA_GRAPHQL_ENDPOINT must be a valid URL')
    .default('http://localhost:8080/v1/graphql'),
  
  HASURA_GRAPHQL_ADMIN_SECRET: z
    .string()
    .min(1, 'HASURA_GRAPHQL_ADMIN_SECRET is required in production')
    .optional(),
  
  HASURA_GRAPHQL_JWT_SECRET: z
    .string()
    .min(1, 'HASURA_GRAPHQL_JWT_SECRET is required for JWT authentication')
    .optional(),
  
  // Optional: For development with Hasura Console
  HASURA_GRAPHQL_CONSOLE: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
  
  // Optional: Enable/disable Hasura Console in development
  HASURA_GRAPHQL_DEV_MODE: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
});

// Parse and validate environment variables
export const env = (() => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Format validation errors for better readability
      const formattedErrors = error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message,
      }));
      
      console.error('❌ Invalid environment variables:', formattedErrors);
      process.exit(1);
    }
    throw error;
  }
})();

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
