/**
 * Extracts the operation name from a GraphQL query string.
 * @param query The GraphQL query string
 * @returns The operation name or 'anonymous' if not found
 */
export function extractOperationName(query: string): string {
  if (!query) return 'anonymous';
  
  const match = query.match(/^(?:query|mutation|subscription)\s+(\w+)/);
  return match?.[1] || 'anonymous';
}

/**
 * Safely extracts variables from a GraphQL request.
 * @param request The GraphQL request object
 * @returns An object containing variables if they exist
 */
export function extractVariables<Variables = Record<string, unknown>>(
  request: unknown
): { variables: Variables | undefined } {
  if (
    request &&
    typeof request === 'object' &&
    'variables' in request &&
    request.variables &&
    typeof request.variables === 'object'
  ) {
    return { variables: request.variables as Variables };
  }
  return { variables: undefined };
}

/**
 * Safely extracts the operation name from a GraphQL request.
 * @param request The GraphQL request object
 * @returns The operation name or 'anonymous' if not found
 */
export function extractRequestOperationName(request: unknown): string {
  if (!request || typeof request !== 'object') return 'anonymous';
  
  // Check for operationName property
  if ('operationName' in request && typeof request.operationName === 'string') {
    return request.operationName || 'anonymous';
  }
  
  // Try to extract from query
  if ('query' in request && typeof request.query === 'string') {
    return extractOperationName(request.query);
  }
  
  return 'anonymous';
}

/**
 * Creates a standardized error object for GraphQL errors.
 * @param error The error object or string
 * @param context Additional context about where the error occurred
 * @returns A standardized error object
 */
export function createGraphQLError(
  error: unknown,
  context: Record<string, unknown> = {}
): { message: string; code: string; context: Record<string, unknown> } {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  return {
    message: errorMessage,
    code: 'GRAPHQL_ERROR',
    context: {
      ...context,
      stack: error instanceof Error ? error.stack : undefined,
    },
  };
}
