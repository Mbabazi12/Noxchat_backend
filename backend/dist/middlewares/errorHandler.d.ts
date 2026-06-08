import { Request, Response, NextFunction } from 'express';
interface AppError extends Error {
    status?: number;
}
declare const errorHandler: (err: AppError, _req: Request, res: Response, _next: NextFunction) => void;
export default errorHandler;
//# sourceMappingURL=errorHandler.d.ts.map