import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import { errorHandler } from "./middleware/errorHandler";
import swaggerSpec from "./swagger";
import { prisma } from "./prisma";

const app = express();

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/auth", authRouter);
app.use("/user", userRouter);

app.get("/health", async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", db: "connected" });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown database error";
    res.status(500).json({
      status: "error",
      db: "disconnected",
      error: message,
    });
  }
});

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "backend is running" });
});

app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await prisma.$disconnect();
  server.close(() => process.exit(0));
});
