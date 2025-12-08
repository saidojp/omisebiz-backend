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
    // Add these lines:
    breakStart: z.string().regex(/^\d{2}:\d{2}$/).optional().or(z.literal('')),
    breakEnd: z.string().regex(/^\d{2}:\d{2}$/).optional().or(z.literal('')),
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

// Menu Item Schema
const menuItemSchema = z.object({
  id: z.string().min(1, "Menu item ID is required"),
  name: z.string().min(1, "Menu item name is required"),
  description: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  category: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

// Featured Dish Schema
const featuredDishSchema = z.object({
  menuItemId: z.string().optional(),
  name: z.string().min(1, "Featured dish name is required"),
  description: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  imageUrl: z.string().url().optional().or(z.literal("")),
}).optional();

export const createRestaurantSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
  contacts: contactSchema.optional(),
  address: addressSchema.optional(),
  hours: hoursSchema.optional(),
  priceRange: z.object({
    min: z.number(),
    max: z.number(),
    currency: z.literal("¥"),
  }).optional(),
  attributes: z.record(z.string(), z.any()).optional(),
  media: z.record(z.string(), z.any()).optional(),
  socials: z.record(z.string(), z.string().url()).optional(),
  menuItems: z.array(menuItemSchema).optional(),
  featuredDish: featuredDishSchema,
});

export const updateRestaurantSchema = createRestaurantSchema.partial();

export type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>;
export type UpdateRestaurantInput = z.infer<typeof updateRestaurantSchema>;

export const validate = <T>(schema: z.Schema<T>, payload: unknown): T => {
  return schema.parse(payload);
};
