# Ed-Fi DTOs Creation Generator

You are an expert NestJS developer focused on creating Ed-Fi specification request and response DTOs with comprehensive validation and proper API documentation following established patterns.

## PREREQUISITES

**Required Previous Steps:**
- **Entity Creation**: TypeORM entities must be created using the entity-creation-prompt
- **Entity Location**: All entities are located in `src/common/entities/` directory
- **Descriptor Entities**: Located in `src/common/entities/descriptors/` directory

## DTO INFORMATION SOURCES

### **Primary Source: Endpoint Specification**
**Location**: `endpoint-spec.json` file

**Schema Path**: `specification.post.requestBody.content.application/json.schema`

This schema contains:
1. **Required Fields Array**: `required` - determines `@IsNotEmpty()` vs `@IsOptional()` decorators
2. **Field Structure**: `properties` - contains all field definitions with:
   - **Field Types**: `type`, `format` (string, number, integer, boolean, date, etc.)
   - **Constraints**: `maxLength`, `minLength`, `minimum`, `maximum`, `pattern`
   - **Descriptions**: `description` for API documentation
   - **Nullability**: `x-nullable` for optional field handling
   - **Nested Objects**: Complex object structures with their own `properties`
   - **Arrays**: `type: "array"` with `items` schema for validation

**Example Schema Structure**:
```json
{
  "required": ["courseCode", "courseTitle", "numberOfParts"],
  "properties": {
    "courseCode": {
      "maxLength": 60,
      "type": "string",
      "description": "A unique alphanumeric code assigned to a course."
    },
    "identificationCodes": {
      "type": "array",
      "items": {
        "required": ["courseIdentificationSystemDescriptor", "identificationCode"],
        "properties": {
          "courseIdentificationSystemDescriptor": {
            "maxLength": 306,
            "type": "string",
            "description": "A system that is used to identify..."
          }
        }
      }
    },
    "dateCourseAdopted": {
      "type": "string",
      "format": "date",
      "x-nullable": true
    }
  }
}
```

### **Fallback Source: Explicit Field Structure**
If `endpoint-spec.json` is not available or incomplete, use explicitly provided field structure object.

**Example Explicit Structure**:
```json
{
  "id": "string",
  "courseCode": "string",
  "courseTitle": "string",
  "dateCourseAdopted": "2025-05-30",
  "highSchoolCourseRequirement": true,
  "identificationCodes": [
    {
      "courseIdentificationSystemDescriptor": "string",
      "identificationCode": "string"
    }
  ]
}
```

## DTO CREATION STANDARDS

### **Response DTO Pattern**
```typescript
export class EntityNameDTO {
    @ApiProperty({ description: 'Primary identifier', example: 'example-id' })
    id: string;

    @ApiProperty({ description: 'Field description from schema', example: 'Example value' })
    fieldName: string;

    @ApiPropertyOptional({ description: 'Optional field description', example: 'Optional value' })
    optionalField?: string;

    // Nested object using separate DTO class
    @ApiProperty({ description: 'Nested object reference' })
    @ValidateNested()
    @Type(() => NestedObjectDTO)
    nestedObject: NestedObjectDTO;

    // Array of nested objects using separate DTO class
    @ApiProperty({ 
        description: 'Array of nested items',
        type: [NestedItemDTO]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => NestedItemDTO)
    nestedItems: NestedItemDTO[];

    // Standard Ed-Fi fields (excluded from request DTOs)
    @ApiProperty({ description: 'ETag for concurrency control', example: '"2025-05-29T07:53:44.000Z"' })
    _etag: string;

    @ApiProperty({ description: 'Last modified date', example: '2025-05-29T07:53:44.000Z' })
    _lastModifiedDate: string;

    constructor(entityName: EntityName) {
        this.id = entityName.id;
        this.fieldName = entityName.fieldName;
        this.optionalField = entityName.optionalField;
        
        // Handle nested objects (populated by service layer after entity resolution)
        if (entityName.nestedEntity) {
            this.nestedObject = new NestedObjectDTO(entityName.nestedEntity);
        }
        
        // Handle arrays (populated by service layer)
        this.nestedItems = []; // Will be populated with NestedItemDTO instances
        
        // Generate Ed-Fi ETag and lastModifiedDate
        const lastModified = entityName.updatedAt || entityName.createdAt;
        this._etag = `"${lastModified.toISOString()}"`;
        this._lastModifiedDate = lastModified.toISOString();
    }
}
```

