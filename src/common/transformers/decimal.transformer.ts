/**
 * Handles safe conversion between database decimal strings and TypeScript numbers.
 * Use this transformer when working with decimal/numeric columns in TypeORM entities
 * to ensure consistent type handling and null safety.
 *
 * Common use cases:
 * - Any decimal numbers that need precision
 *
 * @example
 * // Entity with percentage/score
 * @Column({
 *   type: 'decimal',
 *   precision: 5,
 *   scale: 2,
 *   transformer: DecimalTransformer
 * })
 * score: number;
 */
export const DecimalTransformer = {
  /**
   * Converts entity number to database value
   * @param value - Number from entity property
   * @returns Same value for database storage
   */
  to(value: number | null): number | null {
    return value;
  },

  /**
   * Converts database string to entity number
   * @param value - String from database
   * @returns Parsed number or null for invalid/empty values
   */
  from(value: string | null): number | null {
    if (value === null || value === undefined) {
      return null;
    }
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
  },
};
