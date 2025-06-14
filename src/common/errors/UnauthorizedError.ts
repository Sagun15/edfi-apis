import { HttpStatus } from '@nestjs/common';
import { CodeMinor } from '../types/errorTypes';
import { ApplicationAPIException } from './ApplicationAPIException';
import { ERROR_MESSAGES } from '../constants/constants';

/**
 * This error is thrown when the request is not authorized.
 */
export class UnauthorizedRequestException extends ApplicationAPIException {
  constructor(description: string = ERROR_MESSAGES.UNAUTHORIZED_REQUEST) {
    super(CodeMinor.UnauthorizedRequest, description, HttpStatus.UNAUTHORIZED);
  }
}
