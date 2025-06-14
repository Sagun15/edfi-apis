# Ed-Fi Repository Implementation Generator

You are an expert NestJS developer focused on creating Ed-Fi specification repository implementations. Generate repository classes with proper database operations, foreign key resolution, and lazy loading support following established architectural patterns and best practices.

## 1. PREREQUISITES

**Required Previous Steps:**
- **Step 1**: Entities and DTOs have been created using the entity-dto-prompt
- **Entity Location**: All entities are located in `src/common/entities/` directory
- **Descriptor Entities**: Located in `src/common/entities/descriptors/` directory
- **DTO Location**: Response DTOs are in respective module's `dto/` directory, Request DTOs in `dto/request/` directory
- **Entity Relationships**: All foreign key relationships use lazy loading without `Promise<>` wrapper

**Auto-Discovery Process:**
- Repository implementation will automatically discover foreign key relationships by parsing `@ManyToOne`, `@OneToMany`, `@JoinColumn` decorators from entity files
- Foreign entities and descriptors will be identified from entity relationships
- User only needs to provide primary key and unique constraint information

## 2. GENERAL INSTRUCTIONS

### Code Quality & Documentation
- Add comprehensive TSDoc documentation to all repository methods
- Include parameter descriptions, return type descriptions, throws documentation, and examples
- Follow Single Responsibility Principle (SRP) - repository layer contains ONLY database interaction logic
- Use descriptive method and variable names
- NO business logic or validation in repository layer - pure data access only

### Code Structure Standards
- Use dependency injection and proper decorator usage
- Follow consistent naming conventions (PascalCase for classes, camelCase for methods/properties)
- Repository layer should only contain database interaction logic
- Use TypeORM for database operations with lazy loading for foreign relationships
- Extend BaseRepository for common functionality

### Logging & Monitoring
- Add `@LogMethod()` decorator to ALL repository methods
- Add manual logging statements with descriptive messages
- Use CustomLogger with proper context setting in constructor
- Include step-by-step logging in methods with query details

### Database Operation Standards
- **Active Records Only**: Repository methods should support filtering by Status.ACTIVE when needed
- **Soft Delete Operations**: All delete operations use status update instead of hard delete
- **Foreign Key Resolution**: Properly resolve lazy-loaded relationships when needed for DTOs
- **Lazy Loading Support**: Handle lazy-loaded relationships correctly for DTO transformation

## 3. KNOWLEDGE BASE

### 3.1 Required Repository Imports
```typescript
import {
    FindOptionsWhere,
    Repository,
    DeepPartial,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { IQueryOptions } from 'src/common/interfaces/queryOptions.interface';
import { LogMethod } from 'src/common/decorators/log-method.decorator';
import BaseRepository from 'src/common/repositories/baseRepository.repository';
import { Status } from 'src/common/constants/enums';
```

### 3.2 Repository Pattern
```typescript
/**
 * {EntityName} Repository
 * 
 * Handles all database operations for {EntityName} entities.
 * This repository follows the data access layer pattern and only contains
 * database interaction logic without any business rules or validation.
 */
@Injectable()
export class {EntityName}Repository extends BaseRepository<{EntityName}> {
    constructor(
        @InjectRepository({EntityName})
        private readonly {entityName}Repository: Repository<{EntityName}>,
    ) {
        super({entityName}Repository);
        this.logger.setContext('{EntityName}Repository');
    }
}
```

## 4. REQUIRED REPOSITORY METHODS

### 4.1 findAllBy Method
**Purpose**: Retrieve paginated list of entities with foreign key resolution

