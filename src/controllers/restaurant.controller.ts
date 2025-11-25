import { Request, Response, NextFunction } from "express";
import { prisma } from "../prisma";
import { AppError } from "../middleware/errorHandler";
import {
  validate,
  createRestaurantSchema,
  updateRestaurantSchema,
  CreateRestaurantInput,
  UpdateRestaurantInput,
} from "../utils/validation";
import { Prisma } from "@prisma/client";

const generateSlug = async (name: string): Promise<string> => {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  
  let slug = baseSlug;
  let count = 1;
  
  while (await prisma.restaurant.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${count}`;
    count++;
  }
  
  return slug;
};

export const createRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);
    
    const payload: CreateRestaurantInput = validate(createRestaurantSchema, req.body);
    const slug = await generateSlug(payload.name);

    const restaurant = await prisma.restaurant.create({
      data: {
        ...payload,
        slug,
        userId: req.user.id,
        isPublished: false,
      },
    });

    res.status(201).json({ restaurant });
  } catch (error) {
    next(error);
  }
};

export const getRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);

    const restaurants = await prisma.restaurant.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    res.json({ restaurants });
  } catch (error) {
    next(error);
  }
};

export const getRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const { id } = req.params;

    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
    });

    if (!restaurant) throw new AppError("Restaurant not found", 404);
    if (restaurant.userId !== req.user.id) throw new AppError("Forbidden", 403);

    res.json({ restaurant });
  } catch (error) {
    next(error);
  }
};

export const updateRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const { id } = req.params;
    
    const existing = await prisma.restaurant.findUnique({ where: { id } });
    if (!existing) throw new AppError("Restaurant not found", 404);
    if (existing.userId !== req.user.id) throw new AppError("Forbidden", 403);

    const payload: UpdateRestaurantInput = validate(updateRestaurantSchema, req.body);

    const updated = await prisma.restaurant.update({
      where: { id },
      data: payload,
    });

    res.json({ restaurant: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const { id } = req.params;

    const existing = await prisma.restaurant.findUnique({ where: { id } });
    if (!existing) throw new AppError("Restaurant not found", 404);
    if (existing.userId !== req.user.id) throw new AppError("Forbidden", 403);

    await prisma.restaurant.delete({ where: { id } });

    res.json({ message: "Restaurant deleted" });
  } catch (error) {
    next(error);
  }
};

export const publishRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const { id } = req.params;

    const existing = await prisma.restaurant.findUnique({ where: { id } });
    if (!existing) throw new AppError("Restaurant not found", 404);
    if (existing.userId !== req.user.id) throw new AppError("Forbidden", 403);

    const updated = await prisma.restaurant.update({
      where: { id },
      data: { isPublished: true },
    });

    res.json({ restaurant: updated });
  } catch (error) {
    next(error);
  }
};

export const unpublishRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const { id } = req.params;

    const existing = await prisma.restaurant.findUnique({ where: { id } });
    if (!existing) throw new AppError("Restaurant not found", 404);
    if (existing.userId !== req.user.id) throw new AppError("Forbidden", 403);

    const updated = await prisma.restaurant.update({
      where: { id },
      data: { isPublished: false },
    });

    res.json({ restaurant: updated });
  } catch (error) {
    next(error);
  }
};
