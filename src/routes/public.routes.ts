import { Router } from "express";
import { getRestaurantBySlug } from "../controllers/public.controller";

const router = Router();

/**
 * @swagger
 * /api/public/restaurants/{slug}:
 *   get:
 *     summary: Get public restaurant data by slug
 *     tags: [Public]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: "string"
 *         description: Restaurant slug
 *     responses:
 *       200:
 *         description: Restaurant data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RestaurantResponse"
 *       404:
 *         description: Restaurant not found or not published
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get("/restaurants/:slug", getRestaurantBySlug);

export default router;
