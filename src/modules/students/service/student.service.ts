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
import { UUID } from 'crypto';
import { Student } from 'src/common/entities/student.entity';
import { StudentDTO } from '../dto/student.dto';
import { CreateStudentDTO } from '../dto/request/create-student.dto';
import { StudentRepository } from '../repository/student.repository';
import { transformStudentsToDTO, validateBusinessRules } from '../utils/students.util';
import { CitizenshipStatusDescriptor } from 'src/common/entities/descriptors/citizenship-status.descriptor.entity';
import { CountryDescriptor } from 'src/common/entities/descriptors/country.descriptor.entity';
import { SexDescriptor } from 'src/common/entities/descriptors/sex.descriptor.entity';
import { StateAbbreviationDescriptor } from 'src/common/entities/descriptors/state-abbreviation.descriptor';

/**
 * Student Service
 * 
 * Handles all business logic for Student entities including validation,
 * constraint checking, foreign key validation, and data orchestration.
 * This service follows the business logic layer pattern and contains
 * all business rules without any database interaction logic.
 */
@Injectable()
export class StudentService {
    private readonly logger: CustomLogger = new CustomLogger();

    constructor(
        private readonly studentRepository: StudentRepository,
        private readonly etagService: ETagService,
        private readonly transactionService: TransactionService,
    ) {
        this.logger.setContext('StudentService');
    }

    /**
     * Retrieves a paginated list of students based on query options
     * Only returns active records (not deleted or inactive)
     * 
     * @param queryOptionsFromRequest - Query parameters for filtering and pagination
     * @param httpResponse - HTTP response object for setting headers
     * @returns Promise<StudentDTO[]> Array of student DTOs
     */
    @LogMethod()
    @UseInterceptors(CacheInterceptor)
    @CacheKey('all-students')
    @CacheTTL(3600)
    async getAllStudents(
        queryOptionsFromRequest: IQueryOptions,
        httpResponse: GenericResponse,
    ): Promise<StudentDTO[]> {
        const cacheKey = `all-students`;
        this.logger.log('Starting process to retrieve all students', { cacheKey });

        // [Step-1]: Retrieve students from repository with active status filter
        const [studentsFromDatabase, totalStudentsCount]: [Student[], number] = 
            await this.studentRepository.findAllBy(queryOptionsFromRequest, { status: Status.ACTIVE });

        // [Step-2]: Handle empty result set
        if (!studentsFromDatabase || studentsFromDatabase.length === 0) {
            this.logger.log('No students found matching the criteria');
            return [];
        }

        // [Step-3]: Set total count header if requested
        if (queryOptionsFromRequest.totalCount) {
            httpResponse.setHeader('Total-Count', totalStudentsCount.toString());
            this.logger.log(`Set Total-Count header: ${totalStudentsCount}`);
        }

        // [Step-4]: Transform entities to DTOs using utility function
        const studentDTOsForResponse: StudentDTO[] = transformStudentsToDTO(studentsFromDatabase);

        this.logger.log(`Successfully retrieved ${studentDTOsForResponse.length} students`);
        return studentDTOsForResponse;
    }

