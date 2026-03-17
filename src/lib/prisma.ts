import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export function getPrisma() {
  if (!globalForPrisma.prisma) {
    const client = createPrismaClient();
    if (!client) throw new Error('DATABASE_URL is not set');
    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = client;
    }
    return client;
  }
  return globalForPrisma.prisma;
}
