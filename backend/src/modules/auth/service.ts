import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../generated/prisma';
import prisma from '../../config/db';

const ACCESS_TOKEN_EXPIRY  = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
const MIN_AGE_YEARS        = 13;

type AuthUser = Pick<User, 'id' | 'name' | 'email' | 'noxCoins' | 'avatar'>;
type AuthResult = { user: AuthUser; accessToken: string; refreshToken: string };

const signAccess = (userId: string): string =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET as string, { expiresIn: ACCESS_TOKEN_EXPIRY });

const signRefresh = (userId: string): string =>
  jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: REFRESH_TOKEN_EXPIRY });

const getAge = (dob: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
};

const safeUser = (u: User): AuthUser =>
  ({ id: u.id, name: u.name, email: u.email, noxCoins: u.noxCoins, avatar: u.avatar });

export const register = async (
  name: string,
  email: string,
  password: string,
  dob: Date,
): Promise<AuthResult> => {
  if (getAge(dob) < MIN_AGE_YEARS)
    throw Object.assign(new Error('You must be at least 13 years old to register.'), { status: 403 });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing)
    throw Object.assign(new Error('Email already in use.'), { status: 409 });

  const hashed = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { name, email, password: hashed, dob },
  });

  const accessToken  = signAccess(user.id);
  const refreshToken = signRefresh(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data:  { refreshToken },
  });

  return { user: safeUser(user), accessToken, refreshToken };
};

export const login = async (
  email: string,
  password: string,
): Promise<AuthResult> => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    throw Object.assign(new Error('Invalid email or password.'), { status: 401 });

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    throw Object.assign(new Error('Invalid email or password.'), { status: 401 });

  const accessToken  = signAccess(user.id);
  const refreshToken = signRefresh(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data:  { refreshToken, onlineStatus: true, lastSeen: new Date() },
  });

  return { user: safeUser(user), accessToken, refreshToken };
};

export const refreshAccessToken = async (
  token: string,
): Promise<{ accessToken: string }> => {
  let payload: jwt.JwtPayload;
  try {
    payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as jwt.JwtPayload;
  } catch {
    throw Object.assign(new Error('Invalid or expired refresh token.'), { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: payload.id } });
  if (!user || user.refreshToken !== token)
    throw Object.assign(new Error('Refresh token revoked.'), { status: 401 });

  return { accessToken: signAccess(user.id) };
};

export const logout = async (userId: string): Promise<void> => {
  await prisma.user.update({
    where: { id: userId },
    data:  { refreshToken: null, onlineStatus: false, lastSeen: new Date() },
  });
};
