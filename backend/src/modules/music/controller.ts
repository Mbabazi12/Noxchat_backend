import { Request, Response } from 'express';

export const uploadSong = async (_req: Request, _res: Response): Promise<void> => {};
export const getSongs = async (_req: Request, _res: Response): Promise<void> => {};
export const deleteSong = async (_req: Request, _res: Response): Promise<void> => {};
export const createRoom = async (_req: Request, _res: Response): Promise<void> => {};
export const joinRoom = async (_req: Request, _res: Response): Promise<void> => {};
export const leaveRoom = async (_req: Request, _res: Response): Promise<void> => {};
export const hostControl = async (_req: Request, _res: Response): Promise<void> => {};
export const requestSong = async (_req: Request, _res: Response): Promise<void> => {};
export const approveRequest = async (_req: Request, _res: Response): Promise<void> => {};
export const getRoom = async (_req: Request, _res: Response): Promise<void> => {};
