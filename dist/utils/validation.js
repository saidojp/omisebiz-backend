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
exports.createRestaurantSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
    contacts: contactSchema.optional(),
    address: addressSchema.optional(),
    hours: hoursSchema.optional(),
    priceRange: zod_1.z.enum(["$", "$$", "$$$", "$$$$"]).optional(),
    attributes: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
    media: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
    socials: zod_1.z.record(zod_1.z.string(), zod_1.z.string().url()).optional(),
});
exports.updateRestaurantSchema = exports.createRestaurantSchema.partial();
const validate = (schema, payload) => {
    return schema.parse(payload);
};
exports.validate = validate;
