import { HttpStatus } from '@nestjs/common';
import { CodeMinor } from '../types/errorTypes';
import { ApplicationAPIException } from './ApplicationAPIException';
/**
 * This error is thrown when the request is forbidden.
 */
export class ForbiddenException extends ApplicationAPIException {
  constructor(description: string = 'Forbidden') {
    super(CodeMinor.Forbidden, description, HttpStatus.FORBIDDEN);
  }
}
