"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updatePassword = exports.updateEmail = exports.updateUsername = exports.updateProfile = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../prisma");
const errorHandler_1 = require("../middleware/errorHandler");
const validation_1 = require("../utils/validation");
const user_1 = require("../utils/user");
const SALT_ROUNDS = 10;
const ensureAuthenticated = (req) => {
    if (!req.user) {
        throw new errorHandler_1.AppError("Unauthorized", 401);
    }
    return req.user.id;
};
const assertUsernameUnique = async (candidate, currentUserId) => {
    const existing = await prisma_1.prisma.user.findFirst({
        where: { username: { equals: candidate, mode: "insensitive" } },
        select: { id: true },
    });
    if (existing && existing.id !== currentUserId) {
        throw new errorHandler_1.AppError("Username already in use", 409);
    }
};
const updateProfile = async (req, res, next) => {
    try {
        const userId = ensureAuthenticated(req);
        const payload = (0, validation_1.validate)(validation_1.updateUserSchema, req.body);
        if (payload.username !== undefined) {
            await assertUsernameUnique(payload.username, userId);
        }
        const data = {
            ...(payload.username !== undefined ? { username: payload.username } : {}),
            ...(payload.password !== undefined
                ? { password: await bcryptjs_1.default.hash(payload.password, SALT_ROUNDS) }
                : {}),
        };
        if (!Object.keys(data).length) {
            throw new errorHandler_1.AppError("No changes provided", 400);
        }
        const updatedUser = await prisma_1.prisma.user.update({
            where: { id: userId },
            data: data,
        });
        res.json({ user: (0, user_1.sanitizeUser)(updatedUser) });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProfile = updateProfile;
const updateUsername = async (req, res, next) => {
    try {
        const userId = ensureAuthenticated(req);
        const payload = (0, validation_1.validate)(validation_1.usernameOnlySchema, req.body);
        await assertUsernameUnique(payload.username, userId);
        const updatedUser = await prisma_1.prisma.user.update({
            where: { id: userId },
            data: { username: payload.username },
        });
        res.json({ user: (0, user_1.sanitizeUser)(updatedUser) });
    }
    catch (error) {
        next(error);
    }
};
exports.updateUsername = updateUsername;
const updateEmail = async (req, res, next) => {
    try {
        const userId = ensureAuthenticated(req);
        const payload = (0, validation_1.validate)(validation_1.emailOnlySchema, req.body);
        const existing = await prisma_1.prisma.user.findFirst({
            where: { email: { equals: payload.email, mode: "insensitive" } },
            select: { id: true },
        });
        if (existing && existing.id !== userId) {
            throw new errorHandler_1.AppError("Email already in use", 409);
        }
        const updatedUser = await prisma_1.prisma.user.update({
            where: { id: userId },
            data: { email: payload.email },
        });
        res.json({ user: (0, user_1.sanitizeUser)(updatedUser) });
    }
    catch (error) {
        next(error);
    }
};
exports.updateEmail = updateEmail;
const updatePassword = async (req, res, next) => {
    try {
        const userId = ensureAuthenticated(req);
        const payload = (0, validation_1.validate)(validation_1.passwordOnlySchema, req.body);
        const hashedPassword = await bcryptjs_1.default.hash(payload.password, SALT_ROUNDS);
        await prisma_1.prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
        res.json({ message: "Password updated" });
    }
    catch (error) {
        next(error);
    }
};
exports.updatePassword = updatePassword;
const deleteUser = async (req, res, next) => {
    try {
        const userId = ensureAuthenticated(req);
        await prisma_1.prisma.user.delete({ where: { id: userId } });
        res.json({ message: "Account deleted" });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteUser = deleteUser;
