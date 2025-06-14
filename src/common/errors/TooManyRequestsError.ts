import { HttpStatus } from '@nestjs/common';
import { CodeMinor } from '../types/errorTypes';
import { ApplicationAPIException } from './ApplicationAPIException';

/**
 * This error is thrown when the server is busy.
 */
export class ServerBusyException extends ApplicationAPIException {
  constructor(description: string = 'Server is busy. Please try again later') {
    super(CodeMinor.ServerBusy, description, HttpStatus.TOO_MANY_REQUESTS);
  }
}
