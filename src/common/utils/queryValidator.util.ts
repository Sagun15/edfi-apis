import {
  CALENDAR_DATE_FORMAT,
  DATE_REGEX,
  PHONE_NUMBER_LOCALE_TO_REGEX,
} from '../constants/validatorConstants';

export class QueryValidator {
  /**
   * Validates whether the provided string is a valid date in either ISO 8601 format or the `YYYY-MM-DD` format.
   *
   * The validation uses a regular expression to check if the string conforms to:
   * - The full ISO 8601 format (e.g., `YYYY-MM-DDTHH:mm:ssZ`, `YYYY-MM-DDTHH:mm:ss+HH:mm`).
   * - The date-only format (e.g., `YYYY-MM-DD`).
   *
   * Examples of valid formats:
   * - `2024-12-07` (date-only)
   * - `2024-12-07T13:30:00Z` (UTC time)
   * - `2024-12-07T13:30:00+05:30` (time with timezone)
   *
   * Examples of invalid formats:
   * - `Sat Dec 07 2024 13:30:00 GMT+0530 (India Standard Time)` (non-ISO format)
   * - `2024/12/07` (uses slashes instead of dashes)
   * - `InvalidDate`
   *
   * @param {string} date - The string to validate as a date.
   * @returns {boolean} - `true` if the string matches a valid date format; otherwise, `false`.
   */
  static isValidDate = (date: string): boolean => {
    return DATE_REGEX.test(date);
  };

  /**
   * Validates whether the provided string is a valid ISO 8601 date in `YYYY-MM-DD` format.
   *
   * The validation strictly checks against the predefined `CALENDAR_DATE_FORMAT` regex pattern.
   *
   * @example
   * ```typescript
   * QueryValidator.isValidISODate("2025-01-01"); // true
   * QueryValidator.isValidISODate("2025-02-30"); // false (invalid date)
   * QueryValidator.isValidISODate("2025/01/01"); // false (wrong separator)
   * ```
   *
   * @param {string} date - The string to validate as an ISO date.
   * @returns {boolean} `true` if the string is a valid `YYYY-MM-DD` date, otherwise `false`.
   */
  static isValidISODate = (date: string): boolean => {
    return CALENDAR_DATE_FORMAT.test(date);
  };

  /**
   * Validates if the given string is a valid mobile phone number for the specified locale.
   *
   * @param phone - The phone number string to validate.
   * @param locale - The locale for mobile phone validation (e.g., 'en-US').
   * @returns `true` if the value is a valid mobile phone number, otherwise `false`.
   */
  static isValidMobilePhone(phone: string, locale: string = 'en-US'): boolean {
    const regex: RegExp = PHONE_NUMBER_LOCALE_TO_REGEX[locale];
    return regex.test(phone);
  }

  /**
   * Checks if the given string value is either "true" or "false" (case-insensitive).
   *
   * @param {string} value - The string value to check.
   * @returns {boolean} - Returns `true` if the value is "true" or "false" (case-insensitive), otherwise returns `false`.
   */
  static isBooleanString(value: string): boolean {
    return value.toLowerCase() === 'true' || value.toLowerCase() === 'false';
  }

  /**
   * Utility function to check if a given string can be converted to a valid numeric value.
   *
   * @param value - The input string to check.
   * @returns `true` if the string can be converted to a valid number, otherwise `false`.
   */
  static isParsableToNumber(value: string): boolean {
    if (typeof value !== 'string' || value.trim() === '') return false;

    return !isNaN(Number(value));
  }
}
