import { z } from "zod";

export const createFosterSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    address: z.string(),
    userId: z.string(),
});

export const updateFosterSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    address: z.string().optional(),
});