// Core exports
export {
  executeQuery,
  executeMutation,
  createAuthenticatedExecutor,
} from './services/hasura.service';

export type {
  ExtendedGraphQLResponse,
  isGraphQLErrorResponse,
  isClientError,
  hasRequestProperty,
} from './types/hasura.types';

// Re-export types for convenience
export type { GraphQLClient } from 'graphql-request';
