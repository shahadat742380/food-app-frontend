import * as z from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required!!!")
    .email("Invalid email address"),
  password: z
    .string(),
    // .min(8, "Password must be at least 8 characters")
    // .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    // .regex(/\d/, "Password must contain at least one number")
    // .regex(/[@$!%*?&]/, "Password must contain at least one special character"),
  remember_me: z.boolean().optional(),
});

