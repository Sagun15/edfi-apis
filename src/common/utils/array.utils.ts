import { UUID } from 'crypto';

/**
 * Extracts distinct `UUID` values from a list of items based on a specified field selector.
 *
 * @param {T[]} items - An array of items of type `T` from which the distinct `UUID` values are extracted.
 * @param {(item: T) => UUID | undefined} fieldSelector - A function that extracts the `UUID` value from each item. It is expected to return a `UUID` or `undefined` if the field is not present.
 *
 * @returns {UUID[]} An array of unique `UUID` values extracted from the items. Duplicates are removed, and only distinct values are returned.
 *
 * @example
 * interface LineItem {
 *   class: { sourcedId: UUID };
 *   // other fields...
 * }
 *
 * const lineItems: LineItem[] = [
 *   { class: { sourcedId: '87252749-3a96-424c-9a6a-9014e419627d' } },
 *   { class: { sourcedId: '2f3c4ba6-e3b6-4c85-996c-2a65cb433827' } },
 *   { class: { sourcedId: '87252749-3a96-424c-9a6a-9014e419627d' } },
 * ];
 *
 * // Using getDistinctIds to get distinct sourcedIds
 * const distinctClassIds = getDistinctIds(lineItems, (lineItem) => lineItem.class.sourcedId);
 * console.log(distinctClassIds); // Output: ['87252749-3a96-424c-9a6a-9014e419627d', '2f3c4ba6-e3b6-4c85-996c-2a65cb433827']
 */
export const getDistinctIds = <T>(
  items: T[],
  fieldSelector: (item: T) => UUID | undefined,
): UUID[] => Array.from(new Set(items.map(fieldSelector).filter(Boolean)));
