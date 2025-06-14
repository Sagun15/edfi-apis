import { config } from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { Logger } from '@nestjs/common';

/**
 * Loads environment variables into the application.
 *
 * - If a `.env` file is present in the specified directory, environment variables
 *   are loaded from the file.
 * - If the `.env` file is absent, the function assumes a non-development
 *   environment and uses system environment variables instead.
 *
 * The function also validates that the required environment variables are set,
 * regardless of their source. Missing variables will cause the function to throw an error.
 *
 * @throws {Error} If loading the `.env` file fails or if required environment variables are missing.
 */
export function loadEnvConfig() {
  const envPath = resolve(__dirname, '../../.env');

  if (existsSync(envPath)) {
    const result = config({ path: envPath });

    if (result.error) {
      throw new Error(`Failed to load environment variables: ${result.error}`);
    }
  } else {
    Logger.log('Non-development mode detected. Skipping .env file loading.');
  }

  const requiredVars = [
    'DB_NAME',
    'DB_HOST',
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_PORT',
  ];
  const missing = requiredVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`,
    );
  }
}
