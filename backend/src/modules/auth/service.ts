import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../users/model';

const ACCESS_TOKEN_EXPIRY  = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
const MIN_AGE_YEARS = 13;

const signAccess = (userId: string): string =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET as string, { expiresIn: ACCESS_TOKEN_EXPIRY });

const signRefresh = (userId: string): string =>
  jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: REFRESH_TOKEN_EXPIRY });

const getAge = (dob: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age--;
  return age;
};

export const register = async (
  name: string,
  email: string,
  password: string,
  dob: Date,
): Promise<{ user: Partial<IUser>; accessToken: string; refreshToken: string }> => {
  if (getAge(dob) < MIN_AGE_YEARS) {
    throw Object.assign(new Error('You must be at least 13 years old to register.'), { status: 403 });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    throw Object.assign(new Error('Email already in use.'), { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashed, dob });

  const accessToken  = signAccess(String(user._id));
  const refreshToken = signRefresh(String(user._id));

  user.refreshToken = refreshToken;
  await user.save();

  return {
    user:  { _id: user._id, name: user.name, email: user.email, noxCoins: user.noxCoins },
    accessToken,
    refreshToken,
  };
};

export const login = async (
  email: string,
  password: string,
): Promise<{ user: Partial<IUser>; accessToken: string; refreshToken: string }> => {
  const user = await User.findOne({ email }).select('+password +refreshToken');
  if (!user) {
    throw Object.assign(new Error('Invalid email or password.'), { status: 401 });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Object.assign(new Error('Invalid email or password.'), { status: 401 });
  }

  const accessToken  = signAccess(String(user._id));
  const refreshToken = signRefresh(String(user._id));

  user.refreshToken = refreshToken;
  user.onlineStatus = true;
  user.lastSeen = new Date();
  await user.save();

  return {
    user:  { _id: user._id, name: user.name, email: user.email, noxCoins: user.noxCoins, avatar: user.avatar },
    accessToken,
    refreshToken,
  };
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

  const user = await User.findById(payload.id).select('+refreshToken');
  if (!user || user.refreshToken !== token) {
    throw Object.assign(new Error('Refresh token revoked.'), { status: 401 });
  }

  const accessToken = signAccess(String(user._id));
  return { accessToken };
};

export const logout = async (userId: string): Promise<void> => {
  await User.findByIdAndUpdate(userId, {
    refreshToken: null,
    onlineStatus: false,
    lastSeen: new Date(),
  });
};
