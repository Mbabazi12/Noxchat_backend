import { UserDocument, GhostMode } from './model';
export interface GhostModeOptions {
    enabled: boolean;
    schedule?: {
        start?: string;
        end?: string;
    };
    whitelist?: string[];
}
export interface LeaderboardEntry {
    rank: number;
    name: string;
    noxCoins: number;
    weeklyBadge: boolean;
}
export interface TransactionEntry {
    amount: number;
    outcome: 'win' | 'loss' | 'pending';
    createdAt: Date;
    settledAt?: Date;
}
export declare const getProfile: (userId: string) => Promise<Omit<UserDocument, "password"> | null>;
export declare const updateProfile: (userId: string, data: Partial<UserDocument>) => Promise<Omit<UserDocument, "password"> | null>;
export declare const deleteAccount: (userId: string) => Promise<void>;
export declare const blockUser: (userId: string, targetId: string) => Promise<void>;
export declare const unblockUser: (userId: string, targetId: string) => Promise<void>;
export declare const muteUser: (userId: string, targetId: string) => Promise<void>;
export declare const setGhostMode: (userId: string, options: GhostModeOptions) => Promise<GhostMode | null>;
export declare const claimDailyCoins: (userId: string) => Promise<number>;
export declare const getLeaderboard: () => Promise<LeaderboardEntry[]>;
export declare const getTransactionHistory: (userId: string) => Promise<TransactionEntry[]>;
//# sourceMappingURL=service.d.ts.map