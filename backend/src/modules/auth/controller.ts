import { Request, Response } from 'express';

// POST /api/auth/register
export const register = async (_req: Request, _res: Response): Promise<void> => {};

// POST /api/auth/login
export const login = async (_req: Request, _res: Response): Promise<void> => {};

// POST /api/auth/logout
export const logout = async (_req: Request, _res: Response): Promise<void> => {};

// POST /api/auth/refresh
export const refresh = async (_req: Request, _res: Response): Promise<void> => {};
