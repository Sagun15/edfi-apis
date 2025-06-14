import {
  And,
  Equal,
  FindOperator,
  FindOptionsWhere,
  IsNull,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Or,
  Raw,
} from 'typeorm';
import { InvalidFilterFieldException } from '../errors/BadRequestError';
import { FIELD_TO_VALIDATOR } from '../constants/validatorConstants';
import {
  FILTER_CONDITION_SPLIT_REGEX,
  FilterLogicalOperators,
  FilterOperator,
  SINGLE_QUOTE_TRIM_REGEX,
} from '../constants/fieldConstants';
import { QueryOptionFiltersMap } from '../interfaces/queryOptions.interface';
import { EntityType } from '../constants/enums';
import { ENTITY_QUERY_FIELD_MAPPING } from '../constants/entityFieldConstants';

export class QueryParser {
  /**
   * Generates a filter condition based on the specified operator, value, and filter keys.
   *
   * @param {string} operator - The operator used for filtering (e.g., 'NOT_EQUAL', 'GREATER_THAN', etc.).
   * @param {string} value - The value to be used in the filter condition.
   * @param {string[]} filterKeys - An array of keys that represent the path to the filter condition.
   * @param {boolean} [valueIsOfTypeString=false] - (Optional) Indicates whether the value is a string. Defaults to false.
   * @param {number} [filterIndex=0] - (Optional) Index used to generate a unique parameter key for the filter.
   *
   * @returns {FindOperator<unknown>} - The generated filter condition based on the input parameters.
   *
   * @example
   * Example usage:
   *
   * const filterCondition = getFilterCondition('EQUAL', 'ACTIVE', ['status'], false);
   *
   * // Output:
   * // { status: Equal('ACTIVE') }
   */
  static getFilterCondition(
    operator: string,
    value: string,
    filterKeys: string[],
    valueIsOfTypeString?: boolean,
    filterIndex: number = 0,
  ): FindOperator<unknown> {
    const rawQueryValueParamKey: string =
      valueIsOfTypeString && `${filterKeys.join('_')}_${filterIndex}`;

    let filterCondition: FindOperator<unknown>;
    switch (operator) {
      case FilterOperator.NOT_EQUAL: {
        filterCondition =
          value === null
            ? Raw((alias) => `${alias} IS NOT NULL`)
            : valueIsOfTypeString
              ? Raw(
                  (alias) =>
                    `LOWER((${alias})::text) != LOWER(:${rawQueryValueParamKey}) OR ${alias} IS NULL`,
                  {
                    [rawQueryValueParamKey]: value,
                  },
                )
              : Or(Not(value), IsNull());
        break;
      }
      case FilterOperator.GREATER_THAN: {
        filterCondition = valueIsOfTypeString
          ? Raw(
              (alias) =>
                `LOWER((${alias})::text) > LOWER(:${rawQueryValueParamKey})`,
              {
                [rawQueryValueParamKey]: value,
              },
            )
          : MoreThan(value);
        break;
      }
      case FilterOperator.LESS_THAN: {
        filterCondition = valueIsOfTypeString
          ? Raw(
              (alias) =>
                `LOWER((${alias})::text) < LOWER(:${rawQueryValueParamKey})`,
              {
                [rawQueryValueParamKey]: value,
              },
            )
          : LessThan(value);
        break;
      }
      case FilterOperator.GREATER_THAN_OR_EQUAL: {
        filterCondition = valueIsOfTypeString
          ? Raw(
              (alias) =>
                `LOWER((${alias})::text) >= LOWER(:${rawQueryValueParamKey})`,
              {
                [rawQueryValueParamKey]: value,
              },
            )
          : MoreThanOrEqual(value);
        break;
      }
      case FilterOperator.LESS_THAN_OR_EQUAL: {
        filterCondition = valueIsOfTypeString
          ? Raw(
              (alias) =>
                `LOWER((${alias})::text) <= LOWER(:${rawQueryValueParamKey})`,
              {
                [rawQueryValueParamKey]: value,
              },
            )
          : LessThanOrEqual(value);
        break;
      }
      case FilterOperator.CONTAINS: {
        filterCondition = Raw(
          (alias) => `(${alias})::text ilike :${rawQueryValueParamKey}`,
          {
            [rawQueryValueParamKey]: `%${value}%`,
          },
        );
        break;
      }
      case FilterOperator.EQUAL: {
        filterCondition =
          value === null
            ? IsNull()
            : valueIsOfTypeString
              ? Raw(
                  (alias) =>
                    `LOWER((${alias})::text) = LOWER(:${rawQueryValueParamKey})`,
                  {
                    [rawQueryValueParamKey]: value,
                  },
                )
              : Equal(value);
      }
    }

    return filterCondition;
  }

