import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

type ComparisonFunction = (date1: Date, date2: Date) => boolean;

/**
 * Creates a date comparison decorator
 */
function createDateComparisonDecorator(
  name: string,
  compare: ComparisonFunction,
  messageVerb: string,
) {
  return function (property: string, validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
      registerDecorator({
        name,
        target: object.constructor,
        propertyName,
        constraints: [property],
        options: validationOptions,
        validator: {
          validate(value: any, args: ValidationArguments) {
            const [relatedPropertyName] = args.constraints;
            const relatedValue = (args.object as any)[relatedPropertyName];

            // If either value is not provided, consider it valid
            if (!value || !relatedValue) {
              return true;
            }

            const dateValue = new Date(value);
            const relatedDateValue = new Date(relatedValue);

            // Check if both values are valid dates
            if (
              isNaN(dateValue.getTime()) ||
              isNaN(relatedDateValue.getTime())
            ) {
              return false;
            }

            return compare(dateValue, relatedDateValue);
          },
          defaultMessage(args: ValidationArguments) {
            const [relatedPropertyName] = args.constraints;
            return `${args.property} must be ${messageVerb} ${relatedPropertyName}`;
          },
        },
      });
    };
  };
}

/**
 * Custom decorator to validate if a date is before or equal to another date
 */
export const IsDateBeforeOrEqual = createDateComparisonDecorator(
  'isDateBeforeOrEqual',
  (date1, date2) => date1 <= date2,
  'before or equal to',
);

/**
 * Custom decorator to validate if a date is after or equal to another date
 */
export const IsDateAfterOrEqual = createDateComparisonDecorator(
  'isDateAfterOrEqual',
  (date1, date2) => date1 >= date2,
  'after or equal to',
);
