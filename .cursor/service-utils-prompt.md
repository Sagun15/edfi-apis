# Ed-Fi Business Logic Implementation Generator - Service & Utilities

You are an expert NestJS developer focused on creating Ed-Fi specification service layer implementations with comprehensive business logic, validation, and utility functions following established architectural patterns and best practices.

## 1. PREREQUISITES

**Required Previous Steps:**
- **Step 1**: Entities and DTOs created using entity-dto-prompt
- **Step 2**: Repository implementation completed using repository-implementation-prompt
- **Entity Location**: All entities are located in `src/common/entities/` directory
- **Descriptor Entities**: Located in `src/common/entities/descriptors/` directory
- **DTO Location**: Response DTOs in respective module's `dto/` directory, Request DTOs in `dto/request/` directory, Update DTOs in `dto/` directory
- **Repository Available**: {EntityName}Repository with all CRUD methods and foreign key resolution

**Auto-Discovery Process:**
- Service implementation will automatically discover validation requirements from entity constraints
- Foreign key validation will be identified from entity relationships
- DTO transformation utilities will be generated based on entity-DTO mapping needs

## 2. GENERAL INSTRUCTIONS

### Code Quality & Documentation
- Add comprehensive TSDoc documentation to all service methods and utilities
- Include parameter descriptions, return type descriptions, throws documentation, and examples
- Follow Single Responsibility Principle (SRP) - create helper methods when methods exceed 20-30 lines
- Create private helper methods within the same class for entity-specific transformations
- **Create utility functions in separate utility classes** in respective module's `utils/` directory for reusable transformations
- Use descriptive method and variable names

### Code Structure Standards
- Use dependency injection and proper decorator usage
- Implement proper error handling and logging with custom exceptions
- Follow the service layer pattern - ALL business logic resides here
- Services should handle business rules, validation, and orchestration
- Use TypeORM transactions for data consistency
- Implement proper validation using comprehensive constraint checking
- Use consistent naming conventions (PascalCase for classes, camelCase for methods/properties)

### Business Logic Standards
- **Comprehensive Validation**: All CREATE and UPDATE operations must validate primary keys, unique constraints, and foreign key references
- **Active Record Filtering**: Only return active records (Status.ACTIVE) for GET operations
- **Transaction Management**: Use TransactionService for CREATE and UPDATE operations requiring data consistency
- **ETag Support**: Implement concurrency control for UPDATE and DELETE operations, and set ETag headers for CREATE and UPDATE responses
- **Caching**: Implement caching for all GET operations

### Logging & Monitoring
- Add `@LogMethod()` decorator to ALL service methods
- Add manual logging statements following the pattern with descriptive messages
- Use CustomLogger with proper context setting in constructor
- Include step-by-step logging in service methods with descriptive messages

### Error Handling
- Use custom exceptions: `UnknownObjectError`, `BadRequestError`
- Request body validation handled by ValidationPipe with class-validator decorators in DTOs
- Business logic validation handled in service layer
- Include comprehensive error responses

### Caching
- Implement caching for all GET operations using:
  ```typescript
  @UseInterceptors(CacheInterceptor)
  @CacheKey('cache-key-name')
  @CacheTTL(3600)
  ```

### Transaction Handling
- Use `@Transactional()` decorator and `TransactionService` for CREATE and UPDATE operations
- Use transaction service for operations that require data consistency
- Implement ETag support for concurrency control
- Use `@IfMatch()` decorator for UPDATE and DELETE operations (required)
- Use `@IfNoneMatch()` decorator for CREATE operations (optional)

## 3. KNOWLEDGE BASE

### 3.1 Required Service Imports
```typescript
import { Injectable, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { TransactionService } from 'src/common/services/transaction.service';
import { Transactional } from 'src/common/decorators/transaction.decorator';
import { ETagService } from 'src/common/services/etag.service';
import { GenericResponse } from 'src/common/decorators/genericResponse.decorator';
import { IQueryOptions } from 'src/common/interfaces/queryOptions.interface';
import { CustomLogger } from 'src/common/utils/logger/logger.service';
import { LogMethod } from 'src/common/decorators/log-method.decorator';
import { UnknownObjectError } from 'src/common/errors/UnknownObjectError';
import { BadRequestError } from 'src/common/errors/BadRequestError';
import { FindOptionsWhere } from 'typeorm';
import { Status } from 'src/common/constants/enums';
```

