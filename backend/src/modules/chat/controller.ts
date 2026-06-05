import { Request, Response } from 'express';

export const sendMessage = async (_req: Request, _res: Response): Promise<void> => {};
export const getMessages = async (_req: Request, _res: Response): Promise<void> => {};
export const deleteForEveryone = async (_req: Request, _res: Response): Promise<void> => {};
export const deleteForMe = async (_req: Request, _res: Response): Promise<void> => {};
export const forwardMessage = async (_req: Request, _res: Response): Promise<void> => {};
export const pinMessage = async (_req: Request, _res: Response): Promise<void> => {};
export const unpinMessage = async (_req: Request, _res: Response): Promise<void> => {};
export const markAsRead = async (_req: Request, _res: Response): Promise<void> => {};
export const getOrCreateDirect = async (_req: Request, _res: Response): Promise<void> => {};
export const searchMessages = async (_req: Request, _res: Response): Promise<void> => {};
export const getThrowback = async (_req: Request, _res: Response): Promise<void> => {};
