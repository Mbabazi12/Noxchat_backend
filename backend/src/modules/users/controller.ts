import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth';
import {
  getProfile,
  updateProfile,
  deleteAccount,
  blockUser as blockUserService,
  unblockUser as unblockUserService,
  muteUser as muteUserService,
  setGhostMode as setGhostModeService,
  claimDailyCoins as claimDailyCoinsService,
  getLeaderboard as getLeaderboardService,
  getTransactionHistory,
} from './service';
import { success, error } from '../../utils/response';

const getUserId = (req: AuthRequest): string => {
  const id = req.user?.id || req.user?.sub;
  if (!id || typeof id !== 'string') {
    throw new Error('Unauthorized');
  }
  return id;
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    const profile = await getProfile(userId);
    if (!profile) {
      error(res, 'Profile not found', 404);
      return;
    }
    success(res, profile);
  } catch (err) {
    error(res, (err as Error).message, 400);
  }
};

export const updateMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    const profile = await updateProfile(userId, req.body);
    if (!profile) {
      error(res, 'Unable to update profile', 404);
      return;
    }
    success(res, profile);
  } catch (err) {
    error(res, (err as Error).message, 400);
  }
};

export const deleteMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    await deleteAccount(userId);
    success(res, { message: 'Account scheduled for deletion within 7 days' });
  } catch (err) {
    error(res, (err as Error).message, 400);
  }
};

export const blockUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    const targetId = req.params.targetId;
    await blockUserService(userId, targetId);
    success(res, { message: 'User blocked' });
  } catch (err) {
    error(res, (err as Error).message, 400);
  }
};

export const unblockUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    const targetId = req.params.targetId;
    await unblockUserService(userId, targetId);
    success(res, { message: 'User unblocked' });
  } catch (err) {
    error(res, (err as Error).message, 400);
  }
};

export const muteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    const targetId = req.params.targetId;
    await muteUserService(userId, targetId);
    success(res, { message: 'User muted' });
  } catch (err) {
    error(res, (err as Error).message, 400);
  }
};

export const setGhostMode = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    const ghostMode = await setGhostModeService(userId, req.body);
    success(res, ghostMode);
  } catch (err) {
    error(res, (err as Error).message, 400);
  }
};

export const claimDailyCoins = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    const totalCoins = await claimDailyCoinsService(userId);
    success(res, { noxCoins: totalCoins });
  } catch (err) {
    error(res, (err as Error).message, 400);
  }
};

export const getLeaderboard = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const leaderboard = await getLeaderboardService();
    success(res, leaderboard);
  } catch (err) {
    error(res, (err as Error).message, 400);
  }
};

export const getTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    const transactions = await getTransactionHistory(userId);
    success(res, transactions);
  } catch (err) {
    error(res, (err as Error).message, 400);
  }
};
