import { HttpStatus } from '@nestjs/common';
import { CodeMinor } from '../types/errorTypes';
import { ApplicationAPIException } from './ApplicationAPIException';
import { ERROR_MESSAGES } from '../constants/constants';

/**
 * This error is thrown when the server encounters an internal error.
 */
export class InternalServerErrorException extends ApplicationAPIException {
  constructor(description: string = ERROR_MESSAGES.INTERNAL_SERVER_ERROR) {
    super(
      CodeMinor.InternalServerError,
      description,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
