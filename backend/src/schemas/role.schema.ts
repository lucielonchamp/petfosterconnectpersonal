import { z } from "zod";

export const createSchema = z.object({
    name: z.string({
        required_error: "Name required"
    })
})

export type CreateType = z.infer<typeof createSchema>;