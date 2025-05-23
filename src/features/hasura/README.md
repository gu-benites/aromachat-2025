# Hasura Feature

This feature provides a type-safe, well-documented interface for interacting with Hasura GraphQL API.

## Usage

### Basic Query

```typescript
import { executeQuery } from '@/features/hasura';

const GET_USERS = `
  query GetUsers {
    users {
      id
      email
      name
    }
  }
`;

async function fetchUsers() {
  try {
    const { users } = await executeQuery<{ users: Array<{ id: string; email: string; name: string }> }>(GET_USERS);
    return users;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
}
```

### Authenticated Query/Mutation

```typescript
import { createAuthenticatedExecutor } from '@/features/hasura';

const UPDATE_PROFILE = `
  mutation UpdateProfile($id: uuid!, $name: String!) {
    update_users_by_pk(pk_columns: { id: $id }, _set: { name: $name }) {
      id
      name
    }
  }
`;

async function updateUserName(userId: string, newName: string, accessToken: string) {
  const { query, mutate } = createAuthenticatedExecutor(accessToken);
  
  try {
    const { update_users_by_pk: updatedUser } = await mutate<{ 
      update_users_by_pk: { id: string; name: string } 
    }>(UPDATE_PROFILE, { 
      id: userId, 
      name: newName 
    });
    
    return updatedUser;
  } catch (error) {
    console.error('Failed to update user:', error);
    throw error;
  }
}
```

## API Reference

### `executeQuery<T>(query: string, variables?: Record<string, any>, accessToken?: string): Promise<T>`

Executes a GraphQL query against the Hasura endpoint.

- `query`: The GraphQL query string
- `variables`: Optional variables for the query
- `accessToken`: Optional JWT for authenticated requests
- Returns: A promise that resolves to the query result

### `executeMutation<T>(mutation: string, variables?: Record<string, any>, accessToken?: string): Promise<T>`

Executes a GraphQL mutation against the Hasura endpoint.

- `mutation`: The GraphQL mutation string
- `variables`: Optional variables for the mutation
- `accessToken`: Optional JWT for authenticated requests
- Returns: A promise that resolves to the mutation result

### `createAuthenticatedExecutor(accessToken: string)`

Creates an executor with a pre-configured authentication token.

- `accessToken`: JWT for authenticated requests
- Returns: An object with `query` and `mutate` methods that automatically use the provided token

## Error Handling

All functions throw errors that can be caught and handled by the caller. Errors are automatically logged with context.

## Configuration

The following environment variables are required:

- `HASURA_GRAPHQL_ENDPOINT`: The Hasura GraphQL endpoint URL
- `HASURA_GRAPHQL_ADMIN_SECRET`: (Optional) Admin secret for admin operations

## Testing

Tests should be co-located with the implementation files with a `.test.ts` extension.
