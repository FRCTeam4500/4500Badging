import { PrismaClient } from '@prisma/client'

declare global {
    var prisma: PrismaClient | undefined
};

/**
 * Prisma Client Interface Instance
 */
export const db = globalThis.prisma || new PrismaClient().$extends(withAccelerate())

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db