```typescript
/**
 * Fetches an array of {EntityName} entities along with the total count, using the
 * provided IQueryOptions and FindOptionsWhere as filters.
 * **IMPORTANT**: This method properly handles lazy-loaded foreign relationships.
 *
 * @param queryOptions - The IQueryOptions object that contains the limit, offset parameters
 * @param whereConditions - The FindOptionsWhere object that contains the conditions for the where clause
 * @returns Promise<[{EntityName}[], number]> A tuple containing an array of {EntityName} entities 
 *                                           and the total count matching the criteria
 */
@LogMethod()
async findAllBy(
    queryOptions: IQueryOptions,
    whereConditions: FindOptionsWhere<{EntityName}>,
): Promise<[{EntityName}[], number]> {
    const { limit, offset } = queryOptions;

    this.logger.log('Executing findAndCount query for {entityNamePlural}', {
        limit,
        offset,
        whereConditions
    });

    // [Step-1]: Execute database query with pagination and filtering
    const [{entityNamePlural}FromDatabase, totalCountFromDatabase]: [{EntityName}[], number] = 
        await this.{entityName}Repository.findAndCount({
            where: whereConditions,
            relations: {
                // **AUTO-DISCOVERED**: Load all foreign key relationships for DTO transformation
                // These relations will be automatically identified from entity decorators
                // Example: foreignEntity1: true, descriptor1: true, etc.
            },
            skip: offset,
            take: limit,
            order: {
                {primaryKeyField}: 'ASC', // Use appropriate primary key field
            },
        });

    // [Step-2]: Resolve all lazy-loaded relationships using helper method
    const {entityNamePlural}WithResolvedPromises = await Promise.all(
        {entityNamePlural}FromDatabase.map(async ({entityName}) => 
            this.resolve{EntityName}Relationships({entityName})
        )
    );

    this.logger.log('Successfully executed findAndCount query', {
        found{EntityNamePlural}: {entityNamePlural}WithResolvedPromises.length,
        totalCount: totalCountFromDatabase
    });

    return [{entityNamePlural}WithResolvedPromises, totalCountFromDatabase];
}
```

### 4.2 findById Method
**Purpose**: Find entity by primary key with foreign key resolution and status filtering

```typescript
/**
 * Finds a single {EntityName} entity by their primary identifier
 * **IMPORTANT**: This method properly handles lazy-loaded foreign relationships.
 * 
 * @param idToFind - The {EntityName} identifier to search for
 * @param status - Optional status filter (ACTIVE, INACTIVE, DELETED)
 * @returns Promise<{EntityName} | null> The {EntityName} entity if found, null otherwise
 */
@LogMethod()
async findById(idToFind: any, status?: Status): Promise<{EntityName} | null> {
    this.logger.log('Executing findOne query by ID', { id: idToFind, status });

    // [Step-1]: Build where conditions
    const whereConditions: FindOptionsWhere<{EntityName}> = {
        {primaryKeyField}: idToFind
    };
    if (status) {
        whereConditions.status = status;
    }

    // [Step-2]: Execute database query
    const {entityName}FromDatabase: {EntityName} | null = await this.{entityName}Repository.findOne({
        where: whereConditions,
        relations: {
            // **AUTO-DISCOVERED**: Load all foreign key relationships for DTO transformation
            // These relations will be automatically identified from entity decorators
        }
    });

    if (!{entityName}FromDatabase) {
        this.logger.log('{EntityName} not found', { id: idToFind });
        return null;
    }

    // [Step-3]: Resolve lazy-loaded relationships using helper method
    const {entityName}WithResolvedPromises = await this.resolve{EntityName}Relationships({entityName}FromDatabase);
    this.logger.log('Successfully resolved relationships for {entityName}', { id: idToFind });

    return {entityName}WithResolvedPromises;
}
```

### 4.3 findBy{UniqueConstraint} Methods
**Purpose**: Find entities by unique constraint fields (e.g., findByStaffUniqueId, findByCredentialIdentifier)

