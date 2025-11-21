import { z } from "zod";

const passwordSchema = z
  .string()
  .regex(/^\d{6}$/, "Password must be exactly 6 digits");

const usernameSchema = z.string().min(1).max(50);

export const registerSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
  username: usernameSchema,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
}); // decoupled from registerSchema

export const updateUserSchema = z
  .object({
    username: usernameSchema.optional(),
    password: passwordSchema.optional(),
  })
  .refine(
    (payload) =>
      payload.username !== undefined || payload.password !== undefined,
    {
      message: "Provide username or password to update",
      path: ["username"],
    }
  );

export const usernameOnlySchema = z.object({
  username: usernameSchema,
});

export const emailOnlySchema = z.object({
  email: z.string().email(),
});

export const passwordOnlySchema = z.object({
  password: passwordSchema,
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const validate = <T>(schema: z.Schema<T>, payload: unknown): T => {
  return schema.parse(payload);
};
