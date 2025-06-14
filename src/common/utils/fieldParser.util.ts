import _ from 'lodash';
import { FindOptionsWhere } from 'typeorm';
export class FieldParser {
  /**
   * Returns a string representing the property field with an optional prefix.
   * The property field is a string that is constructed by appending the property name (as a string) to the provided prefix.
   *
   * @param {keyof T} property - The property name from the generic type `T`. It can be any key from `T`.
   * @param {string} [fieldPrefix=''] - An optional string prefix to be added before the property name. Defaults to an empty string.
   *
   * @returns {string} - The concatenated string consisting of the field prefix (if provided) and the property name as a string.
   *
   * @example
   * // Example with no prefix
   * const result = Users.getPropertyField('givenName');
   * console.log(result); // Output: "givenName"
   *
   * // Example with prefix
   * const resultWithPrefix = Users.getPropertyField('givenName', 'user.');
   * console.log(resultWithPrefix); // Output: "user.givenName"
   */
  static getPropertyField<T>(
    property: keyof T,
    fieldPrefix: string = '',
  ): string {
    return fieldPrefix + property?.toString();
  }

  /**
   * Merges two objects deeply, preserving nested structures and combining arrays.
   * Uses lodash's `mergeWith` function to handle custom merge logic.
   *
   * @param objectA - The first object to merge.
   * @param objectB - The second object to merge.
   * @returns A new object with deeply merged properties from both objects.
   *
   * @example
   * const objectA = {
   *   profile: {
   *     result: {
   *       id: '123',
   *     },
   *   },
   * };
   *
   * const objectB = {
   *   profile: {
   *     result: {
   *       type: 'example',
   *     },
   *   },
   * };
   *
   * const merged = FieldParser.mergeObjects(objectA, objectB);
   * // Result:
   * // {
   * //   profile: {
   * //     result: {
   * //       id: '123',
   * //       type: 'example',
   * //     },
   * //   },
   * // }
   *
   */
  static mergeObjects(
    objectA: Record<string, any>,
    objectB: Record<string, any>,
  ): Record<string, any> {
    const objectACopy: Record<string, any> = _.cloneDeep(objectA);
    const objectBCopy: Record<string, any> = _.cloneDeep(objectB);

    return _.mergeWith(
      objectACopy,
      objectBCopy,
      (targetValue: Record<string, any>, sourceValue: Record<string, any>) => {
        if (Array.isArray(targetValue)) {
          return targetValue.concat(sourceValue);
        }
      },
    );
  }

  /**
   * Combines an array of filter conditions with a custom condition using deep merge logic.
   * Each filter condition in the array is deeply merged with the provided custom condition.
   *
   * @template T - The type of the entities being filtered.
   * @param filters - An array of filter conditions to be merged.
   * @param customCondition - A custom condition to be merged with each filter condition.
   * @returns A new array where each filter condition is deeply merged with the custom condition.
   *
   * @example
   * const filters = [
   *   { status: 'active' },
   *   { role: 'admin' }
   * ];
   *
   * const customCondition = { isDeleted: false };
   *
   * const mergedFilters = FieldParser.getMergedFilterAndCustomConditions(filters, customCondition);
   * // Result:
   * // [
   * //   { status: 'active', isDeleted: false },
   * //   { role: 'admin', isDeleted: false }
   * // ]
   */
  static getMergedFilterAndCustomConditions<T>(
    filters: FindOptionsWhere<T>[],
    customCondition: FindOptionsWhere<T>,
  ): FindOptionsWhere<T>[] {
    return filters.map((filterCondition: FindOptionsWhere<T>) =>
      this.mergeObjects(filterCondition, customCondition),
    );
  }
}