```typescript
/**
 * Finds a single {EntityName} entity by their unique identifier
 * **IMPORTANT**: This method properly handles lazy-loaded foreign relationships.
 * 
 * @param uniqueIdentifier - The unique identifier to search for
 * @returns Promise<{EntityName} | null> The {EntityName} entity if found, null otherwise
 */
@LogMethod()
async findBy{UniqueField}({uniqueField}ToFind: string): Promise<{EntityName} | null> {
    this.logger.log('Executing findOne query by {uniqueField}', { {uniqueField}: {uniqueField}ToFind });

    const {entityName}FromDatabase: {EntityName} | null = await this.{entityName}Repository.findOne({
        where: { {uniqueField}: {uniqueField}ToFind } as FindOptionsWhere<{EntityName}>,
        relations: {
            // **AUTO-DISCOVERED**: Load all foreign key relationships for DTO transformation
        }
    });

    if (!{entityName}FromDatabase) {
        this.logger.log('{EntityName} not found by {uniqueField}', { {uniqueField}: {uniqueField}ToFind });
        return null;
    }

    // Resolve lazy-loaded relationships using helper method
    const {entityName}WithResolvedPromises = await this.resolve{EntityName}Relationships({entityName}FromDatabase);
    this.logger.log('Successfully found and resolved {entityName} by {uniqueField}', { {uniqueField}: {uniqueField}ToFind });

    return {entityName}WithResolvedPromises;
}

// Example method names for different entities:
// findByStaffUniqueId(staffUniqueId: string): Promise<Staff | null>
// findByCredentialIdentifier(credentialIdentifier: string): Promise<Credential | null>
// findByStudentUsi(studentUsi: number): Promise<Student | null>
```

### 4.4 findByCompositeKey Method
**Purpose**: Find entity by composite/natural key for constraint validation

```typescript
/**
 * Finds a single {EntityName} entity by composite/natural key
 * Used for constraint validation in create operations
 * 
 * @param compositeKey - Object containing the natural key fields
 * @returns Promise<{EntityName} | null> The {EntityName} entity if found, null otherwise
 */
@LogMethod()
async findByCompositeKey(compositeKey: FindOptionsWhere<{EntityName}>): Promise<{EntityName} | null> {
    this.logger.log('Executing findOne query by composite key', { compositeKey });

    const {entityName}FromDatabase: {EntityName} | null = await this.{entityName}Repository.findOne({
        where: compositeKey,
        relations: {
            // **AUTO-DISCOVERED**: Load relationships if needed for validation
        }
    });

    this.logger.log('Completed findOne query by composite key', {
        compositeKey,
        found: !!{entityName}FromDatabase
    });

    return {entityName}FromDatabase;
}
```

### 4.5 delete{EntityName} Method (Soft Delete)
**Purpose**: Soft delete entity by updating status and timestamps

```typescript
/**
 * Soft deletes a {EntityName} entity by updating status and timestamps
 * 
 * @param idToDelete - The {EntityName} identifier to delete
 * @returns Promise<boolean> True if deletion was successful, false if no rows were affected
 */
@LogMethod()
async delete{EntityName}(idToDelete: any): Promise<boolean> {
    this.logger.log('Executing soft delete operation for {entityName}', { id: idToDelete });

    // [Step-1]: Prepare soft delete data
    const updateData: DeepPartial<{EntityName}> = {
        status: Status.DELETED,
        deletedate: new Date(),
        lastmodifieddate: new Date()
    };

    // [Step-2]: Execute soft delete operation
    const updateResult = await this.{entityName}Repository.update(
        { {primaryKeyField}: idToDelete } as FindOptionsWhere<{EntityName}>,
        updateData
    );

    // [Step-3]: Determine if deletion was successful based on affected rows
    const deletionWasSuccessful: boolean = (updateResult.affected || 0) > 0;

    this.logger.log('Completed soft delete operation for {entityName}', {
        id: idToDelete,
        successful: deletionWasSuccessful,
        affectedRows: updateResult.affected
    });

    return deletionWasSuccessful;
}
```

## 5. FOREIGN KEY RESOLUTION HELPER

### 5.1 resolve{EntityName}Relationships Helper Method
**Purpose**: Resolve all lazy-loaded foreign key relationships for DTO transformation

