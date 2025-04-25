import { z } from 'zod';

export const createShelterSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  location: z.string(),
  picture: z.string(),
  userId: z.string(),
});

export const updateShelterSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  picture: z.string().optional(),
});
