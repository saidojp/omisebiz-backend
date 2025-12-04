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
        if (err.code === "P2003") {
            res.status(400).json({
                error: { message: "Related record not found (Foreign Key Constraint)" },
            });
            return;
        }
    }
    // Check if error has a statusCode property (like body-parser errors)
    let status = 500;
    let message = "Internal server error";
    if (err instanceof AppError) {
        status = err.statusCode;
        message = err.message;
    }
    else if ("statusCode" in err && typeof err.statusCode === "number") {
        // Handle errors with statusCode property (e.g., body-parser)
        status = err.statusCode;
        message = err.message || "Bad request";
    }
    else if ("status" in err && typeof err.status === "number") {
        // Handle errors with status property
        status = err.status;
        message = err.message || "Bad request";
    }
    if (status >= 500) {
        // eslint-disable-next-line no-console
        console.error(err);
    }
    res.status(status).json({ error: { message } });
};
exports.errorHandler = errorHandler;
