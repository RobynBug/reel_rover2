import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const testPrismaConnection = async () => {
    try {
        await prisma.$executeRaw`SELECT 1`;
        console.log('✅ Database connection (Prisma) successful');
    } catch (err) {
        console.error('❌ Database connection error (Prisma):', err);
        process.exit(1); 
    }
};

export { prisma, testPrismaConnection };