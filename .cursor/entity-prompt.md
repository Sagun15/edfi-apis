# Ed-Fi Entity Creation Generator

You are an expert NestJS developer focused on creating Ed-Fi specification TypeORM entities with proper relationships and database constraints following established patterns.

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

## INFORMATION PROCESSING

### **Required Information:**
1. **Main Entity Name**: The primary entity name (e.g., "Student", "School", "Course")

### **Information Retrieved Automatically:**
2. **Entity Structure**: Retrieved from `.cursor/entities-registry.md`
3. **Entity Dependencies**: Direct foreign key relationships identified from CREATE statements
4. **Database Schema**: Table structure, indexes, and constraints from registry
5. **Descriptor Classification**: Automatically identify descriptor entities for proper placement
6. **Primary Key Information**: Auto-detected from entity CREATE statement in registry
7. **Base Entity Usage**: Whether entity should extend Base entity (auto-detected from registry)

### **Optional Information (Request if not provided):**
8. **Custom Relationship Rules**: Special handling for many-to-many or complex foreign key scenarios
9. **Additional Constraints**: Any specific database constraints beyond what's in the registry

## QUESTIONS TO ASK

If any required information is missing, ask the user:
1. "What is the main entity name?"
2. If entity not found in registry: "Could you provide the CREATE statement for [EntityName]?"
3. "Are there specific business rules for foreign key relationships?"

**Note**: All entity structure, relationships, and database schema are automatically retrieved from `.cursor/entities-registry.md`

## DELIVERABLES

For each entity creation request, provide:

### **1. Entities Created**
- ✅ Main entity with proper TypeORM decorators and lazy loading
- ✅ All direct foreign key entities (1 level deep only) with lazy loading
- ✅ Descriptor entities in `src/common/entities/descriptors/` directory
- ✅ All database indexes as specified in registry
- ✅ Proper entity relationships and constraints with lazy loading

### **2. File Organization**
- ✅ Main entities in `src/common/entities/` directory
- ✅ Descriptor entities in `src/common/entities/descriptors/` directory
- ✅ Proper import statements and entity exports

### **3. Relationship Documentation**
- ✅ Clear documentation of foreign key relationships
- ✅ Lazy loading implementation for all foreign tables
- ✅ Proper join column definitions
- ✅ Index documentation and implementation

## IMPORTANT NOTES

- **Single Focus**: This prompt ONLY creates TypeORM entities - DTOs are handled separately
- **Registry Dependency**: All entity definitions must come from `.cursor/entities-registry.md`
- **Lazy Loading Required**: ALL foreign table relationships MUST use lazy loading `{ lazy: true }`
- **Descriptor Placement**: Descriptor entities go in `src/common/entities/descriptors/` directory
- **Direct Relationships Only**: Create entities with direct foreign key relationships only (1 level deep)
- **Exact Registry Implementation**: Follow CREATE statements exactly as specified in registry
- **Timestamp Fields**: Include timestamp fields if not extending Base entity

---