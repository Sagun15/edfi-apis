# Ed-Fi Controller & Configuration Implementation Generator

You are an expert NestJS developer focused on creating Ed-Fi specification controller implementations with comprehensive HTTP endpoint handling, module configuration, and constants management following established architectural patterns and best practices.

## 1. PREREQUISITES

**Required Previous Steps:**
- **Step 1**: Entities and DTOs created using entity-dto-prompt
- **Step 2**: Repository implementation completed using repository-implementation-prompt  
- **Step 3**: Service and utilities implementation completed using business-logic-implementation-prompt
- **Available Components**: {EntityName}Service with all business logic, {EntityName}Repository with data access, utility functions for DTO transformations
- **Entity Location**: All entities in `src/common/entities/` directory
- **DTO Location**: Response DTOs in respective module's `dto/` directory, Request DTOs in `dto/request/` directory

**Integration Points:**
- Controller will integrate with completed service layer for all business logic
- Service layer handles all validation, transactions, and data orchestration
- Controller focuses solely on HTTP concerns (request/response handling)

## 2. GENERAL INSTRUCTIONS

### Code Quality & Documentation
- Add comprehensive TSDoc documentation to all controller methods
- Include parameter descriptions, return type descriptions, and examples
- Follow thin controller pattern - controllers only handle HTTP concerns
- All business logic delegated to service layer
- Use descriptive method and variable names
- Controllers should be lightweight and focused on HTTP request/response handling

### Code Structure Standards
- Use dependency injection and proper decorator usage
- Implement proper API documentation using Swagger decorators
- Follow consistent naming conventions (PascalCase for classes, camelCase for methods/properties)
- Controllers should follow RESTful API patterns
- Use proper HTTP status codes and response formats
- Implement comprehensive error handling with proper HTTP responses

### Authentication & Authorization
- All controllers require `@UseGuards(RoleGuard)` decorator at class level
- Import `JwtAuthGuard` and `JwtUtil` as providers in every module
- Include proper API response documentation for authentication/authorization errors

### Logging & Monitoring
- Add `@LogMethod()` decorator to ALL controller methods
- Add manual logging statements with descriptive messages
- Use CustomLogger with proper context setting in constructor
- Include request processing logging with step-by-step flow

### API Documentation Standards
- Comprehensive Swagger documentation for all endpoints
- Include operation IDs following Ed-Fi patterns
- Detailed parameter and response documentation
- Proper HTTP status code documentation
- Include authentication and authorization documentation

## 3. KNOWLEDGE BASE

### 3.1 Required Controller Imports
```typescript
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiBody,
    ApiHeader,
} from '@nestjs/swagger';
import { GenericResponse } from 'src/common/decorators/genericResponse.decorator';
import { LogMethod } from 'src/common/decorators/log-method.decorator';
import { CustomLogger } from 'src/common/utils/logger/logger.service';
import {
    ApiCreateResponse,
    ApiUpdateResponse,
    ApiDeleteResponse,
    ApiGetAllResponse,
    ApiGetSingleResponse,
    CreateResponse,
    UpdateResponse,
    DeleteResponse,
    GetAllResponse,
    GetSingleResponse,
    HttpDeleteResponses,
    HttpGetResponses,
    HttpPostResponses,
    HttpPutResponses,
} from 'src/common/decorators/applicationAPIResponse.decorator';
import { RoleGuard } from 'src/core/guards/role.guard';
import { QueryOptionFiltersMap } from 'src/common/interfaces/queryOptions.interface';
import { getApiPath } from 'src/common/utils/api/api-utils';
import {
    ApiPrefixes,
    ApplicationEndpoints,
} from 'src/common/constants/apiPathConstants';
import { SwaggerTagNames } from 'src/common/constants/enums';
import { IfMatch, IfNoneMatch } from 'src/common/decorators/etag.decorator';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
```

### 3.2 Controller Pattern
```typescript
/**
 * {EntityName} Controller
 * 
 * Handles all HTTP requests for {EntityName} resources following Ed-Fi REST API specifications.
 * This controller follows the thin controller pattern and delegates all business logic
 * to the {EntityName}Service layer.
 */
const CONTROLLER_ROUTE: string = ApplicationEndpoints.{ENTITY_NAME_UPPER};

@ApiTags(SwaggerTagNames.{ENTITY_NAME_UPPER})
@Controller(
    getApiPath({
        apiPrefix: ApiPrefixes.EDFI,
        endpoint: CONTROLLER_ROUTE,
    }),
)
@UseGuards(RoleGuard)
export class {EntityName}Controller {
    private readonly logger: CustomLogger = new CustomLogger();

    constructor(private readonly {entityName}Service: {EntityName}Service) {
        this.logger.setContext('{EntityName}Controller');
    }
}
```

## 4. REQUIRED CONTROLLER METHODS

### 4.1 GET All Endpoint
**Purpose**: Retrieve paginated list of resources using "Get" pattern

```typescript
/**
 * Retrieves a paginated list of {entityName} resources
 * 
 * @param queryOptionsFromRequest - Query parameters for filtering and pagination
 * @param httpResponse - HTTP response object for setting headers
 * @returns Promise<{EntityName}DTO[]> Array of {entityName} DTOs
 */
@Get()
@ApiOperation({
    operationId: 'getAll{EntityNamePlural}',
    summary: 'Retrieves specific resources using the resource\'s property values (using the "Get" pattern).',
    description: `This GET operation provides access to resources using the "Get" 
        search pattern. The values of any properties of the resource that are specified 
        will be used to return all matching results (if it exists).`,
})
@ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Indicates how many items should be skipped before returning results.',
    example: 0,
})
@ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Indicates the maximum number of items that should be returned in the results.',
    example: 25,
})
@ApiQuery({
    name: 'totalCount',
    required: false,
    type: Boolean,
    description: 'Indicates if the total number of items available should be returned in the \'Total-Count\' header of the response.',
    example: false,
})
@ApiGetAllResponse({EntityName}DTO)
@HttpGetResponses()
@LogMethod()
async getAll{EntityNamePlural}(
    @Query() queryOptionsFromRequest: QueryOptionFiltersMap,
    @GenericResponse() httpResponse: GenericResponse,
): Promise<GetAllResponse<{EntityName}DTO>> {
    this.logger.log('Processing request to fetch all {entityNamePlural}');

    const {entityNamePlural}WithMetadata = await this.{entityName}Service.getAll{EntityNamePlural}(
        queryOptionsFromRequest,
        httpResponse
    );

    this.logger.log('Successfully processed request to fetch all {entityNamePlural}');
    return {entityNamePlural}WithMetadata;
}
```

### 4.2 GET by ID Endpoint
**Purpose**: Retrieve specific resource by identifier using "Get By Id" pattern

```typescript
/**
 * Retrieves a specific {entityName} resource by its primary identifier
 * 
 * @param {entityName}IdFromRequest - The {entityName} primary identifier from URL parameter
 * @param httpResponse - HTTP response object for setting ETag headers
 * @returns Promise<{EntityName}DTO> Single {entityName} DTO
 */
@Get(':id')
@ApiOperation({
    operationId: 'get{EntityName}ById',
    summary: 'Retrieves a specific resource using the resource\'s identifier (using the "Get By Id" pattern).',
    description: 'This GET operation retrieves a resource by the specified resource identifier.',
})
@ApiParam({
    name: 'id',
    type: 'string',
    description: 'A resource identifier that uniquely identifies the resource.',
    example: '100001',
})
@ApiGetSingleResponse({EntityName}DTO)
@HttpGetResponses()
@LogMethod()
async get{EntityName}ById(
    @Param('id') {entityName}IdFromRequest: string,
    @GenericResponse() httpResponse: GenericResponse,
): Promise<GetSingleResponse<{EntityName}DTO>> {
    this.logger.log('Processing request to fetch {entityName} by ID');

    const {entityName}WithETag = await this.{entityName}Service.get{EntityName}ById(
        {entityName}IdFromRequest,
        httpResponse
    );

    this.logger.log('Successfully processed request to fetch {entityName} by ID');
    return {entityName}WithETag;
}
```

### 4.3 POST Endpoint (Create Only)
**Purpose**: Create new resource (not upsert)

```typescript
/**
 * Creates a new {entityName} resource
 * 
 * @param create{EntityName}Request - {EntityName} data from request body
 * @param ifNoneMatchHeader - Optional ETag header for preventing duplicates
 * @param httpResponse - HTTP response object for setting ETag headers
 * @returns Promise<CreateResponse> No content response for successful creation
 */
@Post()
@HttpCode(HttpStatus.CREATED)
@ApiOperation({
    operationId: 'create{EntityName}',
    summary: 'Creates a new resource based on the supplied resource data.',
    description: `The POST operation creates a new resource. The web service will validate that the resource does not already exist based on the primary key and unique constraints. If the resource already exists, a BadRequest error will be returned.`,
})
@ApiHeader({
    name: 'If-None-Match',
    description: 'The previously returned ETag header value, used here to prevent the creation of duplicate resources.',
    required: false,
    example: '"2025-05-29T07:53:44.000Z"',
})
@ApiBody({
    type: Create{EntityName}DTO,
    description: 'The JSON representation of the "{entityName}" resource to be created.',
})
@ApiCreateResponse()
@HttpPostResponses()
@LogMethod()
async create{EntityName}(
    @Body() create{EntityName}Request: Create{EntityName}DTO,
    @IfNoneMatch() ifNoneMatchHeader: string,
    @GenericResponse() httpResponse: GenericResponse,
): Promise<CreateResponse> {
    this.logger.log('Processing request to create {entityName}');

    await this.{entityName}Service.create{EntityName}(
        create{EntityName}Request,
        httpResponse,
        ifNoneMatchHeader,
    );

    this.logger.log('Successfully processed request to create {entityName}');
}
```

### 4.4 PUT Endpoint (Update Only)
**Purpose**: Update existing resource by identifier with concurrency control

```typescript
/**
 * Updates an existing {entityName} resource by its identifier
 * 
 * @param {entityName}IdFromRequest - The {entityName} primary identifier from URL parameter
 * @param update{EntityName}Request - {EntityName} data from request body
 * @param ifMatchHeader - Required ETag header for concurrency control
 * @param httpResponse - HTTP response object for setting ETag headers
 * @returns Promise<UpdateResponse> No content response for successful update
 */
@Put(':id')
@HttpCode(HttpStatus.NO_CONTENT)
@ApiOperation({
    operationId: 'update{EntityName}ById',
    summary: 'Updates an existing resource based on the resource identifier.',
    description: `The PUT operation is used to update an existing resource by identifier. The web service will validate that the resource exists and that no other resource conflicts with the updated data based on unique constraints.`,
})
@ApiParam({
    name: 'id',
    type: 'string',
    description: 'A resource identifier that uniquely identifies the resource.',
    example: '100001',
})
@ApiHeader({
    name: 'If-Match',
    description: 'The ETag header value used to prevent the update of a resource modified by another party.',
    required: true,
    example: '"2025-05-29T07:53:44.000Z"',
})
@ApiBody({
    type: Update{EntityName}DTO,
    description: 'The JSON representation of the "{entityName}" resource to be updated.',
})
@ApiUpdateResponse()
@HttpPutResponses()
@LogMethod()
async update{EntityName}ById(
    @Param('id') {entityName}IdFromRequest: string,
    @Body() update{EntityName}Request: Update{EntityName}DTO,
    @IfMatch() ifMatchHeader: string,
    @GenericResponse() httpResponse: GenericResponse,
): Promise<UpdateResponse> {
    this.logger.log('Processing request to update {entityName} by ID');

    await this.{entityName}Service.update{EntityName}(
        {entityName}IdFromRequest,
        update{EntityName}Request,
        ifMatchHeader,
        httpResponse
    );

    this.logger.log('Successfully processed request to update {entityName} by ID');
}
```

### 4.5 DELETE Endpoint
**Purpose**: Delete resource by identifier with concurrency control

```typescript
/**
 * Deletes a {entityName} resource by its identifier
 * 
 * @param {entityName}IdFromRequest - The {entityName} identifier from URL parameter
 * @param ifMatchHeader - Required ETag header for concurrency control
 * @returns Promise<DeleteResponse> No content response for successful deletion
 */
@Delete(':id')
@HttpCode(HttpStatus.NO_CONTENT)
@ApiOperation({
    operationId: 'delete{EntityName}ById',
    summary: 'Deletes an existing resource using the resource identifier.',
    description: 'The DELETE operation is used to delete an existing resource by identifier. If the resource doesn\'t exist, an error may result to indicate this condition.',
})
@ApiParam({
    name: 'id',
    type: 'string',
    description: 'A resource identifier that uniquely identifies the resource.',
    example: '100001',
})
@ApiHeader({
    name: 'If-Match',
    description: 'The ETag header value used to prevent the deletion of a resource modified by another party.',
    required: true,
    example: '"2025-05-29T07:53:44.000Z"',
})
@ApiDeleteResponse()
@HttpDeleteResponses()
@LogMethod()
async delete{EntityName}ById(
    @Param('id') {entityName}IdFromRequest: string,
    @IfMatch() ifMatchHeader: string,
): Promise<DeleteResponse> {
    this.logger.log('Processing request to delete {entityName} by ID');

    await this.{entityName}Service.delete{EntityName}({entityName}IdFromRequest, ifMatchHeader);

    this.logger.log('Successfully processed request to delete {entityName} by ID');
}
```

## 5. MODULE CONFIGURATION

### 5.1 Required Module Imports
```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { JwtUtil } from 'src/common/utils/jwt/jwt.utils';
import { CacheModule } from '@nestjs/cache-manager';
```

### 5.2 Module Pattern
```typescript
/**
 * {EntityNamePlural} Module
 * 
 * Configures all components for {EntityName} API endpoints including
 * controller, service, repository, and required dependencies.
 * **AUTO-DISCOVERED**: All foreign entities and descriptors automatically included in imports.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      {EntityName}, // Main entity
      // **AUTO-DISCOVERED**: All foreign entities that this module interacts with
      // ForeignEntity1, ForeignEntity2, DescriptorEntity1, DescriptorEntity2
      // These will be automatically identified from service foreign key validation requirements
    ]),
    CacheModule.register({
      ttl: 3600, // Cache duration in seconds
      max: 100, // Maximum number of items in cache
    }),
  ],
  controllers: [{EntityName}Controller],
  providers: [
    JwtAuthGuard,
    JwtUtil,
    {EntityName}Service,
    {EntityName}Repository
  ],
  exports: [{EntityName}Service, {EntityName}Repository],
})
export class {EntityNamePlural}Module {}
```

## 6. CONSTANTS CONFIGURATION

### 6.1 ApplicationEndpoints Update
**Location**: `src/common/constants/apiPathConstants.ts`

```typescript
// **IMPORTANT**: Add new endpoint to ApplicationEndpoints enum
export enum ApplicationEndpoints {
    // ... existing endpoints
    {ENTITY_NAME_UPPER} = '{entity-name-plural}', // **AUTO-GENERATED**: kebab-case plural form
}
```

### 6.2 SwaggerTagNames Update  
**Location**: `src/common/constants/enums.ts`

```typescript
// **IMPORTANT**: Add new tag to SwaggerTagNames enum
export enum SwaggerTagNames {
    // ... existing tags
    {ENTITY_NAME_UPPER} = '{EntityNamePlural}', // **AUTO-GENERATED**: PascalCase plural form
}
```

## 7. APP MODULE INTEGRATION

### 7.1 Integration Instructions
**Location**: `src/app.module.ts`

```typescript
// **INTEGRATION STEP**: Add to imports array in AppModule
import { {EntityNamePlural}Module } from './modules/{entityNamePlural}/{entityNamePlural}.module';

@Module({
  imports: [
    // ... existing module imports
    {EntityNamePlural}Module, // **ADD THIS LINE**
  ],
  // ... rest of module configuration
})
export class AppModule {}
```

## 8. DIRECTORY STRUCTURE

### 8.1 Complete Module Structure
```
src/modules/{entityNamePlural}/
├── controllers/
│   └── {entityNamePlural}.controller.ts          # **THIS PROMPT**
├── services/
│   └── {entityNamePlural}.service.ts             # **STEP 3 - COMPLETED**
├── repositories/
│   └── {entityNamePlural}.repository.ts          # **STEP 2 - COMPLETED**
├── dto/
│   ├── {entityName}.dto.ts                       # **STEP 1 - COMPLETED**
│   ├── create-{entityName}.dto.ts                # **STEP 1 - COMPLETED**
│   └── update-{entityName}.dto.ts                # **STEP 1 - COMPLETED**
├── utils/
│   └── {entityNamePlural}.util.ts                # **STEP 3 - COMPLETED**
└── {entityNamePlural}.module.ts                  # **THIS PROMPT**
```

## 9. INFORMATION PROCESSING

### Required Information from User:
1. **Entity Name**: The primary entity name for controller and module implementation
2. **API Methods**: Which HTTP methods to implement (GET, GET_ALL, POST, PUT, DELETE)

### Automatically Discovered by Cursor:
3. **Primary Key Field**: Auto-discovered from entity structure for API parameter examples
4. **Foreign Entity Dependencies**: Auto-discovered from service foreign key validation requirements for module imports
5. **DTO Types**: Auto-discovered from existing DTO files for proper type annotations
6. **Endpoint Path**: Auto-generated kebab-case plural form for REST endpoint
7. **Swagger Tags**: Auto-generated PascalCase plural form for API documentation

### Controller Auto-Discovery Process:
- Parse service layer to identify all required dependencies for module imports
- Generate appropriate endpoint paths following REST conventions
- Create comprehensive API documentation based on DTO structures
- Determine proper HTTP status codes and response types
- Generate module configuration with all required imports

## 10. DELIVERABLES

For each controller and configuration implementation request, provide:

### 10.1 Complete Controller Class
- ✅ All requested HTTP endpoint methods (GET, GET_ALL, POST, PUT, DELETE)
- ✅ Comprehensive Swagger API documentation with operation IDs
- ✅ Proper authentication guards and decorators
- ✅ Error handling and logging with @LogMethod decorator
- ✅ Thin controller pattern - all business logic delegated to service

### 10.2 Module Configuration
- ✅ Complete module setup with auto-discovered imports
- ✅ All foreign entities and descriptors included in TypeORM imports
- ✅ Provider configuration with authentication guards
- ✅ Cache module configuration
- ✅ Service and repository integration

### 10.3 Constants Updates
- ✅ ApplicationEndpoints enum update with new endpoint
- ✅ SwaggerTagNames enum update with new tag
- ✅ Auto-generated naming following conventions

### 10.4 Integration Instructions
- ✅ App module integration steps
- ✅ Import statements and module registration
- ✅ Directory structure documentation

## 11. IMPORTANT NOTES

- **Thin Controller Pattern**: Controllers only handle HTTP concerns - no business logic
- **Service Integration**: All business logic delegated to completed service layer
- **Auto-Discovery**: Foreign entities automatically identified from service requirements
- **Authentication Required**: All controllers use RoleGuard for authentication
- **Comprehensive Documentation**: Full Swagger documentation for all endpoints
- **REST Conventions**: Follow Ed-Fi REST API patterns and conventions
- **Error Handling**: Proper HTTP status codes and error responses
- **Caching Support**: Cache module configuration for service layer caching
- **Module Exports**: Services and repositories exported for potential cross-module usage
- **Constants Management**: Centralized endpoint and tag configuration
- **Create vs Update**: POST creates only (no upsert), PUT updates only (no create)
- **ETag Support**: Both POST and PUT set ETag headers in response for concurrency control

---