  /**
   * Adds a filter condition to the given filter object based on the provided keys, operator, and value.
   *
   * @param {FindOptionsWhere<unknown>} filterConditions - The object representing the filter conditions where the filter will be added.
   * @param {string[]} filterKeys - An array of keys that represent the path to the filter condition.
   * @param {string} operator - The operator used for the filter condition (e.g., 'NOT_EQUAL', 'GREATER_THAN', etc.).
   * @param {string} value - The value to be used in the filter condition.
   * @param {boolean} [valueIsOfTypeString=false] - (Optional) A flag indicating whether the value is a string. Defaults to false.
   * @param {number} [filterIndex=0] - The optional index used to generate a unique parameter key for the filter.
   *
   * @returns {void} - This method does not return any value. It modifies the `filterConditions` object in place.
   *
   * @example
   * Example usage:
   *
   * Input:
   * filterConditions: {
   *                     status: Equal('ACTIVE')
   *                    }
   * filterKeys: [userProfiles, profileType]
   * operator: =
   * value: 'STUDENT'
   * valueIsOfTypeString: false
   *
   * addFilterCondition(filterConditions, filterKeys, operator, value, valueIsOfTypeString);
   *
   * Output:
   * filterConditions: {
   *                      status: Equal('ACTIVE'),
   *                      userProfiles: {
   *                            profileType: Equal('STUDENT')
   *                        }
   *                    }
   */
  static addFilterCondition(
    filterConditions: FindOptionsWhere<unknown>,
    filterKeys: string[],
    operator: string,
    value: string,
    valueIsOfTypeString?: boolean,
    filterIndex: number = 0,
  ): void {
    // Step 1: Traverse the object path except for the last key
    for (let index = 0; index < filterKeys.length - 1; index++) {
      if (!filterConditions[filterKeys[index]]) {
        filterConditions[filterKeys[index]] = {};
      }
      filterConditions = filterConditions[filterKeys[index]];
    }

    // Step 2: Check if the value is null, if yes then update the value to null
    if (value.toLowerCase() === 'null') {
      value = null;
    }

    // Step 3: Generate a filter condition based on the given operator, value, and filter keys.
    // If an existing filter condition exists for that key, the new filter condition is combined with the existing one using AND logic.
    const filterCondition: FindOperator<unknown> = this.getFilterCondition(
      operator,
      value,
      filterKeys,
      valueIsOfTypeString,
      filterIndex,
    );

    filterConditions[filterKeys[filterKeys.length - 1]] =
      combineFilterConditions(
        filterConditions[filterKeys[filterKeys.length - 1]],
        filterCondition,
      );
  }

