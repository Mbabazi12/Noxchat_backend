import { Request, Response } from 'express';
export declare const createGroup: (_req: Request, _res: Response) => Promise<void>;
export declare const getGroup: (_req: Request, _res: Response) => Promise<void>;
export declare const updateGroup: (_req: Request, _res: Response) => Promise<void>;
export declare const addMembers: (_req: Request, _res: Response) => Promise<void>;
export declare const removeMember: (_req: Request, _res: Response) => Promise<void>;
export declare const promoteAdmin: (_req: Request, _res: Response) => Promise<void>;
export declare const demoteAdmin: (_req: Request, _res: Response) => Promise<void>;
export declare const leaveGroup: (_req: Request, _res: Response) => Promise<void>;
export declare const reportGroup: (_req: Request, _res: Response) => Promise<void>;
export declare const setSleepMode: (_req: Request, _res: Response) => Promise<void>;
//# sourceMappingURL=controller.d.ts.map