### **Create Request DTO Pattern with Auto-Generated Validation**
```typescript
export class CreateEntityNameDTO {
    // AUTO-GENERATED: Required field based on schema.required array
    @ApiProperty({ 
        description: 'Field description from schema', 
        example: 'Example',
        maxLength: 60 // From schema.properties.fieldName.maxLength
    })
    @IsNotEmpty({ message: 'Field is required' })
    @IsString({ message: 'Field must be a string' })
    @MaxLength(60, { message: 'Field cannot exceed 60 characters' }) // From schema constraint
    @Transform(({ value }: TransformFnParams) => value?.trim())
    fieldName: string;

    // AUTO-GENERATED: Optional field based on schema.properties without required
    @ApiPropertyOptional({ 
        description: 'Optional field description from schema',
        maxLength: 30
    })
    @IsOptional() // Not in required array
    @IsString({ message: 'Optional field must be a string' })
    @MaxLength(30, { message: 'Optional field cannot exceed 30 characters' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    optionalField?: string;

    // AUTO-GENERATED: Date field with format validation
    @ApiPropertyOptional({ description: 'Date field', example: '2010-05-15' })
    @IsOptional() // x-nullable: true in schema
    @IsISO8601({ strict: true }, { message: 'Date must be a valid ISO 8601 date' })
    @Transform(({ value }: TransformFnParams) => {
        if (!value) return value;
        const date = new Date(value);
        const now = new Date();
        if (date > now) {
            throw new Error('Date cannot be in the future');
        }
        return value;
    })
    dateField?: string;

    // AUTO-GENERATED: Number field with min/max constraints
    @ApiPropertyOptional({ 
        description: 'Number field',
        minimum: 1,
        maximum: 8
    })
    @IsOptional()
    @IsNumber({}, { message: 'Field must be a number' })
    @Min(1, { message: 'Field must be at least 1' }) // From schema.minimum
    @Max(8, { message: 'Field cannot exceed 8' }) // From schema.maximum
    numberField?: number;

    // AUTO-GENERATED: Nested object validation
    @ApiProperty({
        description: 'Nested object description from schema',
        type: NestedObjectDTO
    })
    @IsNotEmpty({ message: 'Nested object is required' })
    @ValidateNested()
    @Type(() => NestedObjectDTO)
    nestedObject: NestedObjectDTO;

    // AUTO-GENERATED: Array validation
    @ApiProperty({
        description: 'Array field description from schema',
        type: [ArrayItemDTO]
    })
    @IsArray({ message: 'Must be an array' })
    @ValidateNested({ each: true })
    @Type(() => ArrayItemDTO)
    arrayField: ArrayItemDTO[];

    // NOTE: _etag and _lastModifiedDate are EXCLUDED from request DTOs
}
```

### **Update Request DTO Pattern (Identical to Create DTO)**
```typescript
export class UpdateEntityNameDTO {
    // **IMPORTANT**: Update DTO has IDENTICAL structure to Create DTO
    // **IMPORTANT**: Update DTO includes the ID field for entity mapping
    // **AUTO-GENERATED**: All fields copied from Create DTO with same validation

    @ApiProperty({ description: 'Primary identifier', example: 'example-id' })
    @IsNotEmpty({ message: 'Id is required' })
    @IsUUID('4', { message: 'Id must be a valid UUID' })
    id: string;

    // AUTO-GENERATED: Required field based on schema.required array
    @ApiProperty({ 
        description: 'Field description from schema', 
        example: 'Example',
        maxLength: 60 // From schema.properties.fieldName.maxLength
    })
    @IsNotEmpty({ message: 'Field is required' })
    @IsString({ message: 'Field must be a string' })
    @MaxLength(60, { message: 'Field cannot exceed 60 characters' }) // From schema constraint
    @Transform(({ value }: TransformFnParams) => value?.trim())
    fieldName: string;

    // AUTO-GENERATED: Optional field based on schema.properties without required
    @ApiPropertyOptional({ 
        description: 'Optional field description from schema',
        maxLength: 30
    })
    @IsOptional() // Not in required array
    @IsString({ message: 'Optional field must be a string' })
    @MaxLength(30, { message: 'Optional field cannot exceed 30 characters' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    optionalField?: string;

    // AUTO-GENERATED: Date field with format validation
    @ApiPropertyOptional({ description: 'Date field', example: '2010-05-15' })
    @IsOptional() // x-nullable: true in schema
    @IsISO8601({ strict: true }, { message: 'Date must be a valid ISO 8601 date' })
    @Transform(({ value }: TransformFnParams) => {
        if (!value) return value;
        const date = new Date(value);
        const now = new Date();
        if (date > now) {
            throw new Error('Date cannot be in the future');
        }
        return value;
    })
    dateField?: string;

    // AUTO-GENERATED: Number field with min/max constraints
    @ApiPropertyOptional({ 
        description: 'Number field',
        minimum: 1,
        maximum: 8
    })
    @IsOptional()
    @IsNumber({}, { message: 'Field must be a number' })
    @Min(1, { message: 'Field must be at least 1' }) // From schema.minimum
    @Max(8, { message: 'Field cannot exceed 8' }) // From schema.maximum
    numberField?: number;

    // AUTO-GENERATED: Nested object validation
    @ApiProperty({
        description: 'Nested object description from schema',
        type: NestedObjectDTO
    })
    @IsNotEmpty({ message: 'Nested object is required' })
    @ValidateNested()
    @Type(() => NestedObjectDTO)
    nestedObject: NestedObjectDTO;

    // AUTO-GENERATED: Array validation
    @ApiProperty({
        description: 'Array field description from schema',
        type: [ArrayItemDTO]
    })
    @IsArray({ message: 'Must be an array' })
    @ValidateNested({ each: true })
    @Type(() => ArrayItemDTO)
    arrayField: ArrayItemDTO[];

    // NOTE: _etag and _lastModifiedDate are EXCLUDED from request DTOs
}
```

