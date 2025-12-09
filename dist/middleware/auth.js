"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_1 = require("./errorHandler");
const authenticate = (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        next(new errorHandler_1.AppError("Unauthorized", 401));
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET environment variable is required");
        }
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const userId = payload.sub ?? payload.id;
        if (!userId) {
            next(new errorHandler_1.AppError("Unauthorized", 401));
            return;
        }
        req.user = { id: userId };
        next();
    }
    catch {
        next(new errorHandler_1.AppError("Invalid token", 401));
    }
};
exports.authenticate = authenticate;
