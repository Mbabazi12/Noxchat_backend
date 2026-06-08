import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

export const connectDB = async (): Promise<void> => {
  await prisma.$connect();
  console.log('PostgreSQL connected via Prisma');
};

export default prisma;