## AUTOMATIC CONSTRAINT MAPPING

### **Schema to Validation Decorator Mapping**

| Schema Constraint | Validation Decorator | Example |
|------------------|---------------------|---------|
| `maxLength: 60` | `@MaxLength(60)` | String length limit |
| `minLength: 5` | `@MinLength(5)` | String minimum length |
| `minimum: 1` | `@Min(1)` | Number minimum value |
| `maximum: 8` | `@Max(8)` | Number maximum value |
| `type: "string"` | `@IsString()` | Type validation |
| `type: "number"` | `@IsNumber()` | Type validation |
| `type: "integer"` | `@IsNumber()` | Type validation |
| `type: "boolean"` | `@IsBoolean()` | Type validation |
| `format: "date"` | `@IsISO8601({ strict: true })` | Date format |
| `pattern: "regex"` | `@Matches(/regex/)` | Pattern validation |
| `x-nullable: true` | `@IsOptional()` | Optional field |
| `required: [field]` | `@IsNotEmpty()` | Required field |
| `type: "array"` | `@IsArray()` | Array validation |

### **Nested Object Handling**
```typescript
// For complex nested objects, create separate DTO classes
export class NestedObjectDTO {
    @ApiProperty({ description: 'Nested field description' })
    @IsNotEmpty({ message: 'Nested field is required' })
    @IsString({ message: 'Nested field must be a string' })
    nestedField: string;
}

// Use in main DTO
@ApiProperty({ description: 'Nested object', type: NestedObjectDTO })
@IsNotEmpty({ message: 'Nested object is required' })
@ValidateNested()
@Type(() => NestedObjectDTO)
nestedObject: NestedObjectDTO;
```

### **Array Item Handling**
```typescript
// For array items, create separate DTO classes
export class ArrayItemDTO {
    @ApiProperty({ description: 'Item field description' })
    @IsNotEmpty({ message: 'Item field is required' })
    @IsString({ message: 'Item field must be a string' })
    itemField: string;
}

// Use in main DTO
@ApiProperty({ description: 'Array of items', type: [ArrayItemDTO] })
@IsArray({ message: 'Must be an array' })
@ValidateNested({ each: true })
@Type(() => ArrayItemDTO)
arrayItems: ArrayItemDTO[];
```

## VALIDATION DECORATORS REFERENCE

### **Core Validation**
- `@IsNotEmpty()` - Field cannot be empty (for required fields from schema.required)
- `@IsOptional()` - Field is optional (not in schema.required or x-nullable: true)
- `@IsString()`, `@IsNumber()`, `@IsBoolean()` - Type validation from schema.type
- `@IsArray()` - Array validation from schema.type: "array"

### **String Validation**
- `@MinLength(n)` - From schema.minLength
- `@MaxLength(n)` - From schema.maxLength
- `@Matches(/regex/)` - From schema.pattern
- `@IsISO8601({ strict: true })` - From schema.format: "date"

### **Number Validation**
- `@Min(n)` - From schema.minimum
- `@Max(n)` - From schema.maximum
- `@IsPositive()` - For positive numbers (business logic)

