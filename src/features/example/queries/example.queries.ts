import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authenticatedGet, authenticatedPost } from '@/lib/utils/api.utils';

type Example = {
  id: string;
  name: string;
  description?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

type CreateExampleInput = {
  name: string;
  description?: string;
};

// Query keys
export const exampleKeys = {
  all: ['examples'] as const,
  lists: () => [...exampleKeys.all, 'list'] as const,
  list: (filters: { page?: number; limit?: number }) => 
    [...exampleKeys.lists(), { ...filters }] as const,
  details: () => [...exampleKeys.all, 'detail'] as const,
  detail: (id: string) => [...exampleKeys.details(), id] as const,
};

// Queries
export function useExamplesQuery(params: { page?: number; limit?: number } = {}) {
  const { page = 1, limit = 10 } = params;
  
  return useQuery({
    queryKey: exampleKeys.list({ page, limit }),
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      return authenticatedGet<{
        data: Example[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }>(`/api/example?${queryParams}`);
    },
    keepPreviousData: true,
  });
}

export function useExampleDetailQuery(id: string) {
  return useQuery({
    queryKey: exampleKeys.detail(id),
    queryFn: () => authenticatedGet<{ data: Example }>(`/api/example/${id}`),
    enabled: !!id,
  });
}

// Mutations
export function useCreateExample() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (input: CreateExampleInput) =>
      authenticatedPost<{ data: Example }, CreateExampleInput>(
        '/api/example',
        input
      ),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: exampleKeys.lists() });
    },
  });
}

export function useUpdateExample() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<CreateExampleInput>) =>
      authenticatedPost<{ data: Example }, Partial<CreateExampleInput>>(
        `/api/example/${id}`,
        data,
        { method: 'PATCH' }
      ),
    onSuccess: (data, variables) => {
      // Invalidate both the list and the specific item
      queryClient.invalidateQueries({ queryKey: exampleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: exampleKeys.detail(variables.id) });
    },
  });
}

export function useDeleteExample() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) =>
      authenticatedGet<{ success: boolean }>(`/api/example/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      // Invalidate the list
      queryClient.invalidateQueries({ queryKey: exampleKeys.lists() });
    },
  });
}
