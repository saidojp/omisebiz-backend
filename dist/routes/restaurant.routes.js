"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const restaurant_controller_1 = require("../controllers/restaurant.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
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
router.post("/", restaurant_controller_1.createRestaurant);
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
router.get("/", restaurant_controller_1.getRestaurants);
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
router.get("/:id", restaurant_controller_1.getRestaurant);
/**
 * @swagger
 * /restaurants/{id}:
 *   patch:
 *     tags: [Restaurants]
 *     summary: Update restaurant
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
router.patch("/:id", restaurant_controller_1.updateRestaurant);
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
router.delete("/:id", restaurant_controller_1.deleteRestaurant);
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
router.patch("/:id/publish", restaurant_controller_1.publishRestaurant);
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
router.patch("/:id/unpublish", restaurant_controller_1.unpublishRestaurant);
exports.default = router;
