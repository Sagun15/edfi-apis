import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { loadEnvConfig } from './env.config';

// Load environment variables first
loadEnvConfig();

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  username: process.env.DB_USERNAME,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  autoLoadEntities: true,
  entities:
    process.env.NODE_ENV === 'prod'
      ? ['dist/**/*.entity.js']
      : [__dirname + '../../src/**/*.entity.ts'],
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
  // The synchronize setting applies changes to db as soon as
  // they are saved, do NOT set this to true.
  synchronize: false,
  logging: process.env.NODE_ENV === 'dev',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
};
