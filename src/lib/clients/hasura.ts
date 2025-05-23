import { GraphQLClient } from 'graphql-request';
import { env } from '@/config/env';

/**
 * Creates a new GraphQL client for Hasura with the provided access token
 * @param accessToken Optional access token for authenticated requests
 * @returns Configured GraphQLClient instance
 */
function createHasuraClient(accessToken?: string) {
  // Use the validated environment variable from our config
  const endpoint = env.HASURA_GRAPHQL_ENDPOINT;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add admin secret or access token if provided
  if (env.HASURA_GRAPHQL_ADMIN_SECRET) {
    headers['x-hasura-admin-secret'] = env.HASURA_GRAPHQL_ADMIN_SECRET;
  } else if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return new GraphQLClient(endpoint, { headers });
}

/**
 * Default Hasura client instance (unauthenticated or using admin secret)
 */
export const hasuraClient = createHasuraClient();

/**
 * Creates a new Hasura client with the provided access token
 * @param accessToken JWT access token for authentication
 * @returns Configured GraphQLClient instance with access token
 */
export function createAuthenticatedHasuraClient(accessToken: string) {
  if (!accessToken) {
    throw new Error('Access token is required for authenticated Hasura client');
  }
  return createHasuraClient(accessToken);
}

// Re-export types for convenience
export type { GraphQLClient } from 'graphql-request';
