import { HttpStatus } from '@nestjs/common';
import { CodeMinor } from '../types/errorTypes';
import { ApplicationAPIException } from './ApplicationAPIException';
import { ERROR_MESSAGES } from '../constants/constants';

/**
 * Represents a semantic validation error in the API.
 *
 * @extends ApplicationAPIException
 *
 * @description
 * This exception is thrown when the request contains invalid or conflicting parameters .
 *
 *
 * @param {string} description - A detailed message describing the validation conflict. Defaults to:
 * `'The request could not be processed due to a semantic validation conflict.'`
 */
export class UnprocessableEntityException extends ApplicationAPIException {
  constructor(description: string = ERROR_MESSAGES.UNPROCESSABLE_ENTITY) {
    super(
      CodeMinor.UnprocessableEntity,
      description,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
