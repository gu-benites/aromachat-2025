import { logger } from '@/lib/logger';
import { 
  hasuraClient, 
  createAuthenticatedHasuraClient
} from '@/lib/clients/hasura';
import { env } from '@/config/env';

// Define the shape of a GraphQL response with potential errors
interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{
    message: string;
    path?: string[];
    extensions?: Record<string, any>;
  }>;
}

// Create a scoped logger for the Hasura service
const hasuraLogger = logger.createLogger({ prefix: 'hasura:service' });

/**
 * Executes a GraphQL query against Hasura
 * @template T The expected return type of the query
 * @param query GraphQL query string
 * @param variables Query variables
 * @param accessToken Optional access token for authenticated requests
 * @returns Promise with the query result
 * @throws {Error} If the query fails
 */
export async function executeQuery<T = any>(
  query: string,
  variables: Record<string, any> = {},
  accessToken?: string
): Promise<T> {
  // Ensure we have a valid endpoint
  if (!env.HASURA_GRAPHQL_ENDPOINT) {
    throw new Error('HASURA_GRAPHQL_ENDPOINT is not defined');
  }
  try {

    const client = accessToken 
      ? createAuthenticatedHasuraClient(accessToken)
      : hasuraClient;

    // Ensure variables is always an object
    const safeVariables = variables || {};

    const operationName = extractOperationName(query);
    
    hasuraLogger.debug(`Executing query: ${operationName}`, { 
      operationName,
      hasVariables: !!variables,
      isAuthenticated: !!accessToken
    });

    const response = await client.request<GraphQLResponse<T>>(query, safeVariables);

    if (response.errors && response.errors.length > 0) {
      const errorMessages = response.errors
        .map(e => e.message)
        .join(', ');
      throw new Error(`GraphQL Error: ${errorMessages}`);
    }

    if (!response.data) {
      throw new Error('No data returned from GraphQL query');
    }

    return response.data as T;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    hasuraLogger.error('Failed to execute GraphQL query', {
      error: errorMessage,
      query: extractOperationName(query),
    });
    throw error;
  }
}

/**
 * Executes a GraphQL mutation against Hasura
 * @template T The expected return type of the mutation
 * @param mutation GraphQL mutation string
 * @param variables Mutation variables
 * @param accessToken Optional access token for authenticated requests
 * @returns Promise with the mutation result
 * @throws {Error} If the mutation fails
 */
export async function executeMutation<T = any>(
  mutation: string,
  variables: Record<string, any> = {},
  accessToken?: string
): Promise<T> {
  try {
    // Reuse the same implementation as executeQuery since the underlying client is the same
    return await executeQuery<T>(mutation, variables, accessToken);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error executing mutation';
    hasuraLogger.error(`Mutation failed: ${errorMessage}`, {
      mutation: mutation.substring(0, 100) + (mutation.length > 100 ? '...' : ''),
      variables: JSON.stringify(variables),
    });
    throw error;
  }
}

/**
 * Extracts the operation name from a GraphQL query/mutation string
 * @param query GraphQL query/mutation string
 * @returns The operation name or 'unnamed_operation' if not found
 */
function extractOperationName(query: string): string {
  const match = query.match(/^(query|mutation|subscription)\s+(\w+)/);
  return match ? match[2] : 'unnamed_operation';
}

/**
 * Creates a new authenticated Hasura client instance
 * @param accessToken JWT access token for authentication
 * @returns A function that can execute GraphQL operations with the provided token
 */
export async function createAuthenticatedExecutor(accessToken: string) {
  if (!accessToken) {
    throw new Error('Access token is required for authenticated executor');
  }

  return async <T = any>(
    query: string,
    variables: Record<string, any> = {}
  ): Promise<T> => {
    return executeQuery<T>(query, variables, accessToken);
  };
}

/**
 * Execute a mutation with the authenticated client
 * @template T The expected return type of the mutation
 * @param mutation GraphQL mutation string
 * @param variables Mutation variables
 * @param accessToken Access token for authentication
 * @returns Promise with the mutation result
 * @throws {Error} If the mutation fails or access token is not provided
 */
export async function executeAuthenticatedMutation<T = any>(
  mutation: string,
  variables: Record<string, any> = {},
  accessToken: string
): Promise<T> {
  if (!accessToken) {
    throw new Error('Access token is required for authenticated mutations');
  }
  return executeMutation<T>(mutation, variables, accessToken);
}
