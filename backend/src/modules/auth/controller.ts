import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/db';
import { success, error } from '../../utils/response';

// POST /api/auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, dob } = req.body as { name?: string; email?: string; password?: string; dob?: string };
    if (!email || !password) {
      error(res, 'Email and password are required', 400);
      return;
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      error(res, 'Email already registered', 400);
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    const created = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name: name || null,
        dob: dob ? new Date(dob) : null,
      },
    });

    const token = jwt.sign({ id: created.id }, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRES_IN });
    const { password: _p, ...user } = created as any;
    success(res, { user, token }, 201);
  } catch (err) {
    error(res, (err as Error).message, 500);
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password) {
      error(res, 'Email and password are required', 400);
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.isDeleted) {
      error(res, 'Invalid credentials', 401);
      return;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      error(res, 'Invalid credentials', 401);
      return;
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRES_IN });
    const { password: _p, ...safeUser } = user as any;
    success(res, { user: safeUser, token });
  } catch (err) {
    error(res, (err as Error).message, 500);
  }
};

// POST /api/auth/logout
export const logout = async (_req: Request, res: Response): Promise<void> => {
  // Stateless JWT logout - client should discard token
  success(res, { message: 'Logged out' });
};

// POST /api/auth/refresh
export const refresh = async (_req: Request, res: Response): Promise<void> => {
  // Not implemented - token refresh flow not present
  error(res, 'Not implemented', 501);
};