### **Object/Array Validation**
- `@ValidateNested()` - For nested objects and arrays
- `@Type(() => DTOClass)` - Class transformation for nested objects
- `@Transform()` - Data transformation and custom validation

### **Custom Transformations**
```typescript
@Transform(({ value }: TransformFnParams) => value?.trim()) // Trim strings
@Transform(({ value }: TransformFnParams) => {
    // Custom validation logic
    if (!value) return value;
    // Additional validation
    return value;
})
```

## INFORMATION PROCESSING

### **Required Information:**
1. **Entity Name**: The primary entity name for DTO creation

### **Auto-Discovery Process:**
2. **Schema Structure**: Retrieved from `endpoint-spec.json` → `specification.post.requestBody.content.application/json.schema`
3. **Required Fields**: From schema.required array to determine validation decorators
4. **Field Constraints**: From schema.properties to generate validation rules
5. **Nested Structures**: From schema.properties with type: "object" or "array"
6. **Field Types**: From schema.properties.type and format

### **Fallback Information (if endpoint-spec.json not available):**
7. **Explicit Field Structure**: JSON object with field structure provided by user

### **Auto-Generated Elements:**
- Validation decorators based on schema constraints
- ApiProperty decorators with schema descriptions
- Nested DTO classes for complex objects
- Custom error messages for all validation rules
- TypeScript types matching schema structure

## DELIVERABLES

For each DTO creation request, provide:

### **1. Response DTO**
- ✅ Complete response DTO with constructor
- ✅ ETag and timestamp generation
- ✅ Nested DTO classes for complex objects
- ✅ Proper ApiProperty decorators with schema descriptions
- ✅ Array and object handling

### **2. Create Request DTO**
- ✅ Complete create request DTO with auto-generated validation
- ✅ Validation decorators based on schema constraints
- ✅ Custom error messages for all validation rules
- ✅ Nested object and array validation
- ✅ Excludes _etag and _lastModifiedDate fields

### **3. Update Request DTO**
- ✅ Complete update request DTO with IDENTICAL structure to Create DTO
- ✅ Includes ID field for entity mapping
- ✅ Same validation decorators and constraints as Create DTO
- ✅ Same nested object and array validation as Create DTO
- ✅ Excludes _etag and _lastModifiedDate fields

### **4. Nested DTO Classes**
- ✅ Separate DTO classes for nested objects
- ✅ Separate DTO classes for array items
- ✅ Proper validation for nested structures
- ✅ Reference DTOs for foreign entity relationships

### **5. File Organization**
- ✅ Response DTO in module's `dto/` directory as `{entityName}.response.dto.ts`
- ✅ Create Request DTO in module's `dto/` directory as `create-{entityName}.dto.ts`
- ✅ Update Request DTO in module's `dto/` directory as `update-{entityName}.dto.ts`
- ✅ Nested DTOs in same directory with descriptive names
- ✅ Proper import statements and exports

## FILE NAMING CONVENTIONS

### **File Structure:**
```
src/modules/{entityNamePlural}/dto/
├── {entityName}.response.dto.ts           # Response DTO
├── create-{entityName}.dto.ts             # Create Request DTO
├── update-{entityName}.dto.ts             # Update Request DTO (identical to create)
├── nested-object.dto.ts                   # Nested object DTOs
└── array-item.dto.ts                      # Array item DTOs
```

### **Class Naming:**
- **Response DTO**: `{EntityName}ResponseDTO` or `{EntityName}DTO`
- **Create Request DTO**: `Create{EntityName}DTO`
- **Update Request DTO**: `Update{EntityName}DTO`
- **Nested DTOs**: `{NestedObjectName}DTO`

## IMPORTANT NOTES

- **Schema Priority**: Always use `endpoint-spec.json` schema first, fallback to explicit structure
- **Auto-Validation**: All validation decorators generated from schema constraints
- **Required Detection**: Use schema.required array to determine @IsNotEmpty vs @IsOptional
- **Nested Objects**: Create separate DTO classes for complex nested structures
- **Ed-Fi Standards**: Response DTOs include _etag and _lastModifiedDate, request DTOs exclude them
- **Comprehensive Validation**: Include custom error messages for all validation rules
- **Type Safety**: Ensure TypeScript types match schema definitions exactly
- **Update DTO Pattern**: Update DTO is IDENTICAL to Create DTO structure with same validation
- **ID Field Inclusion**: Update DTO includes ID field for entity mapping purposes
- **Validation Consistency**: Both Create and Update DTOs have identical validation rules
- **File Organization**: Clear separation of response and request DTOs with descriptive naming

---