import { IsNotIn, ValidateIf, ValidationOptions } from 'class-validator';
import { applyDecorators } from '@nestjs/common';
import { isUndefined } from '@nestjs/common/utils/shared.utils';

/**
 * Custom decorator that combines the `@IsNotIn` and `@ValidateIf` decorators to enforce that a property:
 * - Is not `null` (using `@IsNotIn([null])`).
 * - Is validated only if it is defined (i.e., not `undefined`), using `@ValidateIf`.
 *
 * This decorator is useful when you want to ensure a property is not `null` and apply validation only if the property is present.
 *
 * @param validationOptions Optional validation options to customize the behavior and error messages.
 * @returns A property decorator function that applies the combined validation rules.
 *
 * @example
 * import { IsOptionalButNotNull } from './path/to/decorator';
 *
 * class MyDto {
 *   @IsOptionalButNotNull({ message: 'Property should not be null.' })
 *   myProperty?: string;
 * }
 */
export function IsOptionalButNotNull(validationOptions?: ValidationOptions) {
  return applyDecorators(
    IsNotIn([null], validationOptions),
    ValidateIf((_object, value) => !isUndefined(value)),
  );
}
