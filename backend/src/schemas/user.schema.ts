import { z } from 'zod';

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().optional(),
  roleId: z.string().uuid().optional(),
});

export const updateUserShelterSchema = z.object({
  name: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  user: z.object({
    id: z.string().uuid(),
    email: z.string().email().optional(),
    roleId: z.string().uuid().optional(),
    password: z.string().optional(),
  }),
});

export const updateUserFosterSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  address: z.string().optional(),
  user: z.object({
    id: z.string().uuid(),
    email: z.string().email().optional(),
    roleId: z.string().uuid().optional(),
    password: z.string().optional(),
  }),
});
