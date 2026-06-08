import { Request, Response } from 'express';
export declare const sendMessage: (_req: Request, _res: Response) => Promise<void>;
export declare const getMessages: (_req: Request, _res: Response) => Promise<void>;
export declare const deleteForEveryone: (_req: Request, _res: Response) => Promise<void>;
export declare const deleteForMe: (_req: Request, _res: Response) => Promise<void>;
export declare const forwardMessage: (_req: Request, _res: Response) => Promise<void>;
export declare const pinMessage: (_req: Request, _res: Response) => Promise<void>;
export declare const unpinMessage: (_req: Request, _res: Response) => Promise<void>;
export declare const markAsRead: (_req: Request, _res: Response) => Promise<void>;
export declare const getOrCreateDirect: (_req: Request, _res: Response) => Promise<void>;
export declare const searchMessages: (_req: Request, _res: Response) => Promise<void>;
export declare const getThrowback: (_req: Request, _res: Response) => Promise<void>;
//# sourceMappingURL=controller.d.ts.map