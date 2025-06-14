import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UTC_TIMESTAMP_REGEX } from 'src/common/constants/validatorConstants';

/**
 * Validates if a string matches the YYYY-MM-DDThh:mm:ssZ format and represents a valid UTC timestamp
 *
 * @example
 * ```typescript
 * class EventDto {
 *   @IsUTCTimestamp()
 *   dateLastModified: Date;
 * }
 * ```
 *
 * Valid formats:
 * - "2024-01-01T00:00:00Z"
 * - "2024-12-31T23:59:59Z"
 *
 * Invalid formats:
 * - "2024-13-01T00:00:00Z" (invalid month)
 * - "2024-04-31T00:00:00Z" (invalid day for April)
 * - "2024-01-01T24:00:00Z" (invalid hour)
 * - "2024-01-01 00:00:00Z" (missing T separator)
 * - "2024-01-01T00:00:00+01:00" (non-UTC timezone)
 */
@ValidatorConstraint({ name: 'isUTCTimestamp', async: false })
export class UTCTimestampConstraint implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    if (typeof value !== 'string' || !UTC_TIMESTAMP_REGEX.test(value)) {
      return false;
    }

    return this.isValidDateTimeComponents(value);
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be a valid UTC timestamp in format YYYY-MM-DDThh:mm:ssZ`;
  }

  private isValidDateTimeComponents(value: string): boolean {
    const [dateStr, timeStr] = value.split('T');
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hour, minute, second] = timeStr.slice(0, -1).split(':').map(Number);

    const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second));

    return (
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day &&
      date.getUTCHours() === hour &&
      date.getUTCMinutes() === minute &&
      date.getUTCSeconds() === second
    );
  }
}

/**
 * Validates that a string is a valid UTC timestamp (YYYY-MM-DDThh:mm:ssZ)
 * @param validationOptions - Optional validation options
 * @returns PropertyDecorator for UTC timestamp validation
 */
export function IsUTCTimestamp(validationOptions?: ValidationOptions) {
  return function (target: object, propertyName: string) {
    registerDecorator({
      name: 'isUTCTimestamp',
      target: target.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: UTCTimestampConstraint,
    });
  };
}
