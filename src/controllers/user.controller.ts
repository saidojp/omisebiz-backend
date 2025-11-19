import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../prisma";
import { AppError } from "../middleware/errorHandler";
import {
  validate,
  updateUserSchema,
  usernameOnlySchema,
  emailOnlySchema,
  passwordOnlySchema,
} from "../utils/validation";
import { sanitizeUser } from "../utils/user";
import { Prisma } from "@prisma/client";

const SALT_ROUNDS = 10;

const ensureAuthenticated = (req: Request): string => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }
  return req.user.id;
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = ensureAuthenticated(req);
    const payload = validate(updateUserSchema, req.body);

    const data: { username?: string; password?: string } = {};

    if (payload.username !== undefined) {
      data.username = payload.username;
    }
    if (payload.password !== undefined) {
      data.password = await bcrypt.hash(payload.password, SALT_ROUNDS);
    }

    if (!Object.keys(data).length) {
      throw new AppError("No changes provided", 400);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
    });

    res.json({ user: sanitizeUser(updatedUser) });
  } catch (error) {
    next(error);
  }
};

export const updateUsername = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = ensureAuthenticated(req);
    const payload = validate(usernameOnlySchema, req.body);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { username: payload.username },
    });

    res.json({ user: sanitizeUser(updatedUser) });
  } catch (error) {
    next(error);
  }
};

export const updateEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = ensureAuthenticated(req);
    const payload = validate(emailOnlySchema, req.body);

    const existing = await prisma.user.findFirst({
      where: { email: { equals: payload.email, mode: "insensitive" } },
      select: { id: true },
    });

    if (existing && existing.id !== userId) {
      throw new AppError("Email already in use", 409);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { email: payload.email },
    });

    res.json({ user: sanitizeUser(updatedUser) });
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = ensureAuthenticated(req);
    const payload = validate(passwordOnlySchema, req.body);

    const hashedPassword = await bcrypt.hash(payload.password, SALT_ROUNDS);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.json({ message: "Password updated" });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = ensureAuthenticated(req);

    await prisma.user.delete({ where: { id: userId } });

    res.json({ message: "Account deleted" });
  } catch (error) {
    next(error);
  }
};
