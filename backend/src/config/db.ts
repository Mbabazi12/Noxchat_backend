import 'dotenv/config';
import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined. Set it in .env before starting the app.');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

export const connectDB = async (): Promise<void> => {
  await prisma.$connect();
  console.log('PostgreSQL connected via Prisma');
};

export default prisma;
