import { HttpException, HttpStatus } from '@nestjs/common';
import {
  CodeMinor,
  ApplicationErrorResponse,
  CodeMajor,
  Severity,
} from '../types/errorTypes';

export abstract class ApplicationAPIException extends HttpException {
  protected constructor(
    codeMinor: CodeMinor,
    description: string,
    status: HttpStatus,
  ) {
    const response: ApplicationErrorResponse = {
      description: description,
    };

    super(response, status);
  }
}
