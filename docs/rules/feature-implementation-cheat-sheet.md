# Feature Implementation Cheat Sheet

## 1\. Bedrock foundational rules
**Refer to: `project-structure-guidelines.md`, `auth-api-guidelines.md`, `essential-hook-guidelines.md` for foundational rules.**

## 2\. Core Feature Principles
*   **Self-Contained**: Aim for features to be as independent as possible.
*   **Clear Public API (`index.ts`)**:
    *   The feature's `index.ts` barrel file is its public interface.
    *   Subdirectories like `components/`, `services/`, `hooks/`, `queries/` should ideally also have their own `index.ts` if they export multiple items, which are then re-exported by the main feature `index.ts`.
    *   Prefer named exports for clarity and discoverability.

```typescript
// src/features/order-processing/index.ts

// Explicit re-export from components (assuming components/index.ts exists)
export { OrderForm, OrderList } from './components';
// If components/index.ts doesn't exist, or you prefer direct:
// export { OrderForm } from './components/OrderForm';
// export { OrderList } from './components/OrderList';

// Explicit re-export from hooks (if hooks/index.ts doesn't exist or for clarity)
export { useOrderFormState } from './hooks/useOrderFormState';

// Explicit re-export of service functions for clarity
export {
  createOrderInDb,
  getOrderById /*, otherServiceFunctions */
} from './services/order.service'; // Assuming order.service.ts exports these directly

// Explicit re-export of React Query hooks
export {
  useOrdersQuery,
  useSubmitNewOrderMutation /*, otherQueryHooks */
} from './queries/order.queries'; // Assuming order.queries.ts exports these directly

// Explicit re-export of Server Actions
export {
  submitNewOrderAction /*, otherActions */
} from './actions'; // Assuming actions.ts exports these directly

// Export types
export type { Order, CreateOrderPayload, OrderItem } from './types/order.types';
//
````
* *   Avoid default exports from index.ts for better tree-shaking and explicitness.
* *   **Co-location**: Keep all files related to the feature within its directory, including tests.
* *   **Adhere to Global Guidelines**: Follow auth-api-guidelines.md for API interactions, project-structure-guidelines.md for overall structure, etc.

## 3\. Implementation Steps & Key Files
### 3.1. Define Types (types/order.types.ts)

```
// src/features/order-processing/types/order.types.ts

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number; // Price is determined and stored server-side
}
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// Payload for creating an order, price determined server-side
export interface CreateOrderPayload {
  // userId will come from authenticated session on server
  items: Array<{ productId: string; quantity: number }>;
}
```

content\_copydownload

Use code [with caution](https://support.google.com/legal/answer/13505487).TypeScript

### 3.2. Define Zod Schemas (schemas/order.schema.ts)

Used for Server Action input validation, API route validation (via createApiRouteHandler), and potentially form validation with react-hook-form (reusing the same schema).

```
// src/features/order-processing/schemas/order.schema.ts
import { z } from 'zod';

export const CreateOrderItemSchema = z.object({
  productId: z.string().uuid("Invalid product ID format."),
  quantity: z.number().int().positive("Quantity must be a positive integer."),
});

export const CreateOrderPayloadSchema = z.object({
  // userId is derived from the authenticated session server-side and not part of this client payload schema.
  items: z.array(CreateOrderItemSchema).min(1, "Order must contain at least one item."),
});

// Type inferred from the Zod schema for use in service layers and actions
export type CreateOrderPayloadInput = z.infer<typeof CreateOrderPayloadSchema>;
```

### 3.3. Implement Services (services/order.service.ts)
(See service-implementation-cheat-sheet.md for details)
* *   Contains business logic (e.g., calculate total, check inventory, interact with payment gateway).
* *   Called by Server Actions or API Route handlers.
* *   **Services throw errors on failure.** The calling layer (Action/API Route) handles the final response to the client.

```
// src/features/order-processing/services/order.service.ts
import { getServerLogger } from '@/lib/logger';
import { createSupabaseServerClient } from '@/lib/clients/supabase'; // Or your specific server client
import { cookies } from 'next/headers';
import type { Order, CreateOrderPayload } from '../types/order.types'; // Using the defined interface
import type { CreateOrderPayloadInput } from '../schemas/order.schema'; // Using Zod inferred type for validated input
//

const logger = getServerLogger('OrderService');

