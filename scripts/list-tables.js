const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  try {
    const result = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('--- TABLES IN YOUR POSTGRES DATABASE ("noxchat") ---');
    console.log(result);
  } catch (err) {
    console.error('Error fetching tables:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
