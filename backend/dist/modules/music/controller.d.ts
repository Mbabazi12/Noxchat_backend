import { Request, Response } from 'express';
export declare const uploadSong: (_req: Request, _res: Response) => Promise<void>;
export declare const getSongs: (_req: Request, _res: Response) => Promise<void>;
export declare const deleteSong: (_req: Request, _res: Response) => Promise<void>;
export declare const createRoom: (_req: Request, _res: Response) => Promise<void>;
export declare const joinRoom: (_req: Request, _res: Response) => Promise<void>;
export declare const leaveRoom: (_req: Request, _res: Response) => Promise<void>;
export declare const hostControl: (_req: Request, _res: Response) => Promise<void>;
export declare const requestSong: (_req: Request, _res: Response) => Promise<void>;
export declare const approveRequest: (_req: Request, _res: Response) => Promise<void>;
export declare const getRoom: (_req: Request, _res: Response) => Promise<void>;
//# sourceMappingURL=controller.d.ts.map