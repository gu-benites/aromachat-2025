/**
 * Extended GraphQL response type that includes custom properties
 * @template T The type of the data in the response
 */
export interface ExtendedGraphQLResponse<T = unknown> {
  /** The data returned by the GraphQL query */
  data?: T;
  /** Any errors returned by the GraphQL server */
  errors?: Array<{ message: string }>;
  /** Any extensions returned by the GraphQL server */
  extensions?: Record<string, unknown>;
  /** The HTTP status code of the response */
  status?: number;
  /** The request that generated this response */
  request?: {
    /** The GraphQL query or mutation */
    query?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
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