    /**
     * Retrieves a specific student by their identifier
     * Only returns active records (not deleted or inactive)
     * 
     * @param studentIdFromRequest - Student identifier as string from request
     * @param httpResponse - HTTP response object for setting ETag headers
     * @returns Promise<StudentDTO> Single student DTO
     * @throws BadRequestError if student ID is invalid
     * @throws UnknownObjectError if student is not found or not active
     */
    @LogMethod()
    @UseInterceptors(CacheInterceptor)
    @CacheKey('student-by-id')
    @CacheTTL(3600)
    async getStudentById(
        studentIdFromRequest: string,
        httpResponse: GenericResponse,
    ): Promise<StudentDTO> {
        this.logger.log('Starting process to retrieve student by ID', { studentId: studentIdFromRequest });

        // [Step-1]: Validate input parameters
        if (!studentIdFromRequest?.trim()) {
            throw new BadRequestError('Student ID is required');
        }

        // [Step-2]: Retrieve student from repository with active status filter
        const studentFromDatabase: Student | null = await this.studentRepository.findById(studentIdFromRequest, Status.ACTIVE);

        // [Step-3]: Handle student not found or not active
        if (!studentFromDatabase) {
            this.logger.warn(`Student with ID ${studentIdFromRequest} not found or not active`);
            throw new UnknownObjectError(`Student with ID ${studentIdFromRequest} not found`);
        }

        // [Step-4]: Transform to DTO and set ETag header
        const studentDTOForResponse: StudentDTO = new StudentDTO(studentFromDatabase);
        httpResponse.setHeader('ETag', studentDTOForResponse._etag);

        this.logger.log(`Successfully retrieved student with ID ${studentIdFromRequest}`);
        return studentDTOForResponse;
    }

    /**
     * Creates a new student resource
     * 
     * **IMPORTANT**: This method performs comprehensive validation:
     * - Checks if record exists by primary key/ID
     * - Checks if record exists by all unique key constraints
     * - Validates all foreign key references using numeric descriptor IDs
     * - Throws BadRequestError if any constraint violation or invalid foreign key is found
     * 
     * @param createStudentRequest - Validated student data from request
     * @param ifNoneMatchHeader - Optional ETag header (not used in validation)
     * @returns Promise<void> No return value for successful creation
     * @throws BadRequestError for constraint violations, validation errors, or invalid foreign keys
     */
    @LogMethod()
    @Transactional()
    async createStudent(
        createStudentRequest: CreateStudentDTO,
        ifNoneMatchHeader: string,
    ): Promise<void> {
        return this.transactionService.executeInTransaction(async (queryRunner) => {
            this.logger.log('Starting process to create student');

            // [Step-1]: Validate business rules
            validateBusinessRules(createStudentRequest);

            // [Step-2]: Check for existing record by PRIMARY KEY/ID
            await this.validatePrimaryKeyConstraints(createStudentRequest, queryRunner);

            // [Step-3]: Check for existing record by UNIQUE KEY constraints
            await this.validateUniqueKeyConstraints(createStudentRequest, queryRunner);

            // [Step-4]: Check for existing record by COMPOSITE KEY (if applicable)
            await this.validateCompositeKeyConstraints(createStudentRequest, queryRunner);

            // [Step-5]: Validate all foreign key references
            await this.validateForeignKeyReferences(createStudentRequest, queryRunner);

            // [Step-6]: Create student entity from validated request
            const studentEntityToSave: Student = this.createStudentEntityFromRequest(createStudentRequest);

            // [Step-7]: Save new student using transaction repository
            const repository = this.transactionService.getRepository(Student, queryRunner);
            await repository.save(studentEntityToSave);

            this.logger.log('Successfully created student');
        });
    }

    /**
     * Deletes a student by their identifier (soft delete)
     * 
     * @param studentIdFromRequest - Student identifier as string from request
     * @param ifMatchHeader - Required ETag header for concurrency control
     * @returns Promise<void> No return value for successful deletion
     * @throws BadRequestError if student ID is invalid
     * @throws UnknownObjectError if student is not found
     */
    @LogMethod()
    async deleteStudent(
        studentIdFromRequest: string,
        ifMatchHeader: string,
    ): Promise<void> {
        this.logger.log('Starting process to delete student');

        // [Step-1]: Validate input parameters
        if (!studentIdFromRequest?.trim()) {
            throw new BadRequestError('Student ID is required');
        }

        // [Step-2]: Retrieve existing student for validation
        const existingStudentFromDatabase: Student | null = 
            await this.studentRepository.findById(studentIdFromRequest);

        // [Step-3]: Handle student not found
        if (!existingStudentFromDatabase) {
            this.logger.warn(`Student with ID ${studentIdFromRequest} not found for deletion`);
            throw new UnknownObjectError(`Student with ID ${studentIdFromRequest} not found`);
        }

        // [Step-4]: Validate ETag for concurrency control
        const existingStudentDTO: StudentDTO = new StudentDTO(existingStudentFromDatabase);
        this.etagService.validateIfMatch(ifMatchHeader, existingStudentDTO._etag);

        // [Step-5]: Perform soft deletion
        const deletionSuccessful: boolean = await this.studentRepository.deleteStudent(studentIdFromRequest);

        // [Step-6]: Handle deletion failure
        if (!deletionSuccessful) {
            this.logger.error(`Failed to delete student with ID ${studentIdFromRequest}`);
            throw new UnknownObjectError(`Failed to delete student with ID ${studentIdFromRequest}`);
        }

        this.logger.log(`Successfully deleted student with ID ${studentIdFromRequest}`);
    }

