import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

/**
 * Options for the IsNonEmptyString decorator
 */
export interface IsNonEmptyStringOptions extends ValidationOptions {
  /**
   * Minimum length required after trimming
   * @remarks Must be a positive integer (≥ 1)
   */
  minSize?: number;

  /**
   * Maximum length allowed after trimming
   * @remarks Must be a positive integer and greater than or equal to minSize
   */
  maxSize?: number;
}

/**
 * Custom decorator that validates a string is not empty after trimming whitespace,
 * with optional minimum and maximum length constraints.
 *
 * @example
 * ```typescript
 * class UserDto {
 *   @IsNonEmptyString()
 *   name: string;
 *
 *   @IsNonEmptyString({ minSize: 10, maxSize: 200 })
 *   bio: string;
 *
 *   @IsNonEmptyString({
 *     minSize: 5,
 *     message: args => `${args.property} must contain text between 5-${args.constraints[1]} characters`
 *   })
 *   description: string;
 * }
 * ```
 *
 * @param validationOptions - Standard validation options plus length constraints
 * @param validationOptions.minSize - Minimum length required after trimming (optional)
 * @param validationOptions.maxSize - Maximum length allowed after trimming (optional)
 * @param validationOptions.message - Custom error message or function returning a message
 *
 * @returns A PropertyDecorator function that registers the validation constraint
 */
export function IsNonEmptyString(validationOptions?: IsNonEmptyStringOptions) {
  const minSize = validationOptions?.minSize;
  const maxSize = validationOptions?.maxSize;

  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'IsNonEmptyString',
      target: object.constructor,
      propertyName,
      constraints: [minSize, maxSize],
      options: validationOptions,
      validator: {
        /**
         * Validates that the value is a string with non-whitespace content
         * and satisfies length constraints if specified.
         *
         * @param value - The value to validate
         * @returns True if all validation conditions are met
         */
        validate: (value: any): boolean => {
          if (typeof value !== 'string' || !value.trim()) return false;

          const trimmedLength = value.trim().length;

          if (
            (minSize !== undefined && trimmedLength < minSize) ||
            (maxSize !== undefined && trimmedLength > maxSize)
          ) {
            return false;
          }

          return true;
        },
        /**
         * Generates an error message when validation fails.
         * The message clearly indicates which validation condition failed.
         *
         * @param validationArguments - Contains property name and other validation context
         * @returns A descriptive error message based on the failed condition
         */
        defaultMessage: (validationArguments?: ValidationArguments): string => {
          const { property, value, constraints } = validationArguments;
          const message = validationOptions?.message;

          if (typeof message === 'function')
            return message(validationArguments);
          if (message) return message;

          const [min, max] = constraints;
          if (typeof value !== 'string' || !value.trim())
            return `${property} must be a non-empty string`;

          const trimmedLength = value.trim().length;
          if (min !== undefined && trimmedLength < min) {
            return `${property} must be at least ${min} characters long (excluding spaces)`;
          }
          if (max !== undefined && trimmedLength > max) {
            return `${property} cannot exceed ${max} characters`;
          }

          return `${property} must be a valid string`;
        },
      },
    });
  };
}
