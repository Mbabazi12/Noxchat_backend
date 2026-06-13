import { Request, Response } from 'express';
import * as authService from './service';
import { success, error } from '../../utils/response';
import { AuthRequest } from '../../middlewares/auth';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, dob } = req.body;

    if (!name || !email || !password || !dob) {
      error(res, 'name, email, password and dob are required.', 400);
      return;
    }

    const result = await authService.register(name, email, password, new Date(dob));
    success(res, result, 201);
  } catch (err: any) {
    error(res, err.message, err.status ?? 500);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      error(res, 'email and password are required.', 400);
      return;
    }

    const result = await authService.login(email, password);
    success(res, result);
  } catch (err: any) {
    error(res, err.message, err.status ?? 500);
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      error(res, 'refreshToken is required.', 400);
      return;
    }

    const result = await authService.refreshAccessToken(refreshToken);
    success(res, result);
  } catch (err: any) {
    error(res, err.message, err.status ?? 500);
  }
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await authService.logout(req.user!.id as string);
    success(res, { message: 'Logged out successfully.' });
  } catch (err: any) {
    error(res, err.message, err.status ?? 500);
  }
};
