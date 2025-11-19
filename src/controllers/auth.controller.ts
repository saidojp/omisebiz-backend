import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { prisma } from "../prisma";
import { AppError } from "../middleware/errorHandler";
import { generateUniqueID } from "../utils/generateUniqueID";
import {
  validate,
  registerSchema,
  loginSchema,
  RegisterInput,
  LoginInput,
} from "../utils/validation";
import { sanitizeUser } from "../utils/user";
import { Prisma } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN: SignOptions["expiresIn"] =
  (process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"]) ?? "7d";
const SALT_ROUNDS = 10;

const signToken = (userId: string): string =>
  jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

const createUserWithUniqueID = async (
  email: string,
  hashedPassword: string
) => {
  for (let attempt = 0; attempt < 5; attempt++) {
    const uniqueID = await generateUniqueID();
    try {
      return await prisma.user.create({
        data: { email, password: hashedPassword, uniqueID },
      });
    } catch (e: unknown) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002" &&
        Array.isArray(e.meta?.target) &&
        e.meta.target.includes("uniqueID")
      ) {
        continue;
      }
      throw e;
    }
  }
  throw new AppError("Failed to generate unique ID", 500);
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payload: RegisterInput = validate(registerSchema, req.body);

    const existingUser = await prisma.user.findFirst({
      where: { email: { equals: payload.email, mode: "insensitive" } },
      select: { id: true },
    });

    if (existingUser) {
      throw new AppError("Email already in use", 409);
    }

    const hashedPassword = await bcrypt.hash(payload.password, SALT_ROUNDS);

    const user = await createUserWithUniqueID(payload.email, hashedPassword);

    const token = signToken(user.id);

    res.status(201).json({
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payload: LoginInput = validate(loginSchema, req.body);

    const user = await prisma.user.findFirst({
      where: { email: { equals: payload.email, mode: "insensitive" } },
    });

    const isValidPassword =
      user && (await bcrypt.compare(payload.password, user.password));

    if (!user || !isValidPassword) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = signToken(user.id);

    res.json({
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};