### 3.2 Service Pattern
```typescript
/**
 * {EntityName} Service
 * 
 * Handles all business logic for {EntityName} entities including validation,
 * constraint checking, foreign key validation, and data orchestration.
 * This service follows the business logic layer pattern and contains
 * all business rules without any database interaction logic.
 */
@Injectable()
export class {EntityName}Service {
    private readonly logger: CustomLogger = new CustomLogger();

    constructor(
        private readonly {entityName}Repository: {EntityName}Repository,
        private readonly etagService: ETagService,
        private readonly transactionService: TransactionService,
    ) {
        this.logger.setContext('{EntityName}Service');
    }
}
```

## 4. REQUIRED SERVICE METHODS

### 4.1 getAll{EntityNamePlural} Method
**Purpose**: Retrieve paginated list with business logic and caching

```typescript
/**
 * Retrieves a paginated list of {entityNamePlural} based on query options
 * Only returns active records (not deleted or inactive)
 * 
 * @param queryOptionsFromRequest - Query parameters for filtering and pagination
 * @param httpResponse - HTTP response object for setting headers
 * @returns Promise<{EntityName}DTO[]> Array of {entityName} DTOs
 */
@LogMethod()
@UseInterceptors(CacheInterceptor)
@CacheKey('all-{entityNamePlural}')
@CacheTTL(3600)
async getAll{EntityNamePlural}(
    queryOptionsFromRequest: IQueryOptions,
    httpResponse: GenericResponse,
): Promise<{EntityName}DTO[]> {
    const cacheKey = `all-{entityNamePlural}`;
    this.logger.log('Starting process to retrieve all {entityNamePlural}', { cacheKey });

    // [Step-1]: Retrieve {entityNamePlural} from repository with active status filter
    const [{entityNamePlural}FromDatabase, total{EntityNamePlural}Count]: [{EntityName}[], number] = 
        await this.{entityName}Repository.findAllBy(queryOptionsFromRequest, { status: Status.ACTIVE });

    // [Step-2]: Handle empty result set
    if (!{entityNamePlural}FromDatabase || {entityNamePlural}FromDatabase.length === 0) {
        this.logger.log('No {entityNamePlural} found matching the criteria');
        return [];
    }

    // [Step-3]: Set total count header if requested
    if (queryOptionsFromRequest.totalCount) {
        httpResponse.setHeader('Total-Count', total{EntityNamePlural}Count.toString());
        this.logger.log(`Set Total-Count header: ${total{EntityNamePlural}Count}`);
    }

    // [Step-4]: Transform entities to DTOs using utility function
    const {entityName}DTOsForResponse: {EntityName}DTO[] = transform{EntityNamePlural}ToDTO({entityNamePlural}FromDatabase);

    this.logger.log(`Successfully retrieved ${${entityName}DTOsForResponse.length} {entityNamePlural}`);
    return {entityName}DTOsForResponse;
}
```

### 4.2 get{EntityName}ById Method
**Purpose**: Retrieve single entity with business logic and ETag handling

```typescript
/**
 * Retrieves a specific {entityName} by their identifier
 * Only returns active records (not deleted or inactive)
 * 
 * @param {entityName}IdFromRequest - {EntityName} identifier as string from request
 * @param httpResponse - HTTP response object for setting ETag headers
 * @returns Promise<{EntityName}DTO> Single {entityName} DTO
 * @throws BadRequestError if {entityName} ID is invalid
 * @throws UnknownObjectError if {entityName} is not found or not active
 */
@LogMethod()
@UseInterceptors(CacheInterceptor)
@CacheKey('{entityName}-by-id')
@CacheTTL(3600)
async get{EntityName}ById(
    {entityName}IdFromRequest: string,
    httpResponse: GenericResponse,
): Promise<{EntityName}DTO> {
    this.logger.log('Starting process to retrieve {entityName} by ID', { {entityName}Id: {entityName}IdFromRequest });

    // [Step-1]: Validate input parameters
    if (!{entityName}IdFromRequest?.trim()) {
        throw new BadRequestError('{EntityName} ID is required');
    }

    // [Step-2]: Retrieve {entityName} from repository with active status filter
    const {entityName}FromDatabase: {EntityName} | null = await this.{entityName}Repository.findById({entityName}IdFromRequest, Status.ACTIVE);

    // [Step-3]: Handle {entityName} not found or not active
    if (!{entityName}FromDatabase) {
        this.logger.warn(`{EntityName} with ID ${${entityName}IdFromRequest} not found or not active`);
        throw new UnknownObjectError(`{EntityName} with ID ${${entityName}IdFromRequest} not found`);
    }

    // [Step-4]: Transform to DTO and set ETag header
    const {entityName}DTOForResponse: {EntityName}DTO = new {EntityName}DTO({entityName}FromDatabase);
    httpResponse.setHeader('ETag', {entityName}DTOForResponse._etag);

    this.logger.log(`Successfully retrieved {entityName} with ID ${${entityName}IdFromRequest}`);
    return {entityName}DTOForResponse;
}
```