    /**
     * Validates primary key constraints for create operation
     * 
     * @param createStudentRequest - The request containing primary key
     * @param queryRunner - The transaction query runner
     * @throws BadRequestError if primary key already exists
     */
    private async validatePrimaryKeyConstraints(
        createStudentRequest: CreateStudentDTO,
        queryRunner: any
    ): Promise<void> {
        if (createStudentRequest.id) {
            const existingStudentById = await this.studentRepository.findById(createStudentRequest.id);
            if (existingStudentById) {
                this.logger.warn(`Student with ID ${createStudentRequest.id} already exists`);
                throw new BadRequestError(`Student record already exists with id: ${createStudentRequest.id}`);
            }
        }
    }

    /**
     * Validates unique key constraints for create operation
     * **AUTO-DISCOVERED**: Unique constraints identified from entity structure
     * 
     * @param createStudentRequest - The request containing unique fields
     * @param queryRunner - The transaction query runner
     * @throws BadRequestError if unique constraint violation found
     */
    private async validateUniqueKeyConstraints(
        createStudentRequest: CreateStudentDTO,
        queryRunner: any
    ): Promise<void> {
        // **AUTO-DISCOVERED**: Check studentUniqueId unique constraint
        if (createStudentRequest.studentUniqueId) {
            const existingStudentByUniqueId = await this.studentRepository.findByStudentUniqueId(createStudentRequest.studentUniqueId);
            if (existingStudentByUniqueId) {
                this.logger.warn(`Student with studentUniqueId ${createStudentRequest.studentUniqueId} already exists`);
                throw new BadRequestError(`Student record already exists with studentUniqueId: ${createStudentRequest.studentUniqueId}`);
            }
        }
    }

    /**
     * Validates composite key constraints for create operation
     * **AUTO-DISCOVERED**: Composite key fields identified from entity structure
     * 
     * @param createStudentRequest - The request containing composite key fields
     * @param queryRunner - The transaction query runner
     * @throws BadRequestError if composite key already exists
     */
    private async validateCompositeKeyConstraints(
        createStudentRequest: CreateStudentDTO,
        queryRunner: any
    ): Promise<void> {
        // **AUTO-DISCOVERED**: Build composite key from entity natural key fields
        // For Student entity, the natural key could be combination of personId + sourceSystemDescriptor
        if (createStudentRequest.personReference?.personId && createStudentRequest.personReference?.sourceSystemDescriptor) {
            const compositeKeyWhere: FindOptionsWhere<Student> = {
                personId: createStudentRequest.personReference.personId,
                // Note: sourceSystemDescriptor would need to be resolved to ID
                // sourceSystemDescriptorId: resolvedSourceSystemDescriptorId,
            };
            
            const existingStudentByCompositeKey = await this.studentRepository.findByCompositeKey(compositeKeyWhere);
            if (existingStudentByCompositeKey) {
                this.logger.warn('Student already exists with the same composite key');
                throw new BadRequestError('Student already exists with the same person and source system combination');
            }
        }
    }

