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

// Restaurant Schemas

const hoursSchema = z.record(
  z.string(),
  z.object({
    isOpen: z.boolean(),
    open: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    close: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  })
);

const contactSchema = z.object({
  phone: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
});

const addressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
});

export const createRestaurantSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
  contacts: contactSchema.optional(),
  address: addressSchema.optional(),
  hours: hoursSchema.optional(),
  priceRange: z.enum(["$", "$$", "$$$", "$$$$"]).optional(),
  attributes: z.record(z.string(), z.any()).optional(),
  media: z.record(z.string(), z.any()).optional(),
  socials: z.record(z.string(), z.string().url()).optional(),
});

export const updateRestaurantSchema = createRestaurantSchema.partial();

export type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>;
export type UpdateRestaurantInput = z.infer<typeof updateRestaurantSchema>;

export const validate = <T>(schema: z.Schema<T>, payload: unknown): T => {
  return schema.parse(payload);
};
