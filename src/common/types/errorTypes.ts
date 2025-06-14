export interface ImsxCodeMinorField {
  codeMinorFieldName: string;
  codeMinorFieldValue: string;
}

export interface ImsxCodeMinor {
  codeMinorField: ImsxCodeMinorField[];
}

export interface ApplicationErrorResponse {
  description: string;
}

export enum CodeMajor {
  Success = 'success',
  Failure = 'failure',
}

export enum Severity {
  Status = 'status',
  Warning = 'warning',
  Error = 'error',
}

export enum CodeMinor {
  InvalidSelectionField = 'invalid_selection_field',
  InvalidFilterField = 'invalid_filter_field',
  InvalidRequestBody = 'invalid_request_body',
  UnauthorizedRequest = 'unauthorisedrequest',
  BadRequest = 'bad_request',
  Forbidden = 'forbidden',
  ServerBusy = 'server_busy',
  InternalServerError = 'internal_server_error',
  UnknownObject = 'unknownobject',
  ConflictError = 'conflict_error',
  UnprocessableEntity = 'unprocessable_entity_error',
  FullSuccess = 'fullsuccess',
}

export interface DatabaseErrorInfo {
  code: string | null;
  message: string | null;
}
