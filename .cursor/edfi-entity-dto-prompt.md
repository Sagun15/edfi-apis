# Ed-Fi Entity & DTO Generator

You are an expert NestJS developer focused on creating Ed-Fi specification entities and DTOs. Generate TypeORM entities with proper relationships and corresponding request/response DTOs following established patterns.

## Entity Management Process

### **Step 1: Entity Analysis & Creation**
1. **Check Entity Registry**: Search `.cursor/entities-registry.md` for the main entity definition
2. **Identify Dependencies**: Find all direct foreign key relationships (1 level only) 
3. **Entity Existence Check**: Verify if main entity and its direct FK entities exist in codebase
4. **Create Missing Entities**: 
   - If main entity missing: Create main entity + all direct FK entities
   - If main entity exists but missing FK relationships: Create missing FK entities and update main entity
   - If entity not found in registry: Ask user for entity definition

### **Entity Creation Rules**
- Create entities with ALL provided database indexes from registry exactly as specified
- Include only direct foreign key relationships (don't create FK entities of FK entities)
- Use proper TypeORM decorators exactly as specified in registry CREATE statements
- Follow entity structure patterns: some extend Base entity, others use custom primary keys
- If not extending Base entity, include `createdAt` and `updatedAt` timestamp fields
- **Foreign Key Relationships**: All foreign table relationships must use lazy loading
- **Descriptor Tables**: Create descriptor entities in `src/common/entities/descriptors/` directory

## Entity Directory Structure

### **Main Entities**
```
src/common/entities/
  {entityName}.entity.ts
```

### **Descriptor Entities**
```
src/common/entities/descriptors/
  {descriptorName}.entity.ts
```

### **Entity Organization Rules**
- **Main Business Entities**: Place in `src/common/entities/` (e.g., Student, School, Course)
- **Descriptor Entities**: Place in `src/common/entities/descriptors/` (e.g., GradeLevelDescriptor, StateAbbreviationDescriptor)
- **Junction/Bridge Tables**: Place in `src/common/entities/` with main entities
- **Reference Tables**: Evaluate case-by-case - descriptors go to descriptors folder, others stay in main folder

## Entity Structure Standards

### **Base Entity Reference**
```typescript
// Some entities extend this, others use custom structure
export class Base extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({ 
    name: 'status',
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE
  })
  status: Status;

  @Column({ 
    name: 'createdate',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  createdate: Date;

  @Column({ 
    name: 'lastmodifieddate',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  lastmodifieddate: Date;

  @Column({ 
    name: 'deletedate',
    type: 'timestamp',
    nullable: true
  })
  deletedate: Date;
}
```

### **Entity Pattern (Custom Primary Key)**
```typescript
@Index('index_name', ['field1', 'field2'])
@Index('unique_index_name', ['uniqueField'], { unique: true })
@Entity('table_name')
export class EntityName {
    @PrimaryColumn({ name: 'primary_key_column', type: 'column_type' })
    primaryKeyField: PrimaryKeyType;

    @Column({ name: 'column_name', type: 'column_type', length: length, nullable: nullable })
    fieldName: string;

    // FOREIGN KEY RELATIONSHIPS - ALWAYS USE LAZY LOADING (NO Promise wrapper)
    @ManyToOne(() => ForeignEntity, { lazy: true })
    @JoinColumn({ name: 'foreign_key_column' })
    foreignEntity: ForeignEntity;

    // DESCRIPTOR RELATIONSHIPS - ALWAYS USE LAZY LOADING (NO Promise wrapper)
    @ManyToOne(() => SomeDescriptor, { lazy: true })
    @JoinColumn({ name: 'descriptor_column' })
    someDescriptor: SomeDescriptor;

    // If not extending Base entity, include timestamp fields
    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}
```

### **Foreign Key Relationship Patterns**

#### **Standard Foreign Key (Lazy Loading)**
```typescript
// Many-to-One relationship with lazy loading (NO Promise wrapper)
@ManyToOne(() => RelatedEntity, { lazy: true })
@JoinColumn({ name: 'related_entity_id' })
relatedEntity: RelatedEntity;

// Foreign key column (if needed for direct access)
@Column({ name: 'related_entity_id', type: 'int' })
relatedEntityId: number;
```

#### **Descriptor Relationship (Lazy Loading)**
```typescript
// Descriptor relationships - always lazy loaded (NO Promise wrapper)
@ManyToOne(() => GradeLevelDescriptor, { lazy: true })
@JoinColumn({ name: 'grade_level_descriptor_id' })
gradeLevelDescriptor: GradeLevelDescriptor;

@Column({ name: 'grade_level_descriptor_id', type: 'int' })
gradeLevelDescriptorId: number;
```

#### **One-to-Many Relationship (Lazy Loading)**
```typescript
// One-to-Many relationship with lazy loading (NO Promise wrapper)
@OneToMany(() => ChildEntity, childEntity => childEntity.parentEntity, { lazy: true })
childEntities: ChildEntity[];
```

#### **Many-to-Many Relationship (Lazy Loading)**
```typescript
// Many-to-Many relationship with lazy loading (NO Promise wrapper)
@ManyToMany(() => RelatedEntity, { lazy: true })
@JoinTable({
    name: 'junction_table_name',
    joinColumn: { name: 'current_entity_id' },
    inverseJoinColumn: { name: 'related_entity_id' }
})
relatedEntities: RelatedEntity[];
```

### **Descriptor Entity Pattern**
```typescript
// Located in src/common/entities/descriptors/
@Index('unique_descriptor_index', ['codeValue', 'namespace'], { unique: true })
@Entity('descriptor_table_name')
export class SomeDescriptor {
    @PrimaryColumn({ name: 'descriptor_id', type: 'int' })
    descriptorId: number;

    @Column({ name: 'code_value', type: 'varchar', length: 50 })
    codeValue: string;

    @Column({ name: 'short_description', type: 'varchar', length: 75 })
    shortDescription: string;

    @Column({ name: 'description', type: 'varchar', length: 1024, nullable: true })
    description?: string;

    @Column({ name: 'namespace', type: 'varchar', length: 255 })
    namespace: string;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}
```

## DTO Creation Standards

### **Response DTO Pattern**
```typescript
export class EntityNameDTO {
    @ApiProperty({ description: 'Primary identifier', example: 123456 })
    primaryKeyField: PrimaryKeyType;

    @ApiProperty({ description: 'Field description', example: 'Example value' })
    fieldName: string;

    @ApiProperty({ description: 'Optional field', example: 'Optional value', required: false })
    optionalField?: string;

    // Foreign key fields (include ID fields for reference)
    @ApiProperty({ description: 'Related entity identifier', example: 12345 })
    relatedEntityId: number;

    // Descriptor fields (include descriptor info)
    @ApiProperty({ description: 'Descriptor identifier', example: 678 })
    descriptorId: number;

    // ETag and timestamp fields (standard for all Ed-Fi DTOs)
    @ApiProperty({ description: 'ETag for concurrency control', example: '"2025-05-29T07:53:44.000Z"' })
    _etag: string;

    @ApiProperty({ description: 'Last modified date', example: '2025-05-29T07:53:44.000Z' })
    _lastModifiedDate: string;

    constructor(entityName: EntityName) {
        this.primaryKeyField = entityName.primaryKeyField;
        this.fieldName = entityName.fieldName;
        this.optionalField = entityName.optionalField;
        
        // Foreign key assignments
        this.relatedEntityId = entityName.relatedEntityId;
        this.descriptorId = entityName.descriptorId;
        
        // Generate Ed-Fi ETag and lastModifiedDate
        const lastModified = entityName.updatedAt || entityName.createdAt;
        this._etag = `"${lastModified.toISOString()}"`;
        this._lastModifiedDate = lastModified.toISOString();
    }
}
```

### **Complex Entity DTO with Nested DTO Classes**

#### **Separate Nested DTO Classes**
```typescript
// Link DTO for reference links
export class LinkDTO {
    @ApiProperty({ description: 'The type of the link', example: 'self' })
    rel: string;

    @ApiProperty({ description: 'The URL of the link' })
    href: string;
}

// Foreign Entity Reference DTO
export class RelatedEntityReferenceDTO {
    @ApiProperty({ description: 'The identifier for the related entity' })
    id: number;

    @ApiProperty({ description: 'The name of the related entity' })
    name: string;

    @ApiProperty({ description: 'The link to the related entity resource' })
    @ValidateNested()
    @Type(() => LinkDTO)
    link: LinkDTO;
}

// Descriptor Reference DTO
export class DescriptorReferenceDTO {
    @ApiProperty({ description: 'The descriptor identifier' })
    descriptorId: number;

    @ApiProperty({ description: 'The code value of the descriptor' })
    codeValue: string;

    @ApiProperty({ description: 'The short description of the descriptor' })
    shortDescription: string;

    @ApiProperty({ description: 'The namespace of the descriptor' })
    namespace: string;
}

// Related Item DTO for collections
export class RelatedItemDTO {
    @ApiProperty({ description: 'The item identifier' })
    id: number;

    @ApiProperty({ description: 'The item value' })
    value: string;

    @ApiProperty({ description: 'Additional item properties' })
    additionalProperty?: string;
}
```

#### **Main Complex Entity DTO Using Nested Classes**
```typescript
export class ComplexEntityDTO {
    @ApiProperty({ description: 'Primary identifier' })
    primaryKeyField: PrimaryKeyType;

    @ApiProperty({ description: 'Simple field' })
    simpleField: string;

    // Foreign entity reference using separate DTO class
    @ApiProperty({ description: 'Related entity reference' })
    @ValidateNested()
    @Type(() => RelatedEntityReferenceDTO)
    relatedEntityReference?: RelatedEntityReferenceDTO;

    // Descriptor reference using separate DTO class
    @ApiProperty({ description: 'Descriptor reference' })
    @ValidateNested()
    @Type(() => DescriptorReferenceDTO)
    descriptorReference?: DescriptorReferenceDTO;

    // Collection of related entities using separate DTO class
    @ApiProperty({ 
        description: 'Collection of related items',
        type: [RelatedItemDTO]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RelatedItemDTO)
    relatedItems: RelatedItemDTO[];

    @ApiProperty({ description: 'ETag for concurrency control' })
    _etag: string;

    @ApiProperty({ description: 'Last modified date' })
    _lastModifiedDate: string;

    constructor(entity: ComplexEntity) {
        this.primaryKeyField = entity.primaryKeyField;
        this.simpleField = entity.simpleField;
        
        // Handle foreign entity reference using separate DTO class
        if (entity.relatedEntity) {
            this.relatedEntityReference = new RelatedEntityReferenceDTO();
            this.relatedEntityReference.id = entity.relatedEntityId;
            this.relatedEntityReference.name = entity.relatedEntity.name;
            this.relatedEntityReference.link = {
                rel: 'self',
                href: `/api/edfi/relatedentities/${entity.relatedEntityId}`
            };
        }

        // Handle descriptor reference using separate DTO class
        if (entity.someDescriptor) {
            this.descriptorReference = new DescriptorReferenceDTO();
            this.descriptorReference.descriptorId = entity.descriptorId;
            this.descriptorReference.codeValue = entity.someDescriptor.codeValue;
            this.descriptorReference.shortDescription = entity.someDescriptor.shortDescription;
            this.descriptorReference.namespace = entity.someDescriptor.namespace;
        }

        // Handle collections using separate DTO class (populated by service layer)
        this.relatedItems = []; // Will be populated with RelatedItemDTO instances

        // Standard Ed-Fi fields
        const lastModified = entity.updatedAt || entity.createdAt;
        this._etag = `"${lastModified.toISOString()}"`;
        this._lastModifiedDate = lastModified.toISOString();
    }
}
```

## VALIDATION PATTERNS

### **Request DTO Validation**
All request DTOs should include comprehensive validation using class-validator decorators:

#### **Required Field Validation**
```typescript
@ApiProperty({ description: 'Field description', example: 'Example' })
@IsNotEmpty({ message: 'Field is required' })
@IsString({ message: 'Field must be a string' })
@MinLength(2, { message: 'Field must be at least 2 characters long' })
@MaxLength(75, { message: 'Field cannot exceed 75 characters' })
@Transform(({ value }: TransformFnParams) => value?.trim())
@Matches(/^[A-Za-z\s\-']+$/, { message: 'Field contains invalid characters' })
fieldName: string;
```

#### **Foreign Key Validation**
```typescript
@ApiProperty({ description: 'Related entity identifier', example: 12345 })
@IsNotEmpty({ message: 'Related entity ID is required' })
@IsNumber({}, { message: 'Related entity ID must be a number' })
@IsPositive({ message: 'Related entity ID must be a positive number' })
relatedEntityId: number;
```

#### **Descriptor Field Validation**
```typescript
@ApiProperty({ description: 'Descriptor identifier', example: 678 })
@IsNotEmpty({ message: 'Descriptor ID is required' })
@IsNumber({}, { message: 'Descriptor ID must be a number' })
@IsPositive({ message: 'Descriptor ID must be a positive number' })
descriptorId: number;
```

#### **Optional Field Validation**
```typescript
@ApiPropertyOptional({ description: 'Optional field', example: 'Optional' })
@IsOptional()
@IsString({ message: 'Field must be a string' })
@MaxLength(30, { message: 'Field cannot exceed 30 characters' })
@Transform(({ value }: TransformFnParams) => value?.trim())
optionalField?: string;
```

#### **Date Field Validation**
```typescript
@ApiProperty({ description: 'Date field', example: '2010-05-15' })
@IsNotEmpty({ message: 'Date is required' })
@IsISO8601({ strict: true }, { message: 'Date must be a valid ISO 8601 date' })
@Transform(({ value }: TransformFnParams) => {
    const date = new Date(value);
    const now = new Date();
    if (date > now) {
        throw new Error('Date cannot be in the future');
    }
    return value;
})
dateField: string;
```

#### **Number Field Validation**
```typescript
@ApiProperty({ description: 'Number field', example: 123 })
@IsNotEmpty({ message: 'Number field is required' })
@IsNumber({}, { message: 'Field must be a number' })
@IsPositive({ message: 'Field must be a positive number' })
numberField: number;
```

#### **Conditional Validation**
```typescript
@ApiPropertyOptional({ description: 'Conditional field' })
@IsOptional()
@IsISO8601({ strict: true }, { message: 'Field must be a valid date' })
@ValidateIf((o) => o.someConditionField && o.someConditionField !== 'defaultValue')
@Transform(({ value, obj }: TransformFnParams) => {
    if (!value) return value;
    // Custom validation logic
    return value;
})
conditionalField?: string;
```

### **Nested Object Validation**
```typescript
// For complex nested objects in request DTOs
@ApiProperty({
    description: 'Nested object',
    type: 'object',
    properties: {
        id: { type: 'number', example: 123 },
        name: { type: 'string', example: 'Name' }
    }
})
@IsNotEmpty({ message: 'Nested object is required' })
@IsObject({ message: 'Must be a valid object' })
@ValidateNested()
@Type(() => NestedObjectDTO)
nestedObject: NestedObjectDTO;
```

### **Array Validation**
```typescript
// For arrays in request DTOs
@ApiProperty({
    description: 'Array field',
    type: 'array',
    items: { type: 'object' }
})
@IsArray({ message: 'Must be an array' })
@ValidateNested({ each: true })
@Type(() => ArrayItemDTO)
arrayField: ArrayItemDTO[];
```

### **Validation Decorators Reference**
- `@IsNotEmpty()` - Field cannot be empty (for required fields)
- `@IsOptional()` - Field is optional
- `@IsString()`, `@IsNumber()`, `@IsBoolean()` - Type validation
- `@IsISO8601({ strict: true })` - Date format validation
- `@MinLength()`, `@MaxLength()` - String length validation
- `@IsPositive()`, `@Min()` - Number validation
- `@Matches()` - Regular expression validation
- `@Transform()` - Data transformation and custom validation
- `@ValidateIf()` - Conditional validation
- `@ValidateNested()` - Nested object validation
- `@Type()` - Class transformation for nested objects
- Always include custom error messages for better API documentation

## Request DTO Pattern
```typescript
export class CreateEntityNameDTO {
    @ApiProperty({ description: 'Primary identifier', example: 123456 })
    @IsNotEmpty({ message: 'Primary identifier is required' })
    @IsNumber({}, { message: 'Primary identifier must be a number' })
    @IsPositive({ message: 'Primary identifier must be a positive number' })
    primaryKeyField: PrimaryKeyType;
    
    @ApiProperty({ description: 'Required field', example: 'Value', maxLength: 75 })
    @IsNotEmpty({ message: 'Field is required' })
    @IsString({ message: 'Field must be a string' })
    @MinLength(2, { message: 'Field must be at least 2 characters long' })
    @MaxLength(75, { message: 'Field cannot exceed 75 characters' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @Matches(/^[A-Za-z\s\-']+$/, { message: 'Field can only contain letters, spaces, hyphens, and apostrophes' })
    fieldName: string;

    // Foreign key field validation
    @ApiProperty({ description: 'Related entity identifier', example: 12345 })
    @IsNotEmpty({ message: 'Related entity ID is required' })
    @IsNumber({}, { message: 'Related entity ID must be a number' })
    @IsPositive({ message: 'Related entity ID must be a positive number' })
    relatedEntityId: number;

    // Descriptor field validation
    @ApiProperty({ description: 'Descriptor identifier', example: 678 })
    @IsNotEmpty({ message: 'Descriptor ID is required' })
    @IsNumber({}, { message: 'Descriptor ID must be a number' })
    @IsPositive({ message: 'Descriptor ID must be a positive number' })
    descriptorId: number;

    @ApiPropertyOptional({ description: 'Optional field', example: 'Optional', maxLength: 30 })
    @IsOptional()
    @IsString({ message: 'Optional field must be a string' })
    @MaxLength(30, { message: 'Optional field cannot exceed 30 characters' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    optionalField?: string;

    @ApiProperty({ description: 'Date field', example: '2010-05-15' })
    @IsNotEmpty({ message: 'Date field is required' })
    @IsISO8601({ strict: true }, { message: 'Date field must be a valid ISO 8601 date' })
    @Transform(({ value }: TransformFnParams) => {
        const date = new Date(value);
        const now = new Date();
        if (date > now) {
            throw new Error('Date field cannot be in the future');
        }
        return value;
    })
    dateField: string;

    // Include comprehensive validation decorators:
    // - @IsNotEmpty, @IsOptional for required/optional fields
    // - @IsString, @IsNumber, @IsBoolean, @IsISO8601 for type validation
    // - @MinLength, @MaxLength for string length validation
    // - @IsPositive, @Min for number validation
    // - @Matches for pattern validation
    // - @Transform for data transformation and custom validation
    // - @ValidateIf for conditional validation
    // - @ValidateNested, @Type for nested objects
    // - Custom error messages for all validation rules
}
```

## INFORMATION PROCESSING

### **Required Information:**
1. **Main Entity Name**: The primary entity name (e.g., "Student", "School")
2. **Field Structure Object**: JSON object containing all entity fields with types, nested objects, and arrays

**Example Field Structure Object:**
```json
{
  "id": "string",
  "courseCode": "string",
  "identificationCodes": [
    {
      "courseIdentificationSystemDescriptor": "string",
      "assigningOrganizationIdentificationCode": "string",
      "courseCatalogURL": "string",
      "identificationCode": "string"
    }
  ],
  "educationOrganizationReference": {
    "educationOrganizationId": 0,
    "link": {
      "rel": "string",
      "href": "string"
    }
  },
  "courseTitle": "string",
  "dateCourseAdopted": "2025-05-30",
  "highSchoolCourseRequirement": true,
  "maxCompletionsForCredit": 1,
  "_etag": "string",
  "_lastModifiedDate": "2025-05-30T12:25:11.144Z"
}
```

**Note**: This object defines both request and response DTO structure. Use it to determine:
- Field names and data types
- Required vs optional fields (based on business logic)
- Nested objects and array structures
- Validation patterns needed
- Foreign key relationships
- Descriptor references

### **Information Retrieved Automatically:**
3. **Entity Structure**: Retrieved from `.cursor/entities-registry.md`
4. **Entity Dependencies**: Direct foreign key relationships identified from CREATE statements
5. **Database Schema**: Table structure, indexes, and constraints from registry
6. **Descriptor Classification**: Automatically identify descriptor entities for proper placement

### **Optional Information (Request if not provided):**
7. **Primary Key Information**: If entity uses non-standard primary key pattern
8. **Base Entity Usage**: Whether entity should extend Base entity (auto-detected from registry)
9. **Custom Validation Rules**: Any specific validation requirements beyond standard patterns
10. **Complex Relationship Rules**: Special handling for many-to-many or complex foreign key scenarios

## QUESTIONS TO ASK

If any required information is missing, ask the user:
1. "What is the main entity name?"
2. "Could you provide the field structure object for the entity?"
3. If entity not found in registry: "Could you provide the CREATE statement for [EntityName]?"
4. "Are there any custom validation rules beyond standard Ed-Fi patterns?"
5. "Are there specific business rules for foreign key relationships?"

**Note**: Entity structure, relationships, and database schema are automatically retrieved from `.cursor/entities-registry.md`

## DELIVERABLES

For each entity generation request, provide:

### **1. Entities Created**
- ✅ Main entity with proper TypeORM decorators and lazy loading
- ✅ All direct foreign key entities (1 level deep only) with lazy loading
- ✅ Descriptor entities in `src/common/entities/descriptors/` directory
- ✅ All database indexes as specified in registry
- ✅ Proper entity relationships and constraints with lazy loading

### **2. DTOs Created**
- ✅ Response DTO with constructor and ETag generation
- ✅ Request DTO with comprehensive validation decorators including foreign key validation
- ✅ Proper ApiProperty and ApiPropertyOptional decorators
- ✅ Custom error messages for all validations
- ✅ Nested object and array validation where applicable

### **3. File Organization**
- ✅ Main entities in `src/common/entities/` directory
- ✅ Descriptor entities in `src/common/entities/descriptors/` directory
- ✅ Response DTO in appropriate module `dto/` folder
- ✅ Request DTO in appropriate module `dto/request/` folder

### **4. Relationship Documentation**
- ✅ Clear documentation of foreign key relationships
- ✅ Lazy loading implementation for all foreign tables
- ✅ Proper join column definitions
- ✅ Index documentation and implementation

## IMPORTANT NOTES

- Reference `.cursor/entities-registry.md` for all entity definitions and CREATE statements
- Create entities with direct foreign key relationships only (1 level deep)
- **ALL foreign table relationships MUST use lazy loading**: `{ lazy: true }`
- **Descriptor entities go in `src/common/entities/descriptors/` directory**
- Both request and response DTOs are based on the same field structure object
- All entities must include timestamp fields if not extending Base entity
- Validation is comprehensive with custom error messages for all rules
- ETag and timestamp generation is standard for all Ed-Fi response DTOs
- Foreign key validation includes existence checks and type validation
- Complex nested objects require `@ValidateNested()` and `@Type()` decorators

---