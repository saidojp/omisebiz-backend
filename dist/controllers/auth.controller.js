"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../prisma");
const errorHandler_1 = require("../middleware/errorHandler");
const generateUniqueID_1 = require("../utils/generateUniqueID");
const validation_1 = require("../utils/validation");
const user_1 = require("../utils/user");
const client_1 = require("@prisma/client");
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET env variable is required");
}
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ??
    "7d");
const SALT_ROUNDS = 10;
const signToken = (userId) => jsonwebtoken_1.default.sign({ sub: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
const createUserWithUniqueID = async (email, hashedPassword, username) => {
    for (let attempt = 0; attempt < 5; attempt++) {
        const uniqueID = await (0, generateUniqueID_1.generateUniqueID)();
        try {
            return await prisma_1.prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    uniqueID,
                    username, // persist username
                },
            });
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                e.code === "P2002" &&
                Array.isArray(e.meta?.target) &&
                e.meta.target.includes("uniqueID")) {
                continue;
            }
            throw e;
        }
    }
    throw new errorHandler_1.AppError("Failed to generate unique ID", 500);
};
const register = async (req, res, next) => {
    try {
        const payload = (0, validation_1.validate)(validation_1.registerSchema, req.body);
        const [existingEmail, existingUsername] = await Promise.all([
            prisma_1.prisma.user.findFirst({
                where: { email: { equals: payload.email, mode: "insensitive" } },
                select: { id: true },
            }),
            prisma_1.prisma.user.findFirst({
                where: { username: { equals: payload.username, mode: "insensitive" } },
                select: { id: true },
            }),
        ]);
        if (existingEmail) {
            throw new errorHandler_1.AppError("Email already in use", 409);
        }
        if (existingUsername) {
            throw new errorHandler_1.AppError("Username already in use", 409);
        }
        const hashedPassword = await bcryptjs_1.default.hash(payload.password, SALT_ROUNDS);
        const user = await createUserWithUniqueID(payload.email, hashedPassword, payload.username);
        const token = signToken(user.id);
        res.status(201).json({
            token,
            user: (0, user_1.sanitizeUser)(user),
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const payload = (0, validation_1.validate)(validation_1.loginSchema, req.body);
        const user = await prisma_1.prisma.user.findFirst({
            where: { email: { equals: payload.email, mode: "insensitive" } },
        });
        const isValidPassword = user && (await bcryptjs_1.default.compare(payload.password, user.password));
        if (!user || !isValidPassword) {
            throw new errorHandler_1.AppError("Invalid credentials", 401);
        }
        const token = signToken(user.id);
        res.json({
            token,
            user: (0, user_1.sanitizeUser)(user),
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const getMe = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new errorHandler_1.AppError("Unauthorized", 401);
        }
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: req.user.id },
        });
        if (!user) {
            throw new errorHandler_1.AppError("User not found", 404);
        }
        res.json({ user: (0, user_1.sanitizeUser)(user) });
    }
    catch (error) {
        next(error);
    }
};
exports.getMe = getMe;
