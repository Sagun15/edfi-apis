import { HttpStatus } from '@nestjs/common';
import { CodeMinor } from '../types/errorTypes';
import { ApplicationAPIException } from './ApplicationAPIException';

/**
 * Thrown when the requested resource cannot be identified within the service provider.
 *
 * This error is commonly used when trying to fetch a resource (e.g., students for a class)
 * that cannot be found in the system. It returns a `404 Not Found` status code.
 *
 * Example:
 * ```typescript
 * if (!findClassById(classId)) {
 *   throw new UnknownObjectError(`Class with ID ${classId} not found.`);
 * }
 * ```
 *
 * @param description The error description, defaults to 'Unknown Object'.
 * @throws {UnknownObjectError} If the resource cannot be found.
 */
export class UnknownObjectError extends ApplicationAPIException {
  constructor(description: string = 'Unknown Object') {
    super(CodeMinor.UnknownObject, description, HttpStatus.NOT_FOUND);
  }
}
