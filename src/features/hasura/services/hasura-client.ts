import { GraphQLClient, type RequestMiddleware, type ResponseMiddleware } from 'graphql-request';
import { logger } from '@/lib/logger';
import { env } from '@/config/env';
import { 
  extractOperationName, 
  extractRequestOperationName, 
  extractVariables 
} from '../utils/graphql-utils';
import type { 
  ExtendedGraphQLResponse,
  isGraphQLErrorResponse,
  isClientError,
  hasRequestProperty
} from '../types/hasura.types';

// Create a scoped logger for the Hasura client
const hasuraLogger = logger.createLogger({ prefix: 'hasura:client' });

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

  const client = new GraphQLClient(endpoint, {
    headers,
    // Enable retries for transient errors
    requestMiddleware: (async (request) => {
      try {
        // Extract operation name and variables for logging
        const operationName = extractRequestOperationName(request);
        const { variables } = extractVariables(request);
        
        // Create log data
        const logData: {
          operationName: string;
          variables?: Record<string, unknown>;
        } = { operationName };
        
        if (variables) {
          logData.variables = variables;
        }
        
        hasuraLogger.debug(`Executing ${operationName}`, logData);
        
        return request;
      } catch (error) {
        // Ensure we never throw from within the request middleware
        hasuraLogger.error('Error in GraphQL request middleware', {
          error: error instanceof Error ? error.message : String(error),
        });
        return request;
      }
    }) as RequestMiddleware,
    responseMiddleware: ((response: unknown) => {
      try {
        // Handle ClientError
        if (isClientError(response)) {
          const operationName = response.request?.query
            ? extractOperationName(response.request.query)
            : 'unknown';
            
          hasuraLogger.error('GraphQL Client Error', {
            message: response.message,
            statusCode: response.response.status,
            operationName,
          });
        }
        // Handle GraphQL response with errors
        else if (isGraphQLErrorResponse(response)) {
          let operationName = 'unknown';
          
          // Try to get operation name from the request if available
          if (hasRequestProperty(response) && response.request?.query) {
            operationName = extractOperationName(response.request.query);
          }
          
          hasuraLogger.error('GraphQL Error', { 
            errors: (response as any).errors,
            operationName,
          });
        }
        // Handle successful response with data
        else if (response && typeof response === 'object' && 'data' in response) {
          let operationName = 'unknown';
          const res = response as ExtendedGraphQLResponse<unknown>;
          
          // Try to get operation name from the request if available
          if (hasRequestProperty(res) && res.request?.query) {
            operationName = extractOperationName(res.request.query);
          }
          
          hasuraLogger.debug('GraphQL Response', { 
            operationName,
            // Only log a small part of the data to avoid logging too much
            data: 'data received' // Simplified for brevity
          });
        }
        
        return response;
      } catch (error) {
        // Ensure we never throw from within the response middleware
        hasuraLogger.error('Error in GraphQL response middleware', {
          error: error instanceof Error ? error.message : String(error),
        });
        return response;
      }
    }) as unknown as ResponseMiddleware,
  });

  return client;
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
