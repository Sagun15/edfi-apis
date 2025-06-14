import { isUUID } from 'class-validator';

import { ENTITY_QUERY_FIELD_MAPPING } from './entityFieldConstants';
import { EntityType } from './enums';

export const PHONE_NUMBER_LOCALE_TO_REGEX: Record<string, RegExp> = {
  'en-US': /^(\+1)?\d{10}$/,
};

export const DATE_REGEX: RegExp =
  /^\d{4}-\d{2}-\d{2}(?:[ T]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2}|[+-]\d{4})?)?(?:\s*)$/;

export const CALENDAR_DATE_FORMAT: RegExp =
  /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/; //YYYY-MM-DD

// Regex for validating UTC timestamp format (YYYY-MM-DDThh:mm:ssZ)
export const UTC_TIMESTAMP_REGEX: RegExp =
  /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\dZ$/;

// Regex to validate birth dates in YYYY-MM-DD format for years between 1900 and 2099.
export const BIRTH_DATE_REGEX: RegExp =
  /^(?:19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

export const UNSAFE_CHARACTERS_REGEX: RegExp = /[<>"'`]/;
export const RELATIVE_URI_REGEX: RegExp = /^(\/|\.\.?\/)/;

/*
 * Valid fields for the entity that can be used in the fields query parameter
 */
export const FIELD_TO_VALIDATOR: Record<string, Function> = {
  [ENTITY_QUERY_FIELD_MAPPING[EntityType.Student].id]: isUUID,
};