### 4.3 create{EntityName} Method
**Purpose**: Create entity with comprehensive validation and transaction management

```typescript
/**
 * Creates a new {entityName} resource
 * 
 * **IMPORTANT**: This method performs comprehensive validation:
 * - Checks if record exists by primary key/ID  
 * - Checks if record exists by all unique key constraints
 * - Checks if record exists by composite/natural key
 * - Validates all foreign key references using numeric descriptor IDs
 * - Throws BadRequestError if any constraint violation or invalid foreign key is found
 * 
 * @param create{EntityName}Request - Validated {entityName} data from request
 * @param httpResponse - HTTP response object for setting ETag headers
 * @param ifNoneMatchHeader - Optional ETag header (not used in validation)
 * @returns Promise<void> No return value for successful creation
 * @throws BadRequestError for constraint violations, validation errors, or invalid foreign keys
 */
@LogMethod()
@Transactional()
async create{EntityName}(
    create{EntityName}Request: Create{EntityName}DTO,
    httpResponse: GenericResponse,
    ifNoneMatchHeader: string,
): Promise<void> {
    return this.transactionService.executeInTransaction(async (queryRunner) => {
        this.logger.log('Starting process to create {entityName}');

        // [Step-1]: Check for existing record by PRIMARY KEY/ID
        await this.validatePrimaryKeyConstraints(create{EntityName}Request, queryRunner);

        // [Step-2]: Check for existing record by UNIQUE KEY constraints
        await this.validateUniqueKeyConstraints(create{EntityName}Request, queryRunner);

        // [Step-3]: Check for existing record by COMPOSITE KEY (if applicable)
        await this.validateCompositeKeyConstraints(create{EntityName}Request, queryRunner);

        // [Step-4]: Validate all foreign key references
        await this.validateForeignKeyReferences(create{EntityName}Request, queryRunner);

        // [Step-5]: Create {entityName} entity from validated request
        const {entityName}EntityToSave: {EntityName} = this.create{EntityName}EntityFromRequest(create{EntityName}Request);

        // [Step-6]: Save new {entityName} using transaction repository
        const repository = this.transactionService.getRepository({EntityName}, queryRunner);
        const saved{EntityName} = await repository.save({
            ...{entityName}EntityToSave,
            createdate: new Date(),
            lastmodifieddate: new Date()
        });

        // [Step-7]: Retrieve the saved {entityName} with relationships loaded for DTO creation using transaction
        const {entityName}WithRelationships = await repository.findOne({
            where: { id: saved{EntityName}.id },
            relations: {
                // **AUTO-DISCOVERED**: Load all foreign key relationships for DTO transformation
                // These relations will be automatically identified from entity decorators
            }
        });
        
        if (!{entityName}WithRelationships) {
            this.logger.error(`Failed to retrieve created {entityName} with ID ${saved{EntityName}.id}`);
            throw new UnknownObjectError(`Failed to retrieve created {entityName} with ID ${saved{EntityName}.id}`);
        }

        // [Step-8]: Resolve lazy-loaded relationships
        const resolved{EntityName} = await this.{entityName}Repository.resolve{EntityName}Relationships({entityName}WithRelationships);

        // [Step-9]: Set ETag header for the created {entityName}
        const created{EntityName}DTO: {EntityName}DTO = new {EntityName}DTO(resolved{EntityName});
        httpResponse.setHeader('ETag', created{EntityName}DTO._etag);

        this.logger.log('Successfully created {entityName}');
    });
}
```

