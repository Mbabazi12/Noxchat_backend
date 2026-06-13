import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined. Set it in .env before starting the app.');
}

const prisma = new PrismaClient();


export const connectDB = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log("PostgreSQL connected");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

export default prisma;
