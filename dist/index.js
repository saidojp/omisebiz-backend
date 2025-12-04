"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const restaurant_routes_1 = __importDefault(require("./routes/restaurant.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const public_routes_1 = __importDefault(require("./routes/public.routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const swagger_1 = __importDefault(require("./swagger"));
const prisma_1 = require("./prisma");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// Dynamic CORS origins: CORS_ORIGINS="*" or comma-separated list.
const corsOrigins = (process.env.CORS_ORIGINS ?? "*")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
app.use((0, cors_1.default)({
    origin: corsOrigins.includes("*") ? true : corsOrigins,
}));
app.use(express_1.default.json());
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
app.use("/auth", auth_routes_1.default);
app.use("/user", user_routes_1.default);
app.use("/restaurants", restaurant_routes_1.default);
app.use("/api/upload", upload_routes_1.default);
app.use("/api/public", public_routes_1.default);
app.get("/health", async (_req, res) => {
    try {
        await prisma_1.prisma.$queryRaw `SELECT 1`;
        res.json({ status: "ok", db: "connected" });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Unknown database error";
        res
            .status(500)
            .json({ status: "error", db: "disconnected", error: message });
    }
});
app.get("/", (_req, res) => {
    res.json({ message: "backend is running" });
});
app.use(errorHandler_1.errorHandler);
const server = app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on http://localhost:${PORT}`);
});
process.on("SIGINT", async () => {
    // eslint-disable-next-line no-console
    console.log("Shutting down gracefully...");
    await prisma_1.prisma.$disconnect();
    server.close(() => process.exit(0));
});