### 4.4 update{EntityName} Method
**Purpose**: Update existing entity with comprehensive validation and transaction management

```typescript
/**
 * Updates an existing {entityName} resource
 * 
 * **IMPORTANT**: This method performs comprehensive validation:
 * - Validates the resource exists and is active
 * - Validates ETag for concurrency control
 * - Validates no other record exists with same composite/unique keys (excluding current record)
 * - Validates all foreign key references using numeric descriptor IDs
 * - Updates the resource with new data
 * 
 * @param {entityName}IdFromRequest - The {EntityName} identifier from URL parameter
 * @param update{EntityName}Request - Validated {entityName} data from request
 * @param ifMatchHeader - Required ETag header for concurrency control
 * @param httpResponse - HTTP response object for setting ETag headers
 * @returns Promise<void> No return value for successful update
 * @throws BadRequestError for validation errors or constraint violations
 * @throws UnknownObjectError if {entityName} is not found
 */
@LogMethod()
@Transactional()
async update{EntityName}(
    {entityName}IdFromRequest: string,
    update{EntityName}Request: Update{EntityName}DTO,
    ifMatchHeader: string,
    httpResponse: GenericResponse,
): Promise<void> {
    return this.transactionService.executeInTransaction(async (queryRunner) => {
        this.logger.log('Starting process to update {entityName}', { id: {entityName}IdFromRequest });

        // [Step-1]: Validate input parameters
        if (!{entityName}IdFromRequest?.trim()) {
            throw new BadRequestError('{EntityName} ID is required');
        }

        if (!ifMatchHeader?.trim()) {
            throw new BadRequestError('If-Match header is required for update operations');
        }

        // [Step-2]: Retrieve existing {entityName} for validation
        const existing{EntityName}FromDatabase: {EntityName} | null = 
            await this.{entityName}Repository.findById({entityName}IdFromRequest, Status.ACTIVE);

        if (!existing{EntityName}FromDatabase) {
            this.logger.warn(`{EntityName} with ID ${${entityName}IdFromRequest} not found or not active`);
            throw new UnknownObjectError(`{EntityName} with ID ${${entityName}IdFromRequest} not found`);
        }

        // [Step-3]: Validate ETag for concurrency control
        const existing{EntityName}DTO: {EntityName}DTO = new {EntityName}DTO(existing{EntityName}FromDatabase);
        this.etagService.validateIfMatch(ifMatchHeader, existing{EntityName}DTO._etag);

        // [Step-4]: Check for unique key conflicts (excluding current record)
        await this.validateUniqueKeyConstraintsForUpdate(update{EntityName}Request, {entityName}IdFromRequest, queryRunner);

        // [Step-5]: Check for composite key conflicts (excluding current record)
        await this.validateCompositeKeyConstraintsForUpdate(update{EntityName}Request, {entityName}IdFromRequest, queryRunner);

        // [Step-6]: Validate all foreign key references
        await this.validateForeignKeyReferences(update{EntityName}Request, queryRunner);

        // [Step-7]: Create updated {entityName} entity
        const updated{EntityName}Entity: {EntityName} = this.create{EntityName}EntityFromRequest(update{EntityName}Request);

        // [Step-8]: Update {entityName} using repository
        const updateResult = await this.{entityName}Repository.updateByWhere(
            { id: {entityName}IdFromRequest } as FindOptionsWhere<{EntityName}>,
            {
                ...updated{EntityName}Entity,
                lastmodifieddate: new Date()
            }
        );

        if (!updateResult.affected || updateResult.affected === 0) {
            this.logger.error(`Failed to update {entityName} with ID ${${entityName}IdFromRequest}`);
            throw new UnknownObjectError(`Failed to update {entityName} with ID ${${entityName}IdFromRequest}`);
        }

        // [Step-9]: Retrieve and return updated {entityName}
        const updated{EntityName}FromDatabase: {EntityName} | null = 
            await this.{entityName}Repository.findById({entityName}IdFromRequest, Status.ACTIVE);

        if (!updated{EntityName}FromDatabase) {
            this.logger.error(`Failed to retrieve updated {entityName} with ID ${${entityName}IdFromRequest}`);
            throw new UnknownObjectError(`Failed to retrieve updated {entityName} with ID ${${entityName}IdFromRequest}`);
        }

        // [Step-10]: Transform to DTO and set ETag header
        const updated{EntityName}DTO: {EntityName}DTO = new {EntityName}DTO(updated{EntityName}FromDatabase);
        httpResponse.setHeader('ETag', updated{EntityName}DTO._etag);

        this.logger.log(`Successfully updated {entityName} with ID ${${entityName}IdFromRequest}`);
    });
}
```

