import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createApiRouteHandler } from '@/lib/utils/api.utils';
import { requireAuthenticatedUser } from '@/features/auth/utils/api-auth.utils';

// Define your request and response schemas
const createExampleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

const exampleQuerySchema = z.object({
  page: z.string().optional().default('1').transform(Number),
  limit: z.string().optional().default('10').transform(Number),
});

// Handler for POST /api/example
async function handleCreateExample(
  req: Request,
  context: {
    user: { id: string; email: string };
    validatedBody: z.infer<typeof createExampleSchema>;
  }
) {
  try {
    // Business logic here
    const { name, description } = context.validatedBody;
    const userId = context.user.id;
    
    // In a real app, you would call a service here
    // const result = await exampleService.create({ name, description, userId });
    
    return NextResponse.json(
      { 
        message: 'Example created successfully',
        data: { id: '123', name, description, userId }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating example:', error);
    throw error; // Will be handled by createApiRouteHandler
  }
}

// Handler for GET /api/example
async function handleGetExamples(
  req: Request,
  context: {
    user: { id: string; email: string };
    validatedQuery: z.infer<typeof exampleQuerySchema>;
  }
) {
  try {
    const { page = 1, limit = 10 } = context.validatedQuery;
    
    // In a real app, you would call a service here
    // const { data, total } = await exampleService.findAll({ page, limit });
    
    return NextResponse.json({
      data: [], // Replace with actual data
      pagination: {
        page,
        limit,
        total: 0, // Replace with actual total
        totalPages: 0, // Calculate based on total and limit
      },
    });
  } catch (error) {
    console.error('Error fetching examples:', error);
    throw error; // Will be handled by createApiRouteHandler
  }
}

// Export the route handlers using createApiRouteHandler
export const POST = createApiRouteHandler({
  schema: createExampleSchema,
  requireAuth: true,
  handler: handleCreateExample,
});

export const GET = createApiRouteHandler({
  querySchema: exampleQuerySchema,
  requireAuth: true,
  handler: handleGetExamples,
});