  /**
   * Parses a single condition in the filter query and updates the provided filter condition object.
   *
   * This method performs the following steps:
   * 1. Identifies the filter operator (e.g., '=', '>', 'CONTAINS') in the condition string.
   * 2. Splits the condition string into the field and value based on the operator.
   * 3. Validates the field against a predefined mapping to ensure it's valid for the specified API type.
   * 4. Cleans up the value by trimming and removing surrounding quotes (if present).
   * 5. If the field has an associated validator, validates the value using the appropriate function.
   * 6. Checks if the filter operator is compatible with the field's data type.
   * 7. Updates the filter condition object with the parsed field, operator, and value.
   * 8. If a logical operator (e.g., AND/OR) is specified, handles adding conditions accordingly.
   *
   * @param {EntityType} apiType The type of entity being filtered (e.g., "user", "product").
   * @param {string} condition The condition string that includes the field, operator, and value (e.g., "firstName='John'").
   * @param {QueryOptionFiltersMap} filterConditions The filter condition object to be updated with the parsed result.
   * @param {Set<string>} unsupportedFilterFields - (Optional) A set of unsupported filter fields. If a field in the condition
   *                                              matches an entry in this set, an exception is thrown.
   * @param {FilterLogicalOperators | null} logicalOperator  (Optional) A logical operator (AND/OR) that can be applied to the condition.
   *
   * @throws {InvalidFilterFieldException} If no valid operator is found, or if the field or value is invalid.
   *
   * @example
   * Example usage:
   *
   * Input:
   * apiType: 'Users'
   * condition: "userProfiles.profileType='STUDENT'"
   * filterConditions: {Users:
   *                     [
   *                      {
   *                        status: Equal('ACTIVE')
   *                       }
   *                     ]};
   *
   *
   * parseSingleCondition(apiType, condition, filterConditions);
   *
   * Output:
   * filterConditions: {Users:
   *                     [
   *                      {
   *                       status: Equal('ACTIVE'),
   *                       userProfiles: {
   *                           profileType: Equal('STUDENT')
   *                         }
   *                       }
   *                     ]};
   */
  private static parseSingleCondition(
    apiType: EntityType,
    condition: string,
    filterConditions: QueryOptionFiltersMap,
    unsupportedFilterFields?: Set<string>,
    logicalOperator?: FilterLogicalOperators,
  ) {
    let operator: FilterOperator | null = null;
    let filterField: string = '';
    let filterValue: string = '';

    // Step 1: Identify the filter operator, filterField and filterValue
    for (const candidateOperator of Object.values(FilterOperator)) {
      if (condition.includes(candidateOperator)) {
        operator = candidateOperator;
        [filterField, filterValue] = condition.split(candidateOperator);
        break;
      }
    }

    // Step 2: Throw error if no operator is found
    if (!operator) {
      throw new InvalidFilterFieldException(
        'Invalid filter condition. No valid operator found.',
      );
    }

    // Step 3: Trim the filter field
    filterField = filterField.trim();

    // Step 4: Map the filter field to the entity column names
    const entityMappedField: string =
      ENTITY_QUERY_FIELD_MAPPING[apiType][filterField];

    // Step 5: Validate filter field against the mapping
    if (!entityMappedField || unsupportedFilterFields?.has(filterField)) {
      throw new InvalidFilterFieldException(
        `The provided filter field '${filterField}' is invalid or not supported.`,
      );
    }

    // Step 6: Clean up filter value (remove surrounding quotes)
    filterValue = filterValue.replace(SINGLE_QUOTE_TRIM_REGEX, '').trim();

    // Step 7: Validate filter value
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    const validateFilterValue: Function | null | undefined =
      operator !== FilterOperator.CONTAINS
        ? FIELD_TO_VALIDATOR[entityMappedField]
        : null;
    if (filterValue.toLowerCase() === 'null') {
      if (
        operator !== FilterOperator.EQUAL &&
        operator !== FilterOperator.NOT_EQUAL
      ) {
        throw new InvalidFilterFieldException(
          `Invalid filter: The value "null" can only be used with the operators "${FilterOperator.EQUAL}" or "${FilterOperator.NOT_EQUAL}".`,
        );
      }
    } else if (validateFilterValue) {
      if (!validateFilterValue(filterValue)) {
        throw new InvalidFilterFieldException(
          `The value "${filterValue}" is invalid for the filter "${filterField}".`,
        );
      }
    }

    // Step 8: Prepare filter keys.
    // The first key will be the entity name and the rest of the keys will used to construct the filter condition
    const filterKeys: string[] = entityMappedField.split('.');

    // Step 9: Ensure filterConditions is initialized for the field
    if (!filterConditions[filterKeys[0]]) {
      filterConditions[filterKeys[0]] = [];
    }

    // Step 10: Apply logical operator (OR/AND) if specified
    // If the logical operator is OR, add a new filter condition with the received condition for the given entity.
    // If the logical operator is AND or not specified, update all the filter conditions for the given entity.
    if (logicalOperator && logicalOperator === FilterLogicalOperators.OR) {
      filterConditions[filterKeys[0]].push({});
      this.addFilterCondition(
        filterConditions[filterKeys[0]][
          filterConditions[filterKeys[0]].length - 1
        ],
        filterKeys.slice(1),
        operator,
        filterValue,
        !validateFilterValue,
        filterConditions[filterKeys[0]].length - 1,
      );
    } else {
      if (filterConditions[filterKeys[0]].length === 0) {
        filterConditions[filterKeys[0]] = [{}];
      }
      for (
        let index = 0;
        index < filterConditions[filterKeys[0]].length;
        index++
      ) {
        this.addFilterCondition(
          filterConditions[filterKeys[0]][index],
          filterKeys.slice(1),
          operator,
          filterValue,
          !validateFilterValue,
        );
      }
    }
  }

