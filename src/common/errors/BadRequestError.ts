import { HttpStatus } from '@nestjs/common';
import { CodeMinor } from '../types/errorTypes';
import { ApplicationAPIException } from './ApplicationAPIException';
/**
 * This error is thrown when the selection field is invalid.
 */
export class InvalidSelectionFieldException extends ApplicationAPIException {
  constructor(description: string = 'Invalid selection field') {
    super(CodeMinor.InvalidSelectionField, description, HttpStatus.BAD_REQUEST);
  }
}
/**
 * This error is thrown when the filter field is invalid.
 */
export class InvalidFilterFieldException extends ApplicationAPIException {
  constructor(description: string = 'Invalid filter field') {
    super(CodeMinor.InvalidFilterField, description, HttpStatus.BAD_REQUEST);
  }
}

export class BadRequestError extends ApplicationAPIException {
  constructor(description: string = 'Invalid request') {
    super(CodeMinor.BadRequest, description, HttpStatus.BAD_REQUEST);
  }
}
