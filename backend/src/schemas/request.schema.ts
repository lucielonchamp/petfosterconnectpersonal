import { z } from 'zod';
import { RequestStatus } from '@prisma/client';

// Schema for validating UUID route parameters
export const paramIdSchema = z.object({
  id: z.string().uuid({ message: 'Invalid Request ID format' }),
});

// Schema for creating a request
export const createRequestSchema = z.object({
  fosterId: z.string().uuid({ message: 'Invalid Foster ID format' }),
  shelterId: z.string().uuid({ message: 'Invalid Shelter ID format' }),
  animalId: z.string().uuid({ message: 'Invalid Animal ID format' }),
  // Status is set server-side, comments added on update
});

// Schema for updating a request
export const updateRequestSchema = z.object({
  status: z.nativeEnum(RequestStatus).optional(),
  fosterComment: z.string().max(500, { message: 'Foster comment cannot exceed 500 characters' }).optional().nullable(), // Allow null to clear
  shelterComment: z.string().max(500, { message: 'Shelter comment cannot exceed 500 characters' }).optional().nullable(), // Allow null to clear
  // Do not allow changing fosterId, shelterId, animalId here
});

// Schema for query parameters when fetching requests
export const queryRequestSchema = z.object({
  fosterId: z.string().uuid({ message: 'Invalid Foster ID format' }).optional(),
  shelterId: z.string().uuid({ message: 'Invalid Shelter ID format' }).optional(),
  animalId: z.string().uuid({ message: 'Invalid Animal ID format' }).optional(),
  status: z.nativeEnum(RequestStatus).optional(),
  // Add other query params like pagination if needed (e.g., page: z.coerce.number().int().positive().optional())
});

// Export types for convenience (optional but good practice)
export type CreateRequestInput = z.infer<typeof createRequestSchema>;
export type UpdateRequestInput = z.infer<typeof updateRequestSchema>;
export type QueryRequestInput = z.infer<typeof queryRequestSchema>;