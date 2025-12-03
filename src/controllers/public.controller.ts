import { Request, Response } from "express";
import { prisma } from "../prisma";

export const getRestaurantBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const restaurant = await prisma.restaurant.findFirst({
      where: {
        slug,
        isPublished: true,
      },
    });

    if (!restaurant) {
      res.status(404).json({
        success: false,
        error: "Restaurant not found",
      });
      return;
    }

    res.status(200).json({
      restaurant,
    });
  } catch (error) {
    console.error("Get public restaurant error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch restaurant",
    });
  }
};