// Example: Service function to create an order
export async function createOrderInDb(
  userId: string,
  payload: CreateOrderPayloadInput // Use the Zod-inferred type for validated data
): Promise<Order> {
  logger.info('Attempting to create order in DB', { userId, itemCount: payload.items.length });
  const supabase = createSupabaseServerClient(cookies());

  // --- Business Logic Example ---
  // 1. Calculate total price based on product prices from DB (not shown for brevity)
  // 2. Check inventory (not shown)
  // 3. Create order record
  // ---

  // This is a MOCK implementation. Replace with actual DB interaction.
  const mockOrderItems: OrderItem[] = payload.items.map(item => ({
    ...item,
    price: Math.random() * 100, // Mock price
  }));
  const mockTotalAmount = mockOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const newOrderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
    userId,
    items: mockOrderItems,
    totalAmount: mockTotalAmount,
    status: 'pending',
  };

  // Example Supabase insert (adjust table name and columns)
  // const { data, error } = await supabase
  //   .from('orders')
  //   .insert(newOrderData)
  //   .select()
  //   .single();
  // if (error) {
  //   logger.error('DB operation failed while creating order', { userId, error: error.message });
  //   throw new Error(`Order creation failed: ${error.message}`);
  // }
  // if (!data) {
  //   logger.error('DB operation returned no data after creating order', { userId });
  //   throw new Error('Order creation failed: No data returned.');
  // }
  // return data as Order;

  // MOCK return
  const mockOrder: Order = {
    id: `mock-order-${Date.now()}`,
    ...newOrderData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  logger.info('Mock order created successfully', { orderId: mockOrder.id, userId });
  return mockOrder;
}
```

### 3.4. Implement Server Actions (actions.ts)
Preferred for client-initiated mutations. Ensure robust authentication, validation, and error handling.  
The standard return type for Server Actions interacting with forms is:  
{ success: boolean; message?: string; data?: T; errors?: ZodFlattenedError<Schema>\['fieldErrors'\] }

```
// src/features/order-processing/actions.ts
'use server';
// ...
// Canonical utility for getting the fully authenticated user (Supabase user + app profile) server-side.
// This utility returns the `AuthenticatedUser` type defined in `src/features/auth/types/auth.types.ts`.
import { getServerAuthenticatedUser } from '@/features/auth/utils/api-auth.utils';
import type { AuthenticatedUser } from '@/features/auth/types/auth.types'; // Canonical AuthenticatedUser
// ...

export async function submitNewOrderAction(
  // prevState: any, // For useFormState, if used
  formData: FormData
): Promise<ServerActionResult<Order, typeof CreateOrderPayloadSchema>> {
  const authResult = await getServerAuthenticatedUser(); // Use the standardized utility
  if (!authResult.user) {
    logger.warn('User not authenticated for submitNewOrderAction', { authError: authResult.error?.message });
    return { success: false, message: authResult.error?.message || 'User not authenticated.' };
  }
  const user = authResult.user; // Now `user` is of type AuthenticatedUser // <--- VERIFY THIS
  // ...
}
```

### 3.5. Implement React Query Hooks (queries/order.queries.ts)
For data fetching and caching on the client-side. Uses helpers from src/lib/utils/api.utils.ts if calling src/app/api/ routes, or directly calls Server Actions for mutations.
```
// src/features/order-processing/queries/order.queries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authenticatedGet } from '@/lib/utils/api.utils'; // For calling GET API routes
import { Order } from '../types/order.types';
import { submitNewOrderAction } from '../actions'; // Server Action
import { useAuth } from '@/features/auth/hooks'; // To get isAuthenticated for `enabled` flag

const ORDER_QUERY_KEYS = {
  all: ['orders'] as const,
  detail: (id: string) => [...ORDER_QUERY_KEYS.all, id] as const,
};

// Example: Fetching orders via a GET API route
const fetchOrders = async (): Promise<Order[]> => authenticatedGet<Order[]>('/api/orders');

export const useOrdersQuery = () => {
  const { isAuthenticated } = useAuth(); // Get auth state
  return useQuery<Order[], Error>({
    queryKey: ORDER_QUERY_KEYS.all,
    queryFn: fetchOrders,
    enabled: isAuthenticated, // Only fetch if authenticated
  });
};

