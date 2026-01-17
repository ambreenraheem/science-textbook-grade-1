/**
 * Prisma Configuration for Prisma 7.x
 * Handles database connection URL for migrations and CLI commands
 */

import path from 'node:path';
import type { PrismaConfig } from 'prisma';

export default {
  earlyAccess: true,
  schema: path.join(__dirname, 'schema.prisma'),

  migrate: {
    async adapter() {
      // Use DATABASE_URL from environment for migrations
      const url = process.env.DATABASE_URL;
      if (!url) {
        throw new Error('DATABASE_URL environment variable is required for migrations');
      }

      // Return PostgreSQL adapter configuration
      const { PrismaPg } = await import('@prisma/adapter-pg');
      const { Pool } = await import('pg');

      const pool = new Pool({ connectionString: url });
      return new PrismaPg(pool);
    },
  },
} satisfies PrismaConfig;
