import { Injectable, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { TransactionService } from 'src/common/services/transaction.service';
import { Transactional } from 'src/common/decorators/transaction.decorator';
import { ETagService } from 'src/common/services/etag.service';
import { IQueryOptions } from 'src/common/interfaces/queryOptions.interface';
import { CustomLogger } from 'src/common/utils/logger/logger.service';
import { LogMethod } from 'src/common/decorators/log-method.decorator';
import { UnknownObjectError } from 'src/common/errors/UnknownObjectError';
import { BadRequestError } from 'src/common/errors/BadRequestError';
import { StaffRepository } from '../repositories/staff.repository';
import { StaffResponseDTO } from '../dto/staff.response.dto';
import { CreateStaffDTO } from '../dto/request/create-staff.dto';
import { Status } from 'src/common/constants/enums';
import { Staff } from 'src/common/entities/staff.entity';
import { UUID } from 'crypto';
import { DeepPartial } from 'typeorm';

@Injectable()
export class StaffService {
    private readonly logger: CustomLogger = new CustomLogger();

    constructor(
        private readonly staffRepository: StaffRepository,
        private readonly etagService: ETagService,
        private readonly transactionService: TransactionService,
    ) {
        this.logger.setContext('StaffService');
    }

    /**
     * Retrieves a paginated list of staff based on query options
     * Only returns active records (not deleted or inactive)
     * 
     * @param queryOptionsFromRequest - Query parameters for filtering and pagination
     * @param httpResponse - HTTP response object for setting headers
     * @returns Promise<StaffResponseDTO[]> Array of staff DTOs
     */
    @LogMethod()
    @UseInterceptors(CacheInterceptor)
    @CacheKey('all-staff')
    @CacheTTL(3600)
    async getAllStaff(
        queryOptionsFromRequest: IQueryOptions,
        httpResponse: any,
    ): Promise<StaffResponseDTO[]> {
        const cacheKey = 'all-staff';
        this.logger.log('Starting process to retrieve all staff', { cacheKey });

        // [Step-1]: Retrieve staff from repository with active status filter
        const [staffFromDatabase, totalStaffCount]: [any[], number] = 
            await this.staffRepository.findAllBy(queryOptionsFromRequest, { status: Status.ACTIVE });

        // [Step-2]: Handle empty result set
        if (!staffFromDatabase || staffFromDatabase.length === 0) {
            this.logger.log('No staff found matching the criteria');
            return [];
        }

        // [Step-3]: Set total count header if requested
        if (queryOptionsFromRequest.totalCount) {
            httpResponse.setHeader('Total-Count', totalStaffCount.toString());
            this.logger.log(`Set Total-Count header: ${totalStaffCount}`);
        }

        // [Step-4]: Transform entities to DTOs
        const staffDTOsForResponse: StaffResponseDTO[] = staffFromDatabase.map(
            staff => new StaffResponseDTO(staff)
        );

        this.logger.log(`Successfully retrieved ${staffDTOsForResponse.length} staff`);
        return staffDTOsForResponse;
    }

    /**
     * Retrieves a specific staff by their identifier
     * Only returns active records (not deleted or inactive)
     * 
     * @param id - The Staff unique system identifier
     * @param httpResponse - HTTP response object for setting ETag headers
     * @returns Promise<StaffResponseDTO> Single staff DTO
     * @throws BadRequestError if staff ID is invalid
     * @throws UnknownObjectError if staff is not found or not active
     */
    @LogMethod()
    @UseInterceptors(CacheInterceptor)
    @CacheKey('staff-by-id')
    @CacheTTL(3600)
    async getStaffById(
        id: string,
        httpResponse: any,
    ): Promise<StaffResponseDTO> {
        this.logger.log('Starting process to retrieve staff by ID', { id });

        // [Step-1]: Validate input parameters
        if (!id?.trim()) {
            throw new BadRequestError('Staff ID is required');
        }

        // [Step-2]: Retrieve staff from repository with active status filter
        const staffFromDatabase = await this.staffRepository.findById(id as UUID, Status.ACTIVE);

        // [Step-3]: Handle staff not found
        if (!staffFromDatabase) {
            this.logger.warn(`Staff with ID ${id} not found or not active`);
            throw new UnknownObjectError(`Staff with ID ${id} not found`);
        }

        // [Step-4]: Transform to DTO and set ETag header
        const staffDTOForResponse: StaffResponseDTO = new StaffResponseDTO(staffFromDatabase);
        httpResponse.setHeader('ETag', staffDTOForResponse._etag);

        this.logger.log(`Successfully retrieved staff with ID ${id}`);
        return staffDTOForResponse;
    }

    /**
     * Creates a Staff entity from the validated request DTO
     * Maps all required fields and performs necessary type conversions
     * 
     * @param createStaffRequest - The validated create staff request
     * @returns Staff - The staff entity ready to be saved
     */
    private createStaffEntityFromRequest(createStaffRequest: CreateStaffDTO): Staff {
        const staff = new Staff();
        
        // Required fields
        staff.id = createStaffRequest.id;
        staff.staffUniqueId = createStaffRequest.staffUniqueId;
        staff.firstName = createStaffRequest.firstName;
        staff.lastSurname = createStaffRequest.lastSurname;
        
        // Person reference
        if (createStaffRequest.personReference) {
            staff.personId = createStaffRequest.personReference.personId;
            staff.sourceSystemDescriptorId = createStaffRequest.personReference.sourceSystemDescriptor ? 
                parseInt(createStaffRequest.personReference.sourceSystemDescriptor) : null;
        }

        // Optional name fields
        staff.personalTitlePrefix = createStaffRequest.personalTitlePrefix;
        staff.middleName = createStaffRequest.middleName;
        staff.preferredFirstName = createStaffRequest.preferredFirstName;
        staff.preferredLastSurname = createStaffRequest.preferredLastSurname;
        staff.generationCodeSuffix = createStaffRequest.generationCodeSuffix;
        staff.maidenName = createStaffRequest.maidenName;

        // Descriptor IDs - assuming these are numeric IDs in string format
        staff.sexDescriptorId = createStaffRequest.sexDescriptor ? 
            parseInt(createStaffRequest.sexDescriptor) : null;
        staff.oldEthnicityDescriptorId = createStaffRequest.oldEthnicityDescriptor ? 
            parseInt(createStaffRequest.oldEthnicityDescriptor) : null;
        staff.citizenshipStatusDescriptorId = createStaffRequest.citizenshipStatusDescriptor ? 
            parseInt(createStaffRequest.citizenshipStatusDescriptor) : null;
        staff.highestCompletedLevelOfEducationDescriptorId = createStaffRequest.highestCompletedLevelOfEducationDescriptor ? 
            parseInt(createStaffRequest.highestCompletedLevelOfEducationDescriptor) : null;

        // Other fields
        staff.birthDate = createStaffRequest.birthDate ? new Date(createStaffRequest.birthDate) : null;
        staff.hispanicLatinoEthnicity = createStaffRequest.hispanicLatinoEthnicity;
        staff.loginId = createStaffRequest.loginId;
        staff.highlyQualifiedTeacher = createStaffRequest.highlyQualifiedTeacher;
        staff.yearsOfPriorProfessionalExperience = createStaffRequest.yearsOfPriorProfessionalExperience;
        staff.yearsOfPriorTeachingExperience = createStaffRequest.yearsOfPriorTeachingExperience;

        return staff;
    }

    @LogMethod()
    @Transactional()
    async createStaff(
        createStaffRequest: CreateStaffDTO,
        ifNoneMatchHeader: string,
    ): Promise<void> {
        return this.transactionService.executeInTransaction(async (queryRunner) => {
            this.logger.log('Starting process to create staff');

            // [Step-1]: Check for existing record by staffUniqueId (unique constraint)
            const existingStaffByUniqueId = await this.staffRepository.findByUniqueId(createStaffRequest.staffUniqueId);
            if (existingStaffByUniqueId) {
                this.logger.warn(`Staff with unique ID ${createStaffRequest.staffUniqueId} already exists`);
                throw new BadRequestError(`Staff record already exists with staffUniqueId: ${createStaffRequest.staffUniqueId}`);
            }

            // [Step-2]: Validate all foreign key references
            await this.validateForeignKeyReferences(createStaffRequest);

            // [Step-3]: Create staff entity from validated request
            const staffEntityToSave = this.createStaffEntityFromRequest(createStaffRequest);

            // [Step-4]: Save new staff using transaction repository
            const repository = this.transactionService.getRepository(Staff, queryRunner);
            await repository.save(staffEntityToSave);

            this.logger.log('Successfully created staff');
        });
    }

    /**
     * Validates all foreign key references in the create staff request
     * 
     * @param createStaffRequest - The request containing foreign key references
     * @throws BadRequestError if any foreign key reference is invalid
     */
    private async validateForeignKeyReferences(
        createStaffRequest: CreateStaffDTO,
    ): Promise<void> {
        // Validate sex descriptor if provided
        if (createStaffRequest.sexDescriptor) {
            const descriptorId = parseInt(createStaffRequest.sexDescriptor);
            if (isNaN(descriptorId)) {
                throw new BadRequestError(`Invalid sex descriptor ID: ${createStaffRequest.sexDescriptor}`);
            }
            const isValid = await this.staffRepository.validateSexDescriptor(descriptorId);
            if (!isValid) {
                throw new BadRequestError(`Sex descriptor not found with ID: ${descriptorId}`);
            }
        }

        // Validate old ethnicity descriptor if provided
        if (createStaffRequest.oldEthnicityDescriptor) {
            const descriptorId = parseInt(createStaffRequest.oldEthnicityDescriptor);
            if (isNaN(descriptorId)) {
                throw new BadRequestError(`Invalid old ethnicity descriptor ID: ${createStaffRequest.oldEthnicityDescriptor}`);
            }
            const isValid = await this.staffRepository.validateOldEthnicityDescriptor(descriptorId);
            if (!isValid) {
                throw new BadRequestError(`Old ethnicity descriptor not found with ID: ${descriptorId}`);
            }
        }

        // Validate citizenship status descriptor if provided
        if (createStaffRequest.citizenshipStatusDescriptor) {
            const descriptorId = parseInt(createStaffRequest.citizenshipStatusDescriptor);
            if (isNaN(descriptorId)) {
                throw new BadRequestError(`Invalid citizenship status descriptor ID: ${createStaffRequest.citizenshipStatusDescriptor}`);
            }
            const isValid = await this.staffRepository.validateCitizenshipStatusDescriptor(descriptorId);
            if (!isValid) {
                throw new BadRequestError(`Citizenship status descriptor not found with ID: ${descriptorId}`);
            }
        }

        // Validate highest completed level of education descriptor if provided
        if (createStaffRequest.highestCompletedLevelOfEducationDescriptor) {
            const descriptorId = parseInt(createStaffRequest.highestCompletedLevelOfEducationDescriptor);
            if (isNaN(descriptorId)) {
                throw new BadRequestError(`Invalid level of education descriptor ID: ${createStaffRequest.highestCompletedLevelOfEducationDescriptor}`);
            }
            const isValid = await this.staffRepository.validateLevelOfEducationDescriptor(descriptorId);
            if (!isValid) {
                throw new BadRequestError(`Level of education descriptor not found with ID: ${descriptorId}`);
            }
        }
    }

    /**
     * Deletes a staff by their identifier (soft delete)
     * 
     * @param id - Staff identifier as string from request
     * @param ifMatchHeader - Required ETag header for concurrency control
     * @returns Promise<void> No return value for successful deletion
     * @throws BadRequestError if staff ID is invalid
     * @throws UnknownObjectError if staff is not found
     */
    @LogMethod()
    async deleteStaff(
        id: string,
        ifMatchHeader: string,
    ): Promise<void> {
        this.logger.log('Starting process to delete staff');

        // [Step-1]: Retrieve existing staff for validation
        const existingStaffFromDatabase: Staff | null = 
            await this.staffRepository.findById(id as UUID);

        // [Step-2]: Handle staff not found
        if (!existingStaffFromDatabase) {
            this.logger.warn(`Staff with ID ${id} not found for deletion`);
            throw new UnknownObjectError(`Staff with ID ${id} not found`);
        }

        // [Step-3]: Validate ETag for concurrency control
        const existingStaffDTO: StaffResponseDTO = new StaffResponseDTO(existingStaffFromDatabase);
        this.etagService.validateIfMatch(ifMatchHeader, existingStaffDTO._etag);

        // [Step-4]: Perform soft deletion
        const deletionSuccessful: boolean = await this.staffRepository.deleteStaff(id);

        // [Step-5]: Handle deletion failure
        if (!deletionSuccessful) {
            this.logger.error(`Failed to delete staff with ID ${id}`);
            throw new UnknownObjectError(`Failed to delete staff with ID ${id}`);
        }

        this.logger.log(`Successfully deleted staff with ID ${id}`);
    }
} 