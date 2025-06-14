import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { API_MESSAGES, ERROR_MESSAGES } from '../constants/constants';

// Generic response type definitions (for TypeScript typing only)
export type GetAllResponse<T> = T[];
export type GetSingleResponse<T> = T;
export type CreateResponse = void; // 201 with no content
export type UpdateResponse = void; // 204 with no content
export type DeleteResponse = void; // 204 with no content

/**
 * Generic API response decorator for Ed-Fi endpoints
 * @param options - Configuration for the API response
 */
export function EdFiApiResponse(options: {
  status: number;
  description: string;
  type?: Type<any>;
  isArray?: boolean;
}) {
  const { status, description, type, isArray = false } = options;

  // For 204 No Content responses, don't include schema
  if (status === HttpStatus.NO_CONTENT) {
    return applyDecorators(
      ApiResponse({
        status,
        description,
      })
    );
  }

  // For responses with data - use the type directly instead of $ref
  if (type) {
    return applyDecorators(
      ApiResponse({
        status,
        description,
        type: isArray ? [type] : type,
      })
    );
  }

  // For responses without specific type
  return applyDecorators(
    ApiResponse({
      status,
      description,
    })
  );
}

/**
 * Decorator for GET all resources (returns array)
 */
export const ApiGetAllResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Resources retrieved successfully',
      type: [model], // Auto-discovery: Swagger automatically registers this
    })
  );
};

/**
 * Decorator for GET single resource
 */
export const ApiGetSingleResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Resource retrieved successfully',  
      type: model, // Auto-discovery: Swagger automatically registers this
    })
  );
};

/**
 * Decorator for POST operations (Create)
 */
export const ApiCreateResponse = () => {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.CREATED,
      description: API_MESSAGES.CREATE_SUCCESS || 'Resource created successfully',
    })
  );
};

/**
 * Decorator for PUT operations (Update) - returns updated resource
 */
export const ApiUpdateResponse = () => {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: API_MESSAGES.UPDATE_SUCCESS || 'Resource updated successfully',
    })
  );
};

/**
 * Decorator for DELETE operations
 */
export const ApiDeleteResponse = () => {
  return applyDecorators(
    EdFiApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: API_MESSAGES.DELETE_SUCCESS || 'Resource deleted successfully',
    })
  );
};

/**
 * Common error responses for GET operations
 */
export function HttpGetResponses() {
  return applyDecorators(
    EdFiApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: ERROR_MESSAGES.INVALID_QUERY_PARAMS || 'Invalid query parameters',
    }),
    EdFiApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: ERROR_MESSAGES.UNAUTHORIZED_REQUEST || 'Unauthorized request',
    }),
    EdFiApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: ERROR_MESSAGES.FORBIDDEN_ACCESS || 'Forbidden access',
    }),
    EdFiApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: ERROR_MESSAGES.NOT_FOUND || 'Resource not found',
    }),
    EdFiApiResponse({
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      description: ERROR_MESSAGES.UNPROCESSABLE_ENTITY || 'Unprocessable entity',
    }),
    EdFiApiResponse({
      status: HttpStatus.TOO_MANY_REQUESTS,
      description: ERROR_MESSAGES.TOO_MANY_REQUESTS || 'Too many requests',
    }),
    EdFiApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: ERROR_MESSAGES.INTERNAL_SERVER_ERROR || 'Internal server error',
    }),
  );
}

/**
 * Common error responses for POST operations
 */
export function HttpPostResponses() {
  return applyDecorators(
    EdFiApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: ERROR_MESSAGES.BAD_REQUEST || 'Bad request',
    }),
    EdFiApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: ERROR_MESSAGES.UNAUTHORIZED_REQUEST || 'Unauthorized request',
    }),
    EdFiApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: ERROR_MESSAGES.FORBIDDEN_ACCESS || 'Forbidden access',
    }),
    EdFiApiResponse({
      status: HttpStatus.CONFLICT,
      description: ERROR_MESSAGES.CONFLICT || 'Resource already exists',
    }),
    EdFiApiResponse({
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      description: ERROR_MESSAGES.UNPROCESSABLE_ENTITY || 'Unprocessable entity',
    }),
    EdFiApiResponse({
      status: HttpStatus.TOO_MANY_REQUESTS,
      description: ERROR_MESSAGES.TOO_MANY_REQUESTS || 'Too many requests',
    }),
    EdFiApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: ERROR_MESSAGES.INTERNAL_SERVER_ERROR || 'Internal server error',
    }),
  );
}

/**
 * Common error responses for PUT operations
 */
export function HttpPutResponses() {
  return applyDecorators(
    EdFiApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: ERROR_MESSAGES.BAD_REQUEST || 'Bad request',
    }),
    EdFiApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: ERROR_MESSAGES.UNAUTHORIZED_REQUEST || 'Unauthorized request',
    }),
    EdFiApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: ERROR_MESSAGES.FORBIDDEN_ACCESS || 'Forbidden access',
    }),
    EdFiApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: ERROR_MESSAGES.NOT_FOUND || 'Resource not found',
    }),
    EdFiApiResponse({
      status: HttpStatus.CONFLICT,
      description: ERROR_MESSAGES.CONFLICT || 'Conflict with existing resource',
    }),
    EdFiApiResponse({
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      description: ERROR_MESSAGES.UNPROCESSABLE_ENTITY || 'Unprocessable entity',
    }),
    EdFiApiResponse({
      status: HttpStatus.TOO_MANY_REQUESTS,
      description: ERROR_MESSAGES.TOO_MANY_REQUESTS || 'Too many requests',
    }),
    EdFiApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: ERROR_MESSAGES.INTERNAL_SERVER_ERROR || 'Internal server error',
    }),
  );
}

/**
 * Common error responses for DELETE operations
 */
export function HttpDeleteResponses() {
  return applyDecorators(
    EdFiApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: ERROR_MESSAGES.BAD_REQUEST || 'Bad request',
    }),
    EdFiApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: ERROR_MESSAGES.UNAUTHORIZED_REQUEST || 'Unauthorized request',
    }),
    EdFiApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: ERROR_MESSAGES.FORBIDDEN_ACCESS || 'Forbidden access',
    }),
    EdFiApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: ERROR_MESSAGES.NOT_FOUND || 'Resource not found',
    }),
    EdFiApiResponse({
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      description: ERROR_MESSAGES.UNPROCESSABLE_ENTITY || 'Unprocessable entity',
    }),
    EdFiApiResponse({
      status: HttpStatus.TOO_MANY_REQUESTS,
      description: ERROR_MESSAGES.TOO_MANY_REQUESTS || 'Too many requests',
    }),
    EdFiApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: ERROR_MESSAGES.INTERNAL_SERVER_ERROR || 'Internal server error',
    }),
  );
}

/**
 * Combined standard error responses that can be used across all endpoints
 */
export const ApiStandardErrorResponses = () => {
  return applyDecorators(
    EdFiApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: ERROR_MESSAGES.BAD_REQUEST || 'Bad request',
    }),
    EdFiApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: ERROR_MESSAGES.UNAUTHORIZED_REQUEST || 'Unauthorized request',
    }),
    EdFiApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: ERROR_MESSAGES.FORBIDDEN_ACCESS || 'Forbidden access',
    }),
    EdFiApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: ERROR_MESSAGES.NOT_FOUND || 'Resource not found',
    }),
    EdFiApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: ERROR_MESSAGES.INTERNAL_SERVER_ERROR || 'Internal server error',
    }),
  );
};