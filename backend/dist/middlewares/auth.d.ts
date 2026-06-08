import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
export interface AuthRequest extends Request {
    user?: jwt.JwtPayload;
}
declare const auth: (req: AuthRequest, res: Response, next: NextFunction) => void;
export default auth;
//# sourceMappingURL=auth.d.ts.map