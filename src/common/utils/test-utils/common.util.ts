import { faker } from '@faker-js/faker/.';

/**
 * Generates a random number between the given min and max values, inclusive.
 *
 * The function can be used to generate a random number for testing purposes.
 *
 * @param {number} [min=0] The minimum value for the generated number.
 * @param {number} [max=10000] The maximum value for the generated number.
 *
 * @returns {number} A random number between the given min and max values.
 */
export const generateTestNumber = (
  min: number = 0,
  max: number = 10000,
): number => {
  return Number(faker.number.float({ min, max }));
};

export const INVALID_NUMERIC_STRINGS: string[] = [
  'abc',
  '',
  ' ',
  'null',
  'undefined',
  'NaN',
  'abc123',
  '...',
  '$123',
  'test@123',
];