    /**
     * Validates all foreign key references in the create student request
     * **IMPORTANT**: Descriptors should be validated using their numeric IDs
     * **AUTO-DISCOVERED**: Foreign key relationships identified from entity decorators
     * 
     * @param createStudentRequest - The request containing foreign key references
     * @param queryRunner - The transaction query runner
     * @throws BadRequestError if any foreign key reference is invalid
     */
    private async validateForeignKeyReferences(
        createStudentRequest: CreateStudentDTO,
        queryRunner: any
    ): Promise<void> {
        // **AUTO-DISCOVERED**: Validate citizenship status descriptor
        if (createStudentRequest.citizenshipStatusDescriptor) {
            const citizenshipStatusDescriptorRepo = this.transactionService.getRepository(CitizenshipStatusDescriptor, queryRunner);
            // Note: This would require descriptor URI to ID resolution
            // For now, assuming the descriptor contains the ID
            const descriptorId = this.extractDescriptorIdFromUri(createStudentRequest.citizenshipStatusDescriptor);
            const citizenshipStatusDescriptor = await citizenshipStatusDescriptorRepo.findOne({
                where: { citizenshipStatusDescriptorId: descriptorId }
            });
            if (!citizenshipStatusDescriptor) {
                throw new BadRequestError(`Invalid citizenship status descriptor: ${createStudentRequest.citizenshipStatusDescriptor}`);
            }
        }

        // **AUTO-DISCOVERED**: Validate birth country descriptor
        if (createStudentRequest.birthCountryDescriptor) {
            const countryDescriptorRepo = this.transactionService.getRepository(CountryDescriptor, queryRunner);
            const descriptorId = this.extractDescriptorIdFromUri(createStudentRequest.birthCountryDescriptor);
            const countryDescriptor = await countryDescriptorRepo.findOne({
                where: { countryDescriptorId: descriptorId }
            });
            if (!countryDescriptor) {
                throw new BadRequestError(`Invalid birth country descriptor: ${createStudentRequest.birthCountryDescriptor}`);
            }
        }

        // **AUTO-DISCOVERED**: Validate birth sex descriptor
        if (createStudentRequest.birthSexDescriptor) {
            const sexDescriptorRepo = this.transactionService.getRepository(SexDescriptor, queryRunner);
            const descriptorId = this.extractDescriptorIdFromUri(createStudentRequest.birthSexDescriptor);
            const sexDescriptor = await sexDescriptorRepo.findOne({
                where: { sexDescriptorId: descriptorId }
            });
            if (!sexDescriptor) {
                throw new BadRequestError(`Invalid birth sex descriptor: ${createStudentRequest.birthSexDescriptor}`);
            }
        }

        // **AUTO-DISCOVERED**: Validate birth state abbreviation descriptor
        if (createStudentRequest.birthStateAbbreviationDescriptor) {
            const stateAbbreviationDescriptorRepo = this.transactionService.getRepository(StateAbbreviationDescriptor, queryRunner);
            const descriptorId = this.extractDescriptorIdFromUri(createStudentRequest.birthStateAbbreviationDescriptor);
            const stateAbbreviationDescriptor = await stateAbbreviationDescriptorRepo.findOne({
                where: { stateAbbreviationDescriptorId: descriptorId }
            });
            if (!stateAbbreviationDescriptor) {
                throw new BadRequestError(`Invalid birth state abbreviation descriptor: ${createStudentRequest.birthStateAbbreviationDescriptor}`);
            }
        }
    }

