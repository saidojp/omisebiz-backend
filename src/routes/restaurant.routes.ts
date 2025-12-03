import { Router } from "express";
import {
  createRestaurant,
  getRestaurants,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
  publishRestaurant,
  unpublishRestaurant,
  regenerateSlug,
} from "../controllers/restaurant.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /restaurants:
 *   post:
 *     tags: [Restaurants]
 *     summary: Create a new restaurant
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateRestaurantRequest"
 *     responses:
 *       "201":
 *         description: Restaurant created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RestaurantResponse"
 *       "400":
 *         $ref: "#/components/responses/BadRequest"
 *       "401":
 *         $ref: "#/components/responses/Unauthorized"
 */
router.post("/", createRestaurant);

/**
 * @swagger
 * /restaurants:
 *   get:
 *     tags: [Restaurants]
 *     summary: List user's restaurants
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: List of restaurants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 restaurants:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Restaurant"
 *       "401":
 *         $ref: "#/components/responses/Unauthorized"
 */
router.get("/", getRestaurants);

/**
 * @swagger
 * /restaurants/{id}:
 *   get:
 *     tags: [Restaurants]
 *     summary: Get restaurant details
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Restaurant details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RestaurantResponse"
 *       "404":
 *         $ref: "#/components/responses/NotFound"
 */
router.get("/:id", getRestaurant);

/**
 * @swagger
 * /restaurants/{id}:
 *   patch:
 *     tags: [Restaurants]
 *     summary: Update restaurant
 *     description: |
 *       Updates restaurant details.
 *       **Note**: If the 'name' field is changed, the 'slug' will be automatically regenerated
 *       to ensure the public URL reflects the current restaurant name.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateRestaurantRequest"
 *     responses:
 *       "200":
 *         description: Updated restaurant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RestaurantResponse"
 *       "404":
 *         $ref: "#/components/responses/NotFound"
 */
router.patch("/:id", updateRestaurant);

/**
 * @swagger
 * /restaurants/{id}:
 *   delete:
 *     tags: [Restaurants]
 *     summary: Delete restaurant
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Restaurant deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MessageResponse"
 *       "404":
 *         $ref: "#/components/responses/NotFound"
 */
router.delete("/:id", deleteRestaurant);

/**
 * @swagger
 * /restaurants/{id}/publish:
 *   patch:
 *     tags: [Restaurants]
 *     summary: Publish restaurant
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Restaurant published
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RestaurantResponse"
 */
router.patch("/:id/publish", publishRestaurant);

/**
 * @swagger
 * /restaurants/{id}/unpublish:
 *   patch:
 *     tags: [Restaurants]
 *     summary: Unpublish restaurant
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Restaurant unpublished
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RestaurantResponse"
 */
router.patch("/:id/unpublish", unpublishRestaurant);

/**
 * @swagger
 * /restaurants/{id}/regenerate-slug:
 *   patch:
 *     tags: [Restaurants]
 *     summary: Manually regenerate restaurant slug
 *     description: |
 *       Regenerates the slug from the current restaurant name.
 *       Useful for fixing existing restaurants or handling edge cases.
 *       The slug will be based on the current name and will ensure uniqueness.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Restaurant with regenerated slug
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RestaurantResponse"
 *       "404":
 *         $ref: "#/components/responses/NotFound"
 */
router.patch("/:id/regenerate-slug", regenerateSlug);

export default router;
