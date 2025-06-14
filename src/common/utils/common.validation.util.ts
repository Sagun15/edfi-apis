/**
 * Checks if the values of a specific field in a list of items are consistent
 * (i.e., all the values are the same or match a given value).
 *
 * @param {T[]} items - An array of items of type `T` to check.
 * @param {(item: T) => FieldType | undefined} fieldSelector - A function that selects the field value of each item of type `T`.
 * The function returns the value of type `FieldType` or `undefined` if the field is not found.
 * @param {FieldType} valueToMatch - An optional value of type `FieldType` to compare against. If not provided,
 * the function will use the field value from the first item in the list as the reference value.
 *
 * @returns {boolean} `true` if all the selected field values are consistent (equal to the reference value),
 * or if the items array is empty, otherwise `false`.
 *
 * @example
 * interface Person {
 *   name: string;
 *   age: number;
 * }
 *
 * const people: Person[] = [
 *   { name: 'Alice', age: 25 },
 *   { name: 'Bob', age: 25 },
 *   { name: 'Charlie', age: 25 },
 * ];
 *
 * // Using isFieldValueConsistent to check if all ages are the same
 * const areAgesConsistent = isFieldValueConsistent(people, (person) => person.age);
 * console.log(areAgesConsistent); // Output: true
 *
 * // Using isFieldValueConsistent with a specific value to match
 * const isAge25 = isFieldValueConsistent(people, (person) => person.age, 25);
 * console.log(isAge25); // Output: true
 *
 * // If the age for any person differs, the result will be false
 * const areAgesConsistentDifferent = isFieldValueConsistent(people, (person) => person.age, 30);
 * console.log(areAgesConsistentDifferent); // Output: false
 */
export function isFieldValueConsistent<T, FieldType>(
  items: T[],
  fieldSelector: (item: T) => FieldType | undefined,
  valueToMatch?: FieldType,
): boolean {
  if (!items?.length) {
    return true;
  }

  const referenceValue: FieldType =
    valueToMatch !== undefined ? valueToMatch : fieldSelector(items[0]);

  return items.every(
    (item: T): boolean => fieldSelector(item) === referenceValue,
  );
}

/**
 * Checks if the values of a specific field in a list of items are unique.
 *
 * @param {T[]} items - An array of items of type `T` to check.
 * @param {(item: T) => FieldType | undefined} fieldSelector - A function that selects the field value of each item of type `T`.
 * The function returns the value of type `FieldType` or `undefined` if the field is not found.
 *
 * @returns {boolean} `true` if all the selected field values are unique or if the items array is empty,
 * otherwise `false` if there are duplicates.
 *
 * @example
 * interface Person {
 *   name: string;
 *   age: number;
 * }
 *
 * const people: Person[] = [
 *   { name: 'Alice', age: 25 },
 *   { name: 'Bob', age: 30 },
 *   { name: 'Charlie', age: 30 },
 * ];
 *
 * // Using isFieldValuesUnique to check if all ages are unique
 * const areAgesUnique = isFieldValuesUnique(people, (person) => person.age);
 * console.log(areAgesUnique); // Output: false
 */
export function areFieldValuesUnique<T, FieldType>(
  items: T[],
  fieldSelector: (item: T) => FieldType | undefined,
): boolean {
  if (!items || items.length <= 1) {
    return true;
  }

  const fieldValues: FieldType[] = items.map(fieldSelector);
  const uniqueFieldValues = new Set<FieldType>(fieldValues);

  return fieldValues.length === uniqueFieldValues.size;
}