// Example: Mutation using a Server Action
export const useSubmitNewOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitNewOrderAction, // submitNewOrderAction takes FormData and returns ServerActionResult
    onSuccess: (result) => { // result is ServerActionResult<Order, ...>
      if (result.success && result.data) {
        queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.all });
        // Optionally, update cache directly with result.data
        // queryClient.setQueryData(ORDER_QUERY_KEYS.detail(result.data.id), result.data);
        // Handle successful submission (e.g., show toast, redirect)
        console.log("Order submitted successfully:", result.message, result.data);
      } else {
        // Handle server-side validation errors or other failures from the action
        console.error("Order submission failed:", result.message, result.errors);
        // Potentially set form errors using react-hook-form's setError if result.errors is populated
      }
    },
    onError: (error: Error) => {
      // Handle network errors or unexpected errors from the Server Action call itself (not business logic errors handled by result.success=false)
      console.error("Network or unexpected error submitting order:", error.message);
    },
  });
};
```

### 3.6. Develop UI Components (components/OrderForm.tsx)
```
// src/features/order-processing/components/OrderForm.tsx
'use client';
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { CreateOrderPayloadSchema } from '../schemas/order.schema'; // Can be used for client-side validation too
import { useSubmitNewOrderMutation } from '../queries/order.queries';
import { Button } from '@/components/ui/button';

// Define form values type
interface OrderFormValues {
  // Example: collecting items in a structured way before serializing
  // For simplicity, this example still uses a JSON string.
  // A more robust solution might involve dynamic fields for items.
  itemsJson: string;
}

export function OrderForm() {
  const { register, handleSubmit, formState: { errors }, setError } = useForm<OrderFormValues>({
    // resolver: zodResolver(CreateOrderPayloadSchema) // Optional: client-side validation using the same schema
  });
  const mutation = useSubmitNewOrderMutation();

  const onSubmit: SubmitHandler<OrderFormValues> = (data) => {
    const formData = new FormData();
    formData.append('items', data.itemsJson);
    // Append other fields if necessary for the server action

    mutation.mutate(formData, {
      onSuccess: (result) => {
        if (!result.success && result.errors) {
          // Set form errors from server validation
          Object.entries(result.errors).forEach(([field, fieldErrors]) => {
            if (fieldErrors) {
              // RHF expects a specific structure for field path
              // This is a simplified example; you might need to map 'items.0.productId' etc.
              setError(field as keyof OrderFormValues, {
                type: 'server',
                message: fieldErrors.join(', '),
              });
            }
          });
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="itemsJson">Items (JSON format):</label>
        <textarea
          id="itemsJson"
          {...register('itemsJson', { required: 'Items JSON is required.' })}
          placeholder='e.g., [{"productId": "valid-uuid", "quantity": 1}]'
          rows={3}
          style={{ width: '100%', borderColor: errors.itemsJson ? 'red' : undefined }}
        />
        {errors.itemsJson && <p style={{ color: 'red' }}>{errors.itemsJson.message}</p>}
      </div>

      {mutation.isPending && <p>Submitting order...</p>}
      {/* Check for network/unexpected error first */}
      {mutation.isError && <p style={{ color: 'red' }}>Error: {mutation.error?.message}</p>}
      {/* Then check for server-returned logical error (e.g., validation) */}
      {mutation.data && !mutation.data.success && (
        <div>
          <p style={{ color: 'red' }}>Server error: {mutation.data.message}</p>
          {/* Specific field errors are now handled by setError above */}
        </div>
      )}
      {mutation.data && mutation.data.success && (
        <p style={{ color: 'green' }}>{mutation.data.message}</p>
      )}
      <Button type="submit" disabled={mutation.isPending}>Place Order</Button>
    </form>
  );
}
```

### 3.7. Testing
* *   **Co-locate tests** next to the files they test.
* *   **Unit Tests**: For services, utility functions, complex hook logic. Mock dependencies.
* *   **Server Action Tests**: Test as regular async functions. Mock service calls and getServerAuthenticatedUser.
* *   **React Query Hook Tests**: Use @tanstack/react-query-testing-library or mock providers.
* *   **Component Tests**: Use React Testing Library. Test rendering, user interactions, and states. Mock useAuth, React Query mutation hooks.

## 4\. Feature Flags (Example Integration)
* *   Environment variables for flags are defined in .env and validated in src/config/env.ts.
* *   Consume them from validatedConfig.

```
// src/config/env.ts
// ...
// export const validatedConfig = z.object({
//   NEXT_PUBLIC_FEATURE_ORDER_PROCESSING_ENABLED: z.preprocess(
//     (str) => str === 'true', z.boolean().default(false)
//   ),
//   // ... other vars
// }).parse(process.env);

// In a component or layout:
// import { validatedConfig } from '@/config/env';
// if (!validatedConfig.NEXT_PUBLIC_FEATURE_ORDER_PROCESSING_ENABLED) {
//   return <FeatureDisabledMessage />; // Or null, or redirect
// }
// Render <OrderForm /> etc.
```

## 5\. Documentation
* *   Create/update README.md within the feature directory for:
*     * *   Overview of the feature.
*     * *   How to use its main components/hooks/actions.
*     * *   Any specific environment variables it relies on.
*     * *   Important architectural decisions or gotchas.  