  /**
   * Parses a filter string into a set of conditions based on the provided filter format.
   * The filter can contain logical operators like "AND" and "OR" to combine multiple conditions.
   * The method supports filtering by field, predicate, and value, as well as case-insensitive comparison.
   *
   * @param apiType - The type of the entity to apply the filter to (defines the valid fields for filtering).
   * @param filter - The filter string to parse. It must follow the format:
   *        `field<operator>'value'`, with optional logical operators like " AND " or " OR ".
   *        Example: `lastName='Smythe' AND dateLastModified>'2021-01-01'`
   * @param {Set<string>} unsupportedFilterFields - (Optional) A set of unsupported filter fields. If a field in the condition
   *                                              matches an entry in this set, an exception is thrown.
   *
   * @returns An array of filter conditions. Each condition is a record (object) where the key is the field
   *          being filtered, and the value is the condition based on the predicate and value.
   *          Multiple conditions are returned if "OR" or "AND" logical operators are used.
   *
   * @throws Error if the filter format is invalid or the filter contains unrecognized fields.
   */
  static parseFilter(
    apiType: EntityType,
    filter?: string,
    unsupportedFilterFields?: Set<string>,
  ): QueryOptionFiltersMap {
    // Step 1: Return an empty object if no filter is provided
    if (!filter) return {};

    // Step 2: Initialize the filterConditions object
    const filterConditions: QueryOptionFiltersMap = {};

    // Step 3: Split the filter string into individual conditions based on the logical operator
    const filterConditionSplitResult: string[] = filter.split(
      FILTER_CONDITION_SPLIT_REGEX,
    );

    if (filterConditionSplitResult.length === 3) {
      // If the filter split results in three parts:
      // - First condition
      // - Logical operator (AND/OR)
      // - Second condition
      this.parseSingleCondition(
        apiType,
        filterConditionSplitResult[0].trim(),
        filterConditions,
        unsupportedFilterFields,
        filterConditionSplitResult[1] as FilterLogicalOperators,
      );

      this.parseSingleCondition(
        apiType,
        filterConditionSplitResult[2].trim(),
        filterConditions,
        unsupportedFilterFields,
        filterConditionSplitResult[1] as FilterLogicalOperators,
      );
    } else if (filterConditionSplitResult.length === 1) {
      // If the filter split results in only one part:
      // - A single condition without a logical operator
      this.parseSingleCondition(
        apiType,
        filterConditionSplitResult[0].trim(),
        filterConditions,
        unsupportedFilterFields,
      );
    } else {
      throw new InvalidFilterFieldException(
        'The provided filter format is not supported.',
      );
    }

    return filterConditions;
  }
}

/**
 * Combines a new filter condition with an existing one using AND operator
 * @param existingFilterCondition - The existing filter condition (if any)
 * @param newFilterCondition - The new filter condition to add
 *
 * @returns Combined filter condition or just the new condition if no existing condition
 *
 * @example
 * Example 1: Basic usage with single condition
 * const filters = {};
 * const keys = ['price'];
 * updateLastFilterCondition(filters, keys, LessThan(100));
 * Result: filters = { price: LessThan(100) }
 *
 * Example 2: Combining multiple conditions for the same field
 * const filters = {
 *   price: MoreThan(50)
 * };
 * const keys = ['price'];
 * updateLastFilterCondition(filters, keys, LessThan(100));
 * Result: filters = { price: AND(MoreThan(50), LessThan(100)) }
 */
export function combineFilterConditions(
  existingFilterCondition: FindOperator<unknown> | undefined,
  newFilterCondition: FindOperator<unknown>,
): FindOperator<unknown> {
  return existingFilterCondition !== undefined
    ? And(existingFilterCondition, newFilterCondition)
    : newFilterCondition;
}
