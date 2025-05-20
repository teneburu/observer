import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a UUID v4 string.
 * @returns A new UUID v4 string.
 */
export function generateUUID(): string {
  return uuidv4();
}

/**
 * Checks if the current environment is production.
 * This is a simple example based on an environment variable.
 * You might have a more sophisticated way of determining this in your config.
 * @param environment The environment string (e.g., from config).
 * @returns True if the environment is 'production', false otherwise.
 */
export function isProduction(environment: string): boolean {
  return environment.toLowerCase() === 'production';
}

/**
 * Checks if the current environment is development.
 * @param environment The environment string (e.g., from config).
 * @returns True if the environment is 'development', false otherwise.
 */
export function isDevelopment(environment: string): boolean {
  return environment.toLowerCase() === 'development';
}

// Add other utility functions as needed
