/**
 * Extracts the operation name from a GraphQL query string
 * @param query GraphQL query string
 * @returns The operation name or 'unnamed_operation' if not found
 */
export function extractOperationName(query: string): string {
  const match = query.match(/^(query|mutation|subscription)\s+(\w+)/);
  return match ? match[2] : 'unnamed_operation';
}

/**
 * Extracts the operation name from a GraphQL request object
 * @param request GraphQL request object
 * @returns The operation name or 'unnamed_operation' if not found
 */
export function extractRequestOperationName(
  request: { query?: string } | string
): string {
  const query = typeof request === 'string' ? request : request.query || '';
  return extractOperationName(query);
}

/**
 * Extracts variables from a GraphQL request object
 * @param request GraphQL request object
 * @returns An object containing the variables
 */
export function extractVariables<T = Record<string, unknown>>(
  request: { variables?: T } | undefined
): { variables: T | undefined } {
  if (!request) return { variables: undefined };
  return { variables: request.variables };
}

/**
 * Type guard to check if an object is a GraphQL response with errors
 * @param response The response to check
 * @returns True if the response contains GraphQL errors
 */
export function isGraphQLErrorResponse(
  response: unknown
): response is { 
  errors: Array<{ message: string }>; 
  request?: { query?: string } 
} {
  return (
    typeof response === 'object' &&
    response !== null &&
    'errors' in response &&
    Array.isArray((response as any).errors)
  );
}

/**
 * Type guard to check if an object is a ClientError
 * @param error The error to check
 * @returns True if the error is a ClientError
 */
export function isClientError(
  error: unknown
): error is { 
  response: { status: number }; 
  request: { query?: string };
  message: string;
} {
  return (
    error instanceof Error &&
    'response' in error &&
    'request' in error &&
    'message' in error
  );
}

/**
 * Type guard to check if a response has a request property
 * @param response The response to check
 * @returns True if the response has a request property
 */
export function hasRequestProperty(
  response: unknown
): response is { request?: { query?: string } } {
  return (
    typeof response === 'object' &&
    response !== null &&
    'request' in response
  );
}
