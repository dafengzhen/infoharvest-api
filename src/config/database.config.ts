import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import type { DataSourceOptions } from 'typeorm';

import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenvConfig({ path: '.env' });

const config: DataSourceOptions = {
  cache: {
    duration: 60000,
    tableName: 'query_result_cache',
    type: 'database',
  },
  database: process.env.DATABASE_NAME,
  entities: ['dist/**/*.entity.js'],
  host: process.env.DATABASE_HOST,
  logging: true,
  migrations: ['dist/migrations/*.js'],
  migrationsRun: false,
  multipleStatements: true,
  namingStrategy: new SnakeNamingStrategy(),
  password: process.env.DATABASE_PASSWORD,
  port: parseInt(process.env.DATABASE_PORT as string),
  synchronize: true,
  timezone: process.env.DATABASE_TIMEZONE,
  type: 'mysql',
  username: process.env.DATABASE_USERNAME,
};

export default registerAs('database', (): TypeOrmModuleOptions => config);

export const dataSource = new DataSource(config);
