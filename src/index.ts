import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import restaurantRouter from "./routes/restaurant.routes";
import uploadRouter from "./routes/upload.routes";
import { errorHandler } from "./middleware/errorHandler";
import swaggerSpec from "./swagger";
import { prisma } from "./prisma";

const app = express();
const PORT = process.env.PORT || 4000;

// Dynamic CORS origins: CORS_ORIGINS="*" or comma-separated list.
const corsOrigins = (process.env.CORS_ORIGINS ?? "*")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);
app.use(
  cors({
    origin: corsOrigins.includes("*") ? true : corsOrigins,
  })
);

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/restaurants", restaurantRouter);
app.use("/api/upload", uploadRouter);

app.get("/health", async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", db: "connected" });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown database error";
    res
      .status(500)
      .json({ status: "error", db: "disconnected", error: message });
  }
});

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "backend is running" });
});

app.use(errorHandler);

const server = app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  // eslint-disable-next-line no-console
  console.log("Shutting down gracefully...");
  await prisma.$disconnect();
  server.close(() => process.exit(0));
});
