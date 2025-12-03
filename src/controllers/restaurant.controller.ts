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

const generateSlug = async (name: string, excludeId?: string): Promise<string> => {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  
  let slug = baseSlug;
  let count = 1;
  
  while (true) {
    const existing = await prisma.restaurant.findUnique({ 
      where: { slug },
      select: { id: true }
    });
    
    // If slug is not taken, or it's taken by the restaurant we're updating, use it
    if (!existing || existing.id === excludeId) {
      return slug;
    }
    
    // Otherwise, try with a suffix
    slug = `${baseSlug}-${count}`;
    count++;
  }
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

    // Auto-regenerate slug if name is being changed
    let dataToUpdate: any = { ...payload };
    if (payload.name && payload.name !== existing.name) {
      const newSlug = await generateSlug(payload.name, existing.id);
      dataToUpdate.slug = newSlug;
    }

    const updated = await prisma.restaurant.update({
      where: { id },
      data: dataToUpdate,
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

export const regenerateSlug = async (
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

    // Regenerate slug from current name
    const newSlug = await generateSlug(existing.name, existing.id);

    const updated = await prisma.restaurant.update({
      where: { id },
      data: { slug: newSlug },
    });

    res.json({ restaurant: updated });
  } catch (error) {
    next(error);
  }
};
