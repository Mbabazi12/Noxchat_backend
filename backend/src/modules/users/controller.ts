import { Request, Response } from 'express';

export const getMe = async (_req: Request, _res: Response): Promise<void> => {};
export const updateMe = async (_req: Request, _res: Response): Promise<void> => {};
export const deleteMe = async (_req: Request, _res: Response): Promise<void> => {};
export const blockUser = async (_req: Request, _res: Response): Promise<void> => {};
export const unblockUser = async (_req: Request, _res: Response): Promise<void> => {};
export const muteUser = async (_req: Request, _res: Response): Promise<void> => {};
export const setGhostMode = async (_req: Request, _res: Response): Promise<void> => {};
export const claimDailyCoins = async (_req: Request, _res: Response): Promise<void> => {};
export const getLeaderboard = async (_req: Request, _res: Response): Promise<void> => {};
export const getTransactions = async (_req: Request, _res: Response): Promise<void> => {};
