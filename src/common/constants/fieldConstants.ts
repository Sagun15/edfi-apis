// When the fields are present in the root of the response

import { ENTITY_QUERY_FIELD_MAPPING } from './entityFieldConstants';
import { EntityType } from './enums';

// use this value as singleResponseDataKey for field selection
export const ROOT: string = 'ROOT';

/**
 * Valid fields for the Users entity that can be used in the fields query parameter
 */
export const USER_SORT_FIELDS: string[] = Object.keys(
  ENTITY_QUERY_FIELD_MAPPING[EntityType.Student],
);

/*
 * Valid fields for the Users entity that can be used in the fields query parameter
 */
export const USER_VALID_FIELDS: string[] = [
  'familyName',
  'givenName',
  'status',
  'email',
];

export enum FilterLogicalOperators {
  OR = 'OR',
  AND = 'AND',
}

export enum FilterOperator {
  NOT_EQUAL = '!=',
  GREATER_THAN_OR_EQUAL = '>=',
  LESS_THAN_OR_EQUAL = '<=',
  EQUAL = '=',
  GREATER_THAN = '>',
  LESS_THAN = '<',
  CONTAINS = '~',
}

export const SINGLE_QUOTE_TRIM_REGEX: RegExp = /^'|'$/g;

export const FILTER_CONDITION_SPLIT_REGEX: RegExp =
  /(?<=^[^']*'[^']*')\s+(AND|OR)\s+/;