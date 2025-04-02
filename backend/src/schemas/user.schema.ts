import { z } from "zod";

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().optional(),
  roleId: z.string().uuid().optional()
});