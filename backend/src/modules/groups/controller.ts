import { Request, Response } from 'express';

export const createGroup = async (_req: Request, _res: Response): Promise<void> => {};
export const getGroup = async (_req: Request, _res: Response): Promise<void> => {};
export const updateGroup = async (_req: Request, _res: Response): Promise<void> => {};
export const addMembers = async (_req: Request, _res: Response): Promise<void> => {};
export const removeMember = async (_req: Request, _res: Response): Promise<void> => {};
export const promoteAdmin = async (_req: Request, _res: Response): Promise<void> => {};
export const demoteAdmin = async (_req: Request, _res: Response): Promise<void> => {};
export const leaveGroup = async (_req: Request, _res: Response): Promise<void> => {};
export const reportGroup = async (_req: Request, _res: Response): Promise<void> => {};
export const setSleepMode = async (_req: Request, _res: Response): Promise<void> => {};
