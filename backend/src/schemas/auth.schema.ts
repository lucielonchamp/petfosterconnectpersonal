import { z } from "zod";

export const registerSchema = z.object({
	email: z.coerce.string({
		required_error: "Email required"
	}).email({
		message: "Mail format is not valid"
	}),
	password: z.string(),
	roleId: z.string()
});

export type RegisterType = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email : z.string({
    required_error: "Email required"
  }).email({
    message: "Email is not valid"
  }),
  password : z.string(),
});

export type LoginType = z.infer<typeof loginSchema>;

