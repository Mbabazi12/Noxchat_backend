import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth';
export declare const getMe: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateMe: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteMe: (req: AuthRequest, res: Response) => Promise<void>;
export declare const blockUser: (req: AuthRequest, res: Response) => Promise<void>;
export declare const unblockUser: (req: AuthRequest, res: Response) => Promise<void>;
export declare const muteUser: (req: AuthRequest, res: Response) => Promise<void>;
export declare const setGhostMode: (req: AuthRequest, res: Response) => Promise<void>;
export declare const claimDailyCoins: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getLeaderboard: (_req: AuthRequest, res: Response) => Promise<void>;
export declare const getTransactions: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=controller.d.ts.map