### 4.5 delete{EntityName} Method
**Purpose**: Delete entity with ETag validation and concurrency control

```typescript
/**
 * Deletes a {entityName} by their identifier (soft delete)
 * 
 * @param {entityName}IdFromRequest - {EntityName} identifier as string from request
 * @param ifMatchHeader - Required ETag header for concurrency control
 * @returns Promise<void> No return value for successful deletion
 * @throws BadRequestError if {entityName} ID is invalid or ETag is missing
 * @throws UnknownObjectError if {entityName} is not found
 */
@LogMethod()
async delete{EntityName}(
    {entityName}IdFromRequest: string,
    ifMatchHeader: string,
): Promise<void> {
    this.logger.log('Starting process to delete {entityName}');

    // [Step-1]: Validate input parameters
    if (!{entityName}IdFromRequest?.trim()) {
        throw new BadRequestError('{EntityName} ID is required');
    }

    if (!ifMatchHeader?.trim()) {
        throw new BadRequestError('If-Match header is required for delete operations');
    }

    // [Step-2]: Retrieve existing {entityName} for validation
    const existing{EntityName}FromDatabase: {EntityName} | null = 
        await this.{entityName}Repository.findById({entityName}IdFromRequest);

    // [Step-3]: Handle {entityName} not found
    if (!existing{EntityName}FromDatabase) {
        this.logger.warn(`{EntityName} with ID ${${entityName}IdFromRequest} not found for deletion`);
        throw new UnknownObjectError(`{EntityName} with ID ${${entityName}IdFromRequest} not found`);
    }

    // [Step-4]: Validate ETag for concurrency control
    const existing{EntityName}DTO: {EntityName}DTO = new {EntityName}DTO(existing{EntityName}FromDatabase);
    this.etagService.validateIfMatch(ifMatchHeader, existing{EntityName}DTO._etag);

    // [Step-5]: Perform soft deletion
    const updateResult = await this.{entityName}Repository.updateByWhere(
        { id: {entityName}IdFromRequest } as FindOptionsWhere<{EntityName}>,
        {
            status: Status.DELETED,
            deletedate: new Date(),
            lastmodifieddate: new Date()
        }
    );

    // [Step-6]: Handle deletion failure
    if (!updateResult.affected || updateResult.affected === 0) {
        this.logger.error(`Failed to delete {entityName} with ID ${${entityName}IdFromRequest}`);
        throw new UnknownObjectError(`Failed to delete {entityName} with ID ${${entityName}IdFromRequest}`);
    }

    this.logger.log(`Successfully soft deleted {entityName} with ID ${${entityName}IdFromRequest}`);
}
```

## 5. VALIDATION HELPER METHODS

### 5.1 Primary Key Validation
```typescript
/**
 * Validates primary key constraints for create operation
 * 
 * @param create{EntityName}Request - The request containing primary key
 * @param queryRunner - The transaction query runner
 * @throws BadRequestError if primary key already exists
 */
private async validatePrimaryKeyConstraints(
    create{EntityName}Request: Create{EntityName}DTO,
    queryRunner: any
): Promise<void> {
    if (create{EntityName}Request.{primaryKeyField}) {
        const existing{EntityName}ById = await this.{entityName}Repository.findById(create{EntityName}Request.{primaryKeyField});
        if (existing{EntityName}ById) {
            this.logger.warn(`{EntityName} with ID ${create{EntityName}Request.{primaryKeyField}} already exists`);
            throw new BadRequestError(`{EntityName} record already exists with {primaryKeyField}: ${create{EntityName}Request.{primaryKeyField}}`);
        }
    }
}
```

### 5.2 Unique Key Validation (Create)
```typescript
/**
 * Validates unique key constraints for create operation
 * **AUTO-DISCOVERED**: Unique constraints identified from entity structure
 * 
 * @param create{EntityName}Request - The request containing unique fields
 * @param queryRunner - The transaction query runner
 * @throws BadRequestError if unique constraint violation found
 */
private async validateUniqueKeyConstraints(
    create{EntityName}Request: Create{EntityName}DTO,
    queryRunner: any
): Promise<void> {
    // **AUTO-DISCOVERED**: Check each unique constraint field
    // Example for unique field 'uniqueField':
    /*
    if (create{EntityName}Request.uniqueField) {
        const existing{EntityName}ByUniqueField = await this.{entityName}Repository.findByUniqueField(create{EntityName}Request.uniqueField);
        if (existing{EntityName}ByUniqueField) {
            this.logger.warn(`{EntityName} with unique field ${create{EntityName}Request.uniqueField} already exists`);
            throw new BadRequestError(`{EntityName} record already exists with uniqueField: ${create{EntityName}Request.uniqueField}`);
        }
    }
    */
}
```

### 5.3 Unique Key Validation (Update)
```typescript
/**
 * Validates unique key constraints for update operation (excluding current record)
 * **AUTO-DISCOVERED**: Unique constraints identified from entity structure
 * 
 * @param update{EntityName}Request - The request containing unique fields
 * @param current{EntityName}Id - The ID of the record being updated (to exclude from check)
 * @param queryRunner - The transaction query runner
 * @throws BadRequestError if unique constraint violation found
 */
private async validateUniqueKeyConstraintsForUpdate(
    update{EntityName}Request: Update{EntityName}DTO,
    current{EntityName}Id: string,
    queryRunner: any
): Promise<void> {
    // **AUTO-DISCOVERED**: Check each unique constraint field (excluding current record)
    // Example for unique field 'uniqueField':
    /*
    if (update{EntityName}Request.uniqueField) {
        const existing{EntityName}ByUniqueField = await this.{entityName}Repository.findByUniqueField(update{EntityName}Request.uniqueField);
        if (existing{EntityName}ByUniqueField && existing{EntityName}ByUniqueField.id !== current{EntityName}Id) {
            this.logger.warn(`Another {EntityName} with unique field ${update{EntityName}Request.uniqueField} already exists`);
            throw new BadRequestError(`Another {EntityName} record already exists with uniqueField: ${update{EntityName}Request.uniqueField}`);
        }
    }
    */
}
```

### 5.4 Composite Key Validation (Create)
```typescript
/**
 * Validates composite key constraints for create operation
 * **AUTO-DISCOVERED**: Composite key fields identified from entity structure
 * 
 * @param create{EntityName}Request - The request containing composite key fields
 * @param queryRunner - The transaction query runner
 * @throws BadRequestError if composite key already exists
 */
private async validateCompositeKeyConstraints(
    create{EntityName}Request: Create{EntityName}DTO,
    queryRunner: any
): Promise<void> {
    // **AUTO-DISCOVERED**: Build composite key from entity natural key fields
    const compositeKeyWhere: FindOptionsWhere<{EntityName}> = {
        // Auto-discovered composite key fields
        // Example: field1: create{EntityName}Request.field1,
        //          field2: create{EntityName}Request.field2,
    };
    
    const existing{EntityName}ByCompositeKey = await this.{entityName}Repository.findByCompositeKey(compositeKeyWhere);
    if (existing{EntityName}ByCompositeKey) {
        this.logger.warn('{EntityName} already exists with the same composite key');
        throw new BadRequestError('{EntityName} already exists with the same field combination');
    }
}
```

### 5.5 Composite Key Validation (Update)
```typescript
/**
 * Validates composite key constraints for update operation (excluding current record)
 * **AUTO-DISCOVERED**: Composite key fields identified from entity structure
 * 
 * @param update{EntityName}Request - The request containing composite key fields
 * @param current{EntityName}Id - The ID of the record being updated (to exclude from check)
 * @param queryRunner - The transaction query runner
 * @throws BadRequestError if composite key already exists in another record
 */
private async validateCompositeKeyConstraintsForUpdate(
    update{EntityName}Request: Update{EntityName}DTO,
    current{EntityName}Id: string,
    queryRunner: any
): Promise<void> {
    // **AUTO-DISCOVERED**: Build composite key from entity natural key fields
    const compositeKeyWhere: FindOptionsWhere<{EntityName}> = {
        // Auto-discovered composite key fields
        // Example: field1: update{EntityName}Request.field1,
        //          field2: update{EntityName}Request.field2,
    };
    
    const existing{EntityName}ByCompositeKey = await this.{entityName}Repository.findByCompositeKey(compositeKeyWhere);
    if (existing{EntityName}ByCompositeKey && existing{EntityName}ByCompositeKey.id !== current{EntityName}Id) {
        this.logger.warn('Another {EntityName} already exists with the same composite key');
        throw new BadRequestError('Another {EntityName} already exists with the same field combination');
    }
}
```

### 5.6 Foreign Key Validation (Shared)
```typescript
/**
 * Validates all foreign key references in the {entityName} request
 * **IMPORTANT**: Descriptors should be validated using their numeric IDs
 * **AUTO-DISCOVERED**: Foreign key relationships identified from entity decorators
 * **SHARED**: Used by both create and update operations
 * 
 * @param {entityName}Request - The request containing foreign key references (Create or Update DTO)
 * @param queryRunner - The transaction query runner
 * @throws BadRequestError if any foreign key reference is invalid
 */
private async validateForeignKeyReferences(
    {entityName}Request: Create{EntityName}DTO | Update{EntityName}DTO,
    queryRunner: any
): Promise<void> {
    // **AUTO-DISCOVERED**: Validate required foreign key descriptors using numeric IDs
    // Example pattern for descriptor validation:
    /*
    if ({entityName}Request.sexDescriptor) {
        const sexDescriptorRepo = this.transactionService.getRepository(SexDescriptor, queryRunner);
        const sexDescriptor = await sexDescriptorRepo.findOne({
            where: { sexDescriptorId: parseInt({entityName}Request.sexDescriptor) }
        });
        if (!sexDescriptor) {
            throw new BadRequestError(`Invalid sex descriptor: ${{entityName}Request.sexDescriptor}`);
        }
    }
    */

    // **AUTO-DISCOVERED**: Continue pattern for all other descriptor foreign key references
    // Always validate using the specific descriptor ID field (e.g., descriptorNameDescriptorId)
}
```

## 6. UTILITY FUNCTIONS

### 6.1 Entity Creation Helper (Shared)
```typescript
/**
 * Creates a {EntityName} entity from the validated request data
 * **SHARED**: Used by both create and update operations
 * 
 * @param {entityName}Request - The validated request data (Create or Update DTO)
 * @returns {EntityName} entity ready for database save
 */
private create{EntityName}EntityFromRequest({entityName}Request: Create{EntityName}DTO | Update{EntityName}DTO): {EntityName} {
    const {entityName}Entity = new {EntityName}();
    
    // **AUTO-DISCOVERED**: Map all fields from DTO to entity
    // Example:
    // {entityName}Entity.field1 = {entityName}Request.field1;
    // {entityName}Entity.field2 = {entityName}Request.field2;
    
    // Set status for active record
    {entityName}Entity.status = Status.ACTIVE;
    // Note: createdate and lastmodifieddate are set by the calling methods
    
    return {entityName}Entity;
}
```

## 7. UTILITY CLASS PATTERN
**Location**: `src/modules/{entityNamePlural}/utils/{entityNamePlural}.util.ts`

