import { IEntityExamples } from '../interfaces/queryOptions.interface';
import { ISwaggerTag } from '../interfaces/swaggerTags.interface';
import { EntityType, SwaggerTagNames } from './enums';
import { USER_SORT_FIELDS, USER_VALID_FIELDS } from './fieldConstants';

export const DEFAULT_PAGE_SIZE = 100;
export const DEFAULT_PAGINATION_OFFSET = 0;
export const MAXIMUM_PAGE_SIZE = 100;

/**
 * Regular expression pattern for valid field names.
 * Allows only alphanumeric characters and underscores.
 */
export const VALID_FIELD_NAME_PATTERN = /^[a-zA-Z0-9_]+$/;

export enum ERROR_MESSAGES {
  INVALID_SOURCED_ID = 'Invalid sourcedId format. Must be a valid UUID',
  INVALID_QUERY_PARAMS = `An invalid selection field was supplied and data filtering on the selection criteria was not possible i.e. 'invalid_selection_field'.`,
  UNAUTHORIZED_REQUEST = `The request was not correctly authorized i.e. 'unauthorisedrequest'.`,
  FORBIDDEN_ACCESS = `This is used to indicate that the server can be reached and process the request but refuses to take any further action i.e. 'forbidden'.`,
  INTERNAL_SERVER_ERROR = `This code should be used only if there is catastrophic error and there is not a more appropriate code i.e. 'internal_server_error'.`,
  NOT_FOUND = `Either the supplied identifier is unknown in the Service Provider and so the object could not be changed or an invalid GUID has been supplied.`,
  BAD_REQUEST = 'An invalid selection field was supplied and data filtering on the selection criteria was not possible i.e. invalid_selection_field.',
  CONFLICT = 'The request cannot be completed due to a conflict with the current state of the resource (e.g., duplicate entries or version mismatches).',
  UNPROCESSABLE_ENTITY = 'This error condition may occur if a JSON request body contains well-formed (i.e. syntactically correct), but semantically erroneous, JSON instructions.',
  TOO_MANY_REQUESTS = 'The server is receiving too many requests i.e. server_busy. Retry at a later time.',
  DEFAULT = 'This is the default error response when no other approprate code is available.',
}

export enum API_MESSAGES {
  CREATE_SUCCESS = 'The resource was created. An ETag value is available in the ETag header, and the location of the resource is available in the Location header of the response.',
  UPDATE_SUCCESS = 'The resource was updated. An updated ETag value is available in the ETag header of the response.',
  DELETE_SUCCESS = 'The resource was successfully deleted.',
  FETCH_COLLECTION_SUCCESS = 'The requested resource was successfully retrieved.',
}

export const swaggerTags: ISwaggerTag[] = [
  {
    name: SwaggerTagNames.STUDENT,
    description: 'This entity represents an individual for whom instruction, services, and/or care are provided in an early childhood, elementary, or secondary educational program under the jurisdiction of a school, education agency or other institution or program. A student is a person who has been enrolled in a school or other educational institution.',
  },
  {
    name: SwaggerTagNames.GRADING_PERIOD,
    description: 'This entity represents a segment of the school year (e.g., semester, quarter, six-week period, summer term) in which courses are scheduled and student performance is evaluated.',
  },
];


