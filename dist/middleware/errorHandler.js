"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.AppError = AppError;
const errorHandler = (err, _req, res, _next) => {
    if (err instanceof zod_1.ZodError) {
        res.status(400).json({
            error: {
                message: "Validation failed",
                issues: err.issues,
            },
        });
        return;
    }
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            res.status(409).json({
                error: { message: "Duplicate value violates unique constraint" },
            });
            return;
        }
        if (err.code === "P2021") {
            res.status(500).json({
                error: {
                    message: "Model table missing. Run one of:\n  npm run db:migrate   # create/apply migrations\n  npm run db:push      # push schema (dev only)\n  npm run db:generate  # regenerate client after changes",
                },
            });
            return;
        }
    }
    const status = err instanceof AppError ? err.statusCode : 500;
    const message = err instanceof AppError ? err.message : "Internal server error";
    if (status >= 500) {
        // eslint-disable-next-line no-console
        console.error(err);
    }
    res.status(status).json({ error: { message } });
};
exports.errorHandler = errorHandler;