```typescript
import { {EntityName} } from 'src/common/entities/{EntityName}';
import { {EntityName}DTO } from '../dto/{entityName}.dto';

/**
 * Utility class for {EntityName} DTO transformations
 * Contains reusable transformation functions for {EntityName} entities
 */
export class {EntityName}Util {
    /**
     * Transforms an array of {EntityName} entities to {EntityName}DTO array
     * 
     * @param {entityNamePlural} - Array of {EntityName} entities
     * @returns {EntityName}DTO[] Array of transformed DTOs
     */
    static transform{EntityNamePlural}ToDTO({entityNamePlural}: {EntityName}[]): {EntityName}DTO[] {
        return {entityNamePlural}.map({entityName} => new {EntityName}DTO({entityName}));
    }

    /**
     * Transforms a single {EntityName} entity to {EntityName}DTO
     * 
     * @param {entityName} - {EntityName} entity
     * @returns {EntityName}DTO Transformed DTO
     */
    static transform{EntityName}ToDTO({entityName}: {EntityName}): {EntityName}DTO {
        return new {EntityName}DTO({entityName});
    }

    /**
     * Validates {EntityName} business rules
     * 
     * @param {entityName}Data - {EntityName} data to validate
     * @returns boolean True if valid, throws BadRequestError if invalid
     */
    static validateBusinessRules({entityName}Data: any): boolean {
        // **AUTO-DISCOVERED**: Add entity-specific business rule validations
        return true;
    }
}

// Export transformation functions for service usage
export const transform{EntityNamePlural}ToDTO = {EntityName}Util.transform{EntityNamePlural}ToDTO;
export const transform{EntityName}ToDTO = {EntityName}Util.transform{EntityName}ToDTO;
export const validateBusinessRules = {EntityName}Util.validateBusinessRules;
```

## 8. INFORMATION PROCESSING

### Required Information from User:
1. **Entity Name**: The primary entity name for service implementation
2. **Primary Key Field**: Primary key field name and type
3. **Unique Constraint Fields**: All unique fields that need validation

### Automatically Discovered by Cursor:
4. **Foreign Key Relationships**: Auto-discovered from entity decorators for validation logic
5. **Descriptor Dependencies**: Identified from entity relationships for foreign key validation
6. **Composite Key Fields**: Natural key fields identified from entity structure
7. **DTO Mapping Requirements**: Field mappings identified from entity and DTO comparison
8. **Business Rule Requirements**: Validation rules identified from entity constraints

### Service Auto-Discovery Process:
- Parse entity constraints to generate validation logic
- Identify all foreign key relationships requiring validation
- Generate appropriate constraint checking methods
- Create DTO transformation utilities based on entity-DTO mapping
- Determine caching strategies based on entity access patterns

## 9. DELIVERABLES

For each service implementation request, provide:

### 9.1 Complete Service Class
- ✅ All CRUD operation methods with comprehensive business logic
- ✅ Comprehensive validation for CREATE and UPDATE operations (primary key, unique key, composite key, foreign key)
- ✅ Transaction handling and ETag validation
- ✅ Caching implementation for GET operations
- ✅ Error handling with custom exceptions
- ✅ ETag header setting for CREATE and UPDATE responses

### 9.2 Validation Helper Methods
- ✅ Primary key constraint validation
- ✅ Unique key constraint validation for create and update (auto-discovered)
- ✅ Composite key constraint validation for create and update (auto-discovered)
- ✅ Foreign key reference validation using numeric descriptor IDs (auto-discovered, shared)
- ✅ Update-specific validation methods that exclude current record from constraint checks

### 9.3 Utility Functions
- ✅ Entity creation helper from DTO (shared by create and update)
- ✅ DTO transformation utility class in separate file
- ✅ Business rule validation utilities

### 9.4 Service Configuration
- ✅ Proper dependency injection setup
- ✅ Transaction service integration
- ✅ ETag service integration
- ✅ Caching configuration

## 10. IMPORTANT NOTES

- **Comprehensive Validation**: All CREATE and UPDATE operations validate primary keys, unique constraints, composite keys, and foreign key references using numeric descriptor IDs
- **Active Records Only**: GET operations only return Status.ACTIVE records
- **Transaction Management**: Use TransactionService for data consistency in CREATE and UPDATE operations
- **Utility Function Placement**: DTO transformation utilities in separate `utils/` directory
- **Auto-Discovery**: Validation logic automatically generated from entity constraints and relationships
- **Error Handling**: Business logic errors use custom exceptions (BadRequestError, UnknownObjectError)
- **Caching Strategy**: All GET operations include caching with appropriate TTL
- **Concurrency Control**: UPDATE and DELETE operations require ETag validation
- **ETag Response Headers**: Both CREATE and UPDATE operations set ETag headers in response
- **Soft Delete Operations**: All delete operations use status updates, never hard delete
- **Create vs Update**: CREATE validates no existing records, UPDATE validates no conflicts excluding current record
- **Shared Validation Logic**: Foreign key validation and entity creation helpers are shared between create and update

---