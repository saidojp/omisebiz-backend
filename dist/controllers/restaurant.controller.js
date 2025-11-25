"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unpublishRestaurant = exports.publishRestaurant = exports.deleteRestaurant = exports.updateRestaurant = exports.getRestaurant = exports.getRestaurants = exports.createRestaurant = void 0;
const prisma_1 = require("../prisma");
const errorHandler_1 = require("../middleware/errorHandler");
const validation_1 = require("../utils/validation");
const generateSlug = async (name) => {
    const baseSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    let slug = baseSlug;
    let count = 1;
    while (await prisma_1.prisma.restaurant.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${count}`;
        count++;
    }
    return slug;
};
const createRestaurant = async (req, res, next) => {
    try {
        if (!req.user)
            throw new errorHandler_1.AppError("Unauthorized", 401);
        const payload = (0, validation_1.validate)(validation_1.createRestaurantSchema, req.body);
        const slug = await generateSlug(payload.name);
        const restaurant = await prisma_1.prisma.restaurant.create({
            data: {
                ...payload,
                slug,
                userId: req.user.id,
                isPublished: false,
            },
        });
        res.status(201).json({ restaurant });
    }
    catch (error) {
        next(error);
    }
};
exports.createRestaurant = createRestaurant;
const getRestaurants = async (req, res, next) => {
    try {
        if (!req.user)
            throw new errorHandler_1.AppError("Unauthorized", 401);
        const restaurants = await prisma_1.prisma.restaurant.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: "desc" },
        });
        res.json({ restaurants });
    }
    catch (error) {
        next(error);
    }
};
exports.getRestaurants = getRestaurants;
const getRestaurant = async (req, res, next) => {
    try {
        if (!req.user)
            throw new errorHandler_1.AppError("Unauthorized", 401);
        const { id } = req.params;
        const restaurant = await prisma_1.prisma.restaurant.findUnique({
            where: { id },
        });
        if (!restaurant)
            throw new errorHandler_1.AppError("Restaurant not found", 404);
        if (restaurant.userId !== req.user.id)
            throw new errorHandler_1.AppError("Forbidden", 403);
        res.json({ restaurant });
    }
    catch (error) {
        next(error);
    }
};
exports.getRestaurant = getRestaurant;
const updateRestaurant = async (req, res, next) => {
    try {
        if (!req.user)
            throw new errorHandler_1.AppError("Unauthorized", 401);
        const { id } = req.params;
        const existing = await prisma_1.prisma.restaurant.findUnique({ where: { id } });
        if (!existing)
            throw new errorHandler_1.AppError("Restaurant not found", 404);
        if (existing.userId !== req.user.id)
            throw new errorHandler_1.AppError("Forbidden", 403);
        const payload = (0, validation_1.validate)(validation_1.updateRestaurantSchema, req.body);
        const updated = await prisma_1.prisma.restaurant.update({
            where: { id },
            data: payload,
        });
        res.json({ restaurant: updated });
    }
    catch (error) {
        next(error);
    }
};
exports.updateRestaurant = updateRestaurant;
const deleteRestaurant = async (req, res, next) => {
    try {
        if (!req.user)
            throw new errorHandler_1.AppError("Unauthorized", 401);
        const { id } = req.params;
        const existing = await prisma_1.prisma.restaurant.findUnique({ where: { id } });
        if (!existing)
            throw new errorHandler_1.AppError("Restaurant not found", 404);
        if (existing.userId !== req.user.id)
            throw new errorHandler_1.AppError("Forbidden", 403);
        await prisma_1.prisma.restaurant.delete({ where: { id } });
        res.json({ message: "Restaurant deleted" });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteRestaurant = deleteRestaurant;
const publishRestaurant = async (req, res, next) => {
    try {
        if (!req.user)
            throw new errorHandler_1.AppError("Unauthorized", 401);
        const { id } = req.params;
        const existing = await prisma_1.prisma.restaurant.findUnique({ where: { id } });
        if (!existing)
            throw new errorHandler_1.AppError("Restaurant not found", 404);
        if (existing.userId !== req.user.id)
            throw new errorHandler_1.AppError("Forbidden", 403);
        const updated = await prisma_1.prisma.restaurant.update({
            where: { id },
            data: { isPublished: true },
        });
        res.json({ restaurant: updated });
    }
    catch (error) {
        next(error);
    }
};
exports.publishRestaurant = publishRestaurant;
const unpublishRestaurant = async (req, res, next) => {
    try {
        if (!req.user)
            throw new errorHandler_1.AppError("Unauthorized", 401);
        const { id } = req.params;
        const existing = await prisma_1.prisma.restaurant.findUnique({ where: { id } });
        if (!existing)
            throw new errorHandler_1.AppError("Restaurant not found", 404);
        if (existing.userId !== req.user.id)
            throw new errorHandler_1.AppError("Forbidden", 403);
        const updated = await prisma_1.prisma.restaurant.update({
            where: { id },
            data: { isPublished: false },
        });
        res.json({ restaurant: updated });
    }
    catch (error) {
        next(error);
    }
};
exports.unpublishRestaurant = unpublishRestaurant;