    /**
     * Creates a Student entity from the validated request data
     * 
     * @param createStudentRequest - The validated request data
     * @returns Student entity ready for database save
     */
    private createStudentEntityFromRequest(createStudentRequest: CreateStudentDTO): Student {
        const studentEntity = new Student();
        
        // **AUTO-DISCOVERED**: Map all fields from DTO to entity
        if (createStudentRequest.id) {
            studentEntity.id = createStudentRequest.id as UUID;
        }
        
        studentEntity.studentUniqueId = createStudentRequest.studentUniqueId;
        studentEntity.birthDate = new Date(createStudentRequest.birthDate);
        studentEntity.firstName = createStudentRequest.firstName;
        studentEntity.lastSurname = createStudentRequest.lastSurname;
        
        // Optional fields
        if (createStudentRequest.personalTitlePrefix) {
            studentEntity.personalTitlePrefix = createStudentRequest.personalTitlePrefix;
        }
        if (createStudentRequest.middleName) {
            studentEntity.middleName = createStudentRequest.middleName;
        }
        if (createStudentRequest.preferredFirstName) {
            studentEntity.preferredFirstName = createStudentRequest.preferredFirstName;
        }
        if (createStudentRequest.preferredLastSurname) {
            studentEntity.preferredLastSurname = createStudentRequest.preferredLastSurname;
        }
        if (createStudentRequest.generationCodeSuffix) {
            studentEntity.generationCodeSuffix = createStudentRequest.generationCodeSuffix;
        }
        if (createStudentRequest.maidenName) {
            studentEntity.maidenName = createStudentRequest.maidenName;
        }
        if (createStudentRequest.birthCity) {
            studentEntity.birthCity = createStudentRequest.birthCity;
        }
        if (createStudentRequest.birthInternationalProvince) {
            studentEntity.birthInternationalProvince = createStudentRequest.birthInternationalProvince;
        }
        if (createStudentRequest.dateEnteredUS) {
            studentEntity.dateEnteredUS = new Date(createStudentRequest.dateEnteredUS);
        }
        if (createStudentRequest.multipleBirthStatus !== undefined) {
            studentEntity.multipleBirthStatus = createStudentRequest.multipleBirthStatus;
        }

        // Person reference fields
        if (createStudentRequest.personReference) {
            studentEntity.personId = createStudentRequest.personReference.personId;
            // Note: sourceSystemDescriptor would need to be resolved to ID
            // studentEntity.sourceSystemDescriptorId = resolvedSourceSystemDescriptorId;
        }

        // Descriptor ID fields (would need descriptor URI to ID resolution)
        if (createStudentRequest.citizenshipStatusDescriptor) {
            studentEntity.citizenshipStatusDescriptorId = this.extractDescriptorIdFromUri(createStudentRequest.citizenshipStatusDescriptor);
        }
        if (createStudentRequest.birthCountryDescriptor) {
            studentEntity.birthCountryDescriptorId = this.extractDescriptorIdFromUri(createStudentRequest.birthCountryDescriptor);
        }
        if (createStudentRequest.birthSexDescriptor) {
            studentEntity.birthSexDescriptorId = this.extractDescriptorIdFromUri(createStudentRequest.birthSexDescriptor);
        }
        if (createStudentRequest.birthStateAbbreviationDescriptor) {
            studentEntity.birthStateAbbreviationDescriptorId = this.extractDescriptorIdFromUri(createStudentRequest.birthStateAbbreviationDescriptor);
        }
        
        return studentEntity;
    }

    /**
     * Helper method to extract descriptor ID from URI
     * This is a placeholder implementation - would need proper descriptor resolution service
     * 
     * @param descriptorUri - The descriptor URI
     * @returns number The extracted descriptor ID
     */
    private extractDescriptorIdFromUri(descriptorUri: string): number {
        // This is a placeholder implementation
        // In a real implementation, this would use a descriptor resolution service
        // to convert URIs like "uri://ed-fi.org/SexDescriptor#Male" to numeric IDs
        
        // For now, assume the URI contains the ID at the end
        const match = descriptorUri.match(/#(\d+)$/);
        if (match) {
            return parseInt(match[1], 10);
        }
        
        // If no numeric ID, throw error indicating need for descriptor resolution
        throw new BadRequestError(`Descriptor URI resolution not implemented: ${descriptorUri}`);
    }
} 