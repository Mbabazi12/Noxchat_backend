const { PrismaClient } = require('@prisma/client');

const passwords = ['postgres', 'root', 'admin', 'password', '123456', '1234', 'noxchat', ''];

async function testPasswords() {
  for (const password of passwords) {
    const url = `postgresql://postgres:${password}@localhost:5432/noxchat?schema=public`;
    const prisma = new PrismaClient({
      datasources: { db: { url } },
    });

    try {
      await prisma.$connect();
      console.log(`SUCCESS with password: "${password}"`);
      await prisma.$disconnect();
      return password;
    } catch (err) {
      console.log(`Failed with password "${password}"`);
      await prisma.$disconnect();
    }
  }
}

testPasswords();
