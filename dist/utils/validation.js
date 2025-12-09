"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.updateRestaurantSchema = exports.createRestaurantSchema = exports.passwordOnlySchema = exports.emailOnlySchema = exports.usernameOnlySchema = exports.updateUserSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const passwordSchema = zod_1.z
    .string()
    .regex(/^\d{6}$/, "Password must be exactly 6 digits");
const usernameSchema = zod_1.z.string().min(1).max(50);
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: passwordSchema,
    username: usernameSchema,
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: passwordSchema,
}); // decoupled from registerSchema
exports.updateUserSchema = zod_1.z
    .object({
    username: usernameSchema.optional(),
    password: passwordSchema.optional(),
})
    .refine((payload) => payload.username !== undefined || payload.password !== undefined, {
    message: "Provide username or password to update",
    path: ["username"],
});
exports.usernameOnlySchema = zod_1.z.object({
    username: usernameSchema,
});
exports.emailOnlySchema = zod_1.z.object({
    email: zod_1.z.string().email(),
});
exports.passwordOnlySchema = zod_1.z.object({
    password: passwordSchema,
});
// Restaurant Schemas
const hoursSchema = zod_1.z.record(zod_1.z.string(), zod_1.z.object({
    isOpen: zod_1.z.boolean(),
    open: zod_1.z.string().regex(/^\d{2}:\d{2}$/).optional(),
    close: zod_1.z.string().regex(/^\d{2}:\d{2}$/).optional(),
    // Add these lines:
    breakStart: zod_1.z.string().regex(/^\d{2}:\d{2}$/).optional().or(zod_1.z.literal('')),
    breakEnd: zod_1.z.string().regex(/^\d{2}:\d{2}$/).optional().or(zod_1.z.literal('')),
}));
const contactSchema = zod_1.z.object({
    phone: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    website: zod_1.z.string().url().optional(),
});
const addressSchema = zod_1.z.object({
    street: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    zip: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
});
// Menu Item Schema
const menuItemSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, "Menu item ID is required"),
    name: zod_1.z.string().min(1, "Menu item name is required"),
    description: zod_1.z.string().optional(),
    price: zod_1.z.string().min(1, "Price is required"),
    category: zod_1.z.string().optional(),
    imageUrl: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
});
// Featured Dish Schema
const featuredDishSchema = zod_1.z.object({
    menuItemId: zod_1.z.string().optional(),
    name: zod_1.z.string().min(1, "Featured dish name is required"),
    description: zod_1.z.string().optional(),
    price: zod_1.z.string().min(1, "Price is required"),
    imageUrl: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
}).optional();
exports.createRestaurantSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
    contacts: contactSchema.optional(),
    address: addressSchema.optional(),
    hours: hoursSchema.optional(),
    priceRange: zod_1.z.object({
        min: zod_1.z.number(),
        max: zod_1.z.number(),
        currency: zod_1.z.literal("¥"),
    }).optional(),
    attributes: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
    media: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
    socials: zod_1.z.record(zod_1.z.string(), zod_1.z.string().url()).optional(),
    menuItems: zod_1.z.array(menuItemSchema).optional(),
    featuredDish: featuredDishSchema,
});
exports.updateRestaurantSchema = exports.createRestaurantSchema.partial();
const validate = (schema, payload) => {
    return schema.parse(payload);
};
exports.validate = validate;
