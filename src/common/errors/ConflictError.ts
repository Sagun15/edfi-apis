import { HttpStatus } from '@nestjs/common';
import { ApplicationAPIException } from './ApplicationAPIException';
import { CodeMinor } from '../types/errorTypes';

/**
 * Represents a conflict error in the application.
 *
 * @extends ApplicationAPIException
 *
 * @description
 * This exception is thrown when a request cannot be completed due to a conflict with
 * the current state of the resource.
 *
 *
 * @param {string} description - A detailed message describing the conflict. Defaults to:
 * `'The request could not be completed due to a conflict with the current state of the resource.'`
 */
export class ConflictError extends ApplicationAPIException {
  constructor(
    description: string = 'The request could not be completed due to a conflict with the current state of the resource.',
  ) {
    super(CodeMinor.ConflictError, description, HttpStatus.CONFLICT);
  }
}