```typescript
/**
 * Helper method to resolve all foreign key relationships for {EntityName}
 * **IMPORTANT**: This method awaits all lazy-loaded relationships to make them accessible in DTOs
 * **AUTO-DISCOVERED**: Foreign key relationships are automatically identified from entity decorators
 * 
 * @param {entityName} - The {EntityName} entity with lazy-loaded relationships
 * @returns Promise<{EntityName}> The {EntityName} entity with resolved relationships
 */
@LogMethod()
async resolve{EntityName}Relationships({entityName}: {EntityName}): Promise<{EntityName}> {
    const {entityName}WithResolvedPromises = {
        ...{entityName},
        // **AUTO-DISCOVERED**: Resolve all foreign key relationships
        // These relationships will be automatically identified from entity decorators
        // Examples:
        // foreignEntity1: {entityName}.foreignEntity1 ? await {entityName}.foreignEntity1 : null,
        // descriptor1: {entityName}.descriptor1 ? await {entityName}.descriptor1 : null,
    } as unknown as {EntityName};

    return {entityName}WithResolvedPromises;
}
```

## 6. INFORMATION PROCESSING

### Required Information from User:
1. **Entity Name**: The primary entity name for repository implementation
2. **Primary Key Field**: Primary key field name and type (e.g., id, studentUsi, credentialIdentifier)
3. **Unique Constraint Fields**: All unique fields that need findBy methods (e.g., staffUniqueId, credentialIdentifier)

### Automatically Discovered by Cursor:
4. **Foreign Key Relationships**: Automatically identified by parsing `@ManyToOne`, `@OneToMany`, `@JoinColumn` decorators from entity files in `src/common/entities/` directory
5. **Descriptor Relationships**: Automatically identified from entity relationships with descriptor entities in `src/common/entities/descriptors/`
6. **Composite Key Fields**: Natural key fields identified from entity structure
7. **Status Field Usage**: Automatically detected if entity extends Base class with status field

### Entity Auto-Discovery Process:
- Parse entity file decorators to identify all foreign key relationships
- Identify descriptor entities vs regular entities
- Determine which relationships need eager loading for DTO transformation
- Generate appropriate relations configuration for TypeORM queries
- Create comprehensive resolve{EntityName}Relationships method

## 7. DELIVERABLES

For each repository implementation request, provide:

### 7.1 Complete Repository Class
- ✅ Proper imports and class structure
- ✅ All required methods: findAllBy, findById, findBy{UniqueField}, findByCompositeKey, delete{EntityName}
- ✅ Auto-discovered foreign key relationships in relations configuration
- ✅ Comprehensive logging with @LogMethod decorator
- ✅ TSDoc documentation for all methods

### 7.2 Foreign Key Resolution
- ✅ resolve{EntityName}Relationships method with auto-discovered relationships
- ✅ Proper handling of lazy-loaded relationships for DTO transformation
- ✅ Relations configuration in TypeORM queries based on entity structure

### 7.3 Method Examples
- ✅ Specific examples of findBy{UniqueField} methods based on provided unique constraints
- ✅ Proper status parameter usage for active record filtering
- ✅ Composite key finder implementation based on entity structure
- ✅ Soft delete operation with status updates

## 8. IMPORTANT NOTES

- **Pure Data Access**: Repository contains ONLY database operations - no business logic or validation
- **Auto-Discovery**: Foreign key relationships automatically identified from entity decorators - no manual specification needed
- **Soft Delete Only**: Never use hard delete - always update status to DELETED
- **Active Record Support**: Support Status.ACTIVE filtering in findById and other methods
- **Comprehensive Logging**: Include both @LogMethod decorator and manual logging statements
- **Lazy Loading Handling**: Properly await lazy-loaded relationships for DTO transformation
- **Error Handling**: Basic database error handling only - business logic errors handled in service layer
- **Performance Considerations**: Efficient relations loading based on DTO transformation needs

---