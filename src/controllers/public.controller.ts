import { Request, Response } from "express";
import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";

export const getPublicRestaurants = async (req: Request, res: Response): Promise<void> => {
  // Fetch public restaurants with menu data
  try {
    const select: Prisma.RestaurantSelect = {
      id: true,
      slug: true,
      name: true,
      description: true,
      category: true,
      contacts: true,
      address: true,
      location: true,
      hours: true,
      priceRange: true,
      attributes: true,
      featuredAttributes: true,
      media: true,
      socials: true,
      menuItems: true,
      featuredDish: true,
      isPublished: true,
      createdAt: true,
    };

    const restaurants = await prisma.restaurant.findMany({
      where: {
        isPublished: true,
      },
      select,
      orderBy: {
        createdAt: "desc",
      },
    });


    res.status(200).json({
      success: true,
      data: {
        restaurants,
      },
    });
  } catch (error) {
    console.error("Get public restaurants error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch restaurants",
    });
  }
};

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
