"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
/**
 * @swagger
 * /user/update:
 *   patch:
 *     tags: [User]
 *     summary: Update username and/or password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateUserRequest"
 *     responses:
 *       "200":
 *         $ref: "#/components/responses/UserResponse"
 *       "400":
 *         $ref: "#/components/responses/BadRequest"
 *       "401":
 *         $ref: "#/components/responses/Unauthorized"
 */
router.patch("/update", user_controller_1.updateProfile);
/**
 * @swagger
 * /user/username:
 *   patch:
 *     tags: [User]
 *     summary: Update username only
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UsernameRequest"
 *     responses:
 *       "200":
 *         $ref: "#/components/responses/UserResponse"
 *       "400":
 *         $ref: "#/components/responses/BadRequest"
 */
router.patch("/username", user_controller_1.updateUsername);
/**
 * @swagger
 * /user/email:
 *   patch:
 *     tags: [User]
 *     summary: Update email only
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/EmailRequest"
 *     responses:
 *       "200":
 *         $ref: "#/components/responses/UserResponse"
 *       "400":
 *         $ref: "#/components/responses/BadRequest"
 *       "409":
 *         $ref: "#/components/responses/Conflict"
 */
router.patch("/email", user_controller_1.updateEmail);
/**
 * @swagger
 * /user/password:
 *   patch:
 *     tags: [User]
 *     summary: Update password only
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/PasswordRequest"
 *     responses:
 *       "200":
 *         description: Password updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MessageResponse"
 *       "400":
 *         $ref: "#/components/responses/BadRequest"
 */
router.patch("/password", user_controller_1.updatePassword);
/**
 * @swagger
 * /user/delete:
 *   delete:
 *     tags: [User]
 *     summary: Delete the current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Delete confirmation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MessageResponse"
 *       "401":
 *         $ref: "#/components/responses/Unauthorized"
 */
router.delete("/delete", user_controller_1.deleteUser);
exports.default = router;
