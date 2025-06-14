import { Injectable, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { TransactionService } from 'src/common/services/transaction.service';
import { Transactional } from 'src/common/decorators/transaction.decorator';
import { ETagService } from 'src/common/services/etag.service';
import { CustomLogger } from 'src/common/utils/logger/logger.service';
import { LogMethod } from 'src/common/decorators/log-method.decorator';
import { BadRequestError } from 'src/common/errors/BadRequestError';
import { UnknownObjectError } from 'src/common/errors/UnknownObjectError';
import { GradingPeriodRepository } from '../repositories/grading-period.repository';
import { CreateGradingPeriodDTO } from '../dto/request/create-grading-period.dto';
import { GradingPeriod } from 'src/common/entities/gradingPeriod.entity';
import { School } from 'src/common/entities/school.entity';
import { GradingPeriodDescriptor } from 'src/common/entities/descriptors/grading-period.descriptor.entity';
import { Status } from 'src/common/constants/enums';
import { UUID } from 'crypto';
import { IQueryOptions } from 'src/common/interfaces/queryOptions.interface';
import { GenericResponse } from 'src/common/decorators/genericResponse.decorator';
import { GradingPeriodDTO } from '../dto/grading-period.dto';

@Injectable()
export class GradingPeriodService {
    private readonly logger: CustomLogger = new CustomLogger();

    constructor(
        private readonly gradingPeriodRepository: GradingPeriodRepository,
        private readonly transactionService: TransactionService,
        private readonly etagService: ETagService,
    ) {
        this.logger.setContext('GradingPeriodService');
    }

    /**
     * Retrieves a paginated list of grading periods based on query options
     * Only returns active records (not deleted or inactive)
     * 
     * @param queryOptionsFromRequest - Query parameters for filtering and pagination
     * @param httpResponse - HTTP response object for setting headers
     * @returns Promise<GradingPeriodDTO[]> Array of grading period DTOs
     */
    @LogMethod()
    @UseInterceptors(CacheInterceptor)
    @CacheKey('all-grading-periods')
    @CacheTTL(3600)
    async getAllGradingPeriods(
        queryOptionsFromRequest: IQueryOptions,
        httpResponse: GenericResponse,
    ): Promise<GradingPeriodDTO[]> {
        const cacheKey = 'all-grading-periods';
        this.logger.log('Starting process to retrieve all grading periods', { cacheKey });

        // [Step-1]: Retrieve grading periods from repository with active status filter
        const [gradingPeriodsFromDatabase, totalGradingPeriodsCount] = 
            await this.gradingPeriodRepository.findAllBy(queryOptionsFromRequest, { status: Status.ACTIVE });

        // [Step-2]: Handle empty result set
        if (!gradingPeriodsFromDatabase || gradingPeriodsFromDatabase.length === 0) {
            this.logger.log('No grading periods found matching the criteria');
            return [];
        }

        // [Step-3]: Set total count header if requested
        if (queryOptionsFromRequest.totalCount) {
            httpResponse.setHeader('Total-Count', totalGradingPeriodsCount.toString());
            this.logger.log(`Set Total-Count header: ${totalGradingPeriodsCount}`);
        }

        // [Step-4]: Transform entities to DTOs
        const gradingPeriodDTOsForResponse: GradingPeriodDTO[] = 
            gradingPeriodsFromDatabase.map(gradingPeriod => new GradingPeriodDTO(gradingPeriod));

        this.logger.log(`Successfully retrieved ${gradingPeriodDTOsForResponse.length} grading periods`);
        return gradingPeriodDTOsForResponse;
    }

    /**
     * Retrieves a specific grading period by their identifier
     * Only returns active records (not deleted or inactive)
     * 
     * @param gradingPeriodIdFromRequest - GradingPeriod identifier as string from request
     * @param httpResponse - HTTP response object for setting ETag headers
     * @returns Promise<GradingPeriodDTO> Single grading period DTO
     * @throws BadRequestError if grading period ID is invalid
     * @throws UnknownObjectError if grading period is not found or not active
     */
    @LogMethod()
    @UseInterceptors(CacheInterceptor)
    @CacheKey('grading-period-by-id')
    @CacheTTL(3600)
    async getGradingPeriodById(
        gradingPeriodIdFromRequest: string,
        httpResponse: GenericResponse,
    ): Promise<GradingPeriodDTO> {
        this.logger.log('Starting process to retrieve grading period by ID', { gradingPeriodId: gradingPeriodIdFromRequest });

        // [Step-1]: Validate input parameters
        if (!gradingPeriodIdFromRequest?.trim()) {
            throw new BadRequestError('Grading period ID is required');
        }

        // [Step-2]: Retrieve grading period from repository with active status filter
        const gradingPeriodFromDatabase: GradingPeriod | null = 
            await this.gradingPeriodRepository.findOneBy({ 
                id: gradingPeriodIdFromRequest as UUID,
                status: Status.ACTIVE 
            });

        // [Step-3]: Handle grading period not found or not active
        if (!gradingPeriodFromDatabase) {
            this.logger.warn(`Grading period with ID ${gradingPeriodIdFromRequest} not found or not active`);
            throw new UnknownObjectError(`Grading period with ID ${gradingPeriodIdFromRequest} not found`);
        }

        // [Step-4]: Transform to DTO and set ETag header
        const gradingPeriodDTOForResponse: GradingPeriodDTO = new GradingPeriodDTO(gradingPeriodFromDatabase);
        httpResponse.setHeader('ETag', gradingPeriodDTOForResponse._etag);

        this.logger.log(`Successfully retrieved grading period with ID ${gradingPeriodIdFromRequest}`);
        return gradingPeriodDTOForResponse;
    }

    /**
     * Deletes a grading period by their identifier (soft delete)
     * 
     * @param gradingPeriodIdFromRequest - GradingPeriod identifier as string from request
     * @param ifMatchHeader - Required ETag header for concurrency control
     * @returns Promise<void> No return value for successful deletion
     * @throws BadRequestError if grading period ID is invalid
     * @throws UnknownObjectError if grading period is not found
     */
    @LogMethod()
    async deleteGradingPeriod(
        gradingPeriodIdFromRequest: string,
        ifMatchHeader: string,
    ): Promise<void> {
        this.logger.log('Starting process to delete grading period');

        // [Step-1]: Validate input parameters
        if (!gradingPeriodIdFromRequest?.trim()) {
            throw new BadRequestError('Grading period ID is required');
        }

        // [Step-2]: Retrieve existing grading period for validation
        const existingGradingPeriodFromDatabase: GradingPeriod | null = 
            await this.gradingPeriodRepository.findOneBy({ id: gradingPeriodIdFromRequest as UUID });

        // [Step-3]: Handle grading period not found
        if (!existingGradingPeriodFromDatabase) {
            this.logger.warn(`Grading period with ID ${gradingPeriodIdFromRequest} not found for deletion`);
            throw new UnknownObjectError(`Grading period with ID ${gradingPeriodIdFromRequest} not found`);
        }

        // [Step-4]: Validate ETag for concurrency control
        const existingGradingPeriodDTO: GradingPeriodDTO = new GradingPeriodDTO(existingGradingPeriodFromDatabase);
        this.etagService.validateIfMatch(ifMatchHeader, existingGradingPeriodDTO._etag);

        // [Step-5]: Perform soft deletion
        await this.gradingPeriodRepository.delete(gradingPeriodIdFromRequest);

        this.logger.log(`Successfully deleted grading period with ID ${gradingPeriodIdFromRequest}`);
    }

    /**
     * Creates a new grading period resource
     * 
     * **IMPORTANT**: This method performs comprehensive validation:
     * - Checks if record exists by composite key
     * - Validates all foreign key references
     * - Validates date ranges
     * - Throws BadRequestError if any constraint violation or invalid foreign key is found
     * 
     * @param createGradingPeriodRequest - Validated grading period data from request
     * @param ifNoneMatchHeader - Optional ETag header (not used in validation)
     * @returns Promise<void> No return value for successful creation
     * @throws BadRequestError for constraint violations, validation errors, or invalid foreign keys
     */
    @LogMethod()
    @Transactional()
    async createGradingPeriod(
        createGradingPeriodRequest: CreateGradingPeriodDTO,
        ifNoneMatchHeader: string,
    ): Promise<void> {
        return this.transactionService.executeInTransaction(async (queryRunner) => {
            this.logger.log('Starting process to create grading period');

            // [Step-1]: Check if record exists by ID
            if (createGradingPeriodRequest.id) {
                const existingById = await this.gradingPeriodRepository.findOneBy({ 
                    id: createGradingPeriodRequest.id as UUID 
                });
                if (existingById) {
                    this.logger.warn(`Grading period already exists with ID: ${createGradingPeriodRequest.id}`);
                    throw new BadRequestError(`Cannot create grading period: Record already exists with ID ${createGradingPeriodRequest.id}`);
                }
            }

            // [Step-2]: Check for existing record by composite key
            const existingGradingPeriod = await this.gradingPeriodRepository.findByCompositeKey(
                parseInt(createGradingPeriodRequest.gradingPeriodDescriptor),
                createGradingPeriodRequest.periodSequence,
                createGradingPeriodRequest.schoolReference.schoolId,
                createGradingPeriodRequest.schoolYearTypeReference.schoolYear
            );

            if (existingGradingPeriod) {
                this.logger.warn('Grading period already exists with the same composite key');
                throw new BadRequestError('Grading period already exists with the same combination of descriptor, sequence, school, and year');
            }

            // [Step-3]: Validate all foreign key references
            await this.validateForeignKeyReferences(createGradingPeriodRequest, queryRunner);

            // [Step-4]: Validate date ranges
            if (createGradingPeriodRequest.endDate <= createGradingPeriodRequest.beginDate) {
                throw new BadRequestError('End date must be after begin date');
            }

            // [Step-5]: Create and save grading period entity
            const gradingPeriodEntityToSave = this.createGradingPeriodEntity(createGradingPeriodRequest);
            const repository = this.transactionService.getRepository(GradingPeriod, queryRunner);
            await repository.save(gradingPeriodEntityToSave);

            this.logger.log('Successfully created grading period');
        });
    }

    /**
     * Creates a new GradingPeriod entity from the request DTO
     * 
     * @param createGradingPeriodRequest - The validated request DTO
     * @returns GradingPeriod The new entity instance
     */
    private createGradingPeriodEntity(createGradingPeriodRequest: CreateGradingPeriodDTO): GradingPeriod {
        const gradingPeriodEntityToSave = new GradingPeriod();
        Object.assign(gradingPeriodEntityToSave, {
            gradingPeriodDescriptorId: parseInt(createGradingPeriodRequest.gradingPeriodDescriptor),
            gradingPeriodName: createGradingPeriodRequest.gradingPeriodName,
            periodSequence: createGradingPeriodRequest.periodSequence,
            schoolId: createGradingPeriodRequest.schoolReference.schoolId,
            schoolYear: createGradingPeriodRequest.schoolYearTypeReference.schoolYear,
            beginDate: createGradingPeriodRequest.beginDate,
            endDate: createGradingPeriodRequest.endDate,
            totalInstructionalDays: createGradingPeriodRequest.totalInstructionalDays,
            status: Status.ACTIVE,
            createdate: new Date(),
            lastmodifieddate: new Date()
        });

        return gradingPeriodEntityToSave;
    }

    /**
     * Validates all foreign key references in the create grading period request
     * **IMPORTANT**: Descriptors should be validated using their numeric IDs
     * 
     * @param createGradingPeriodRequest - The request containing foreign key references
     * @param queryRunner - The transaction query runner
     * @throws BadRequestError if any foreign key reference is invalid
     */
    private async validateForeignKeyReferences(
        createGradingPeriodRequest: CreateGradingPeriodDTO,
        queryRunner: any
    ): Promise<void> {
        // [Step-1]: Validate grading period descriptor
        const descriptorId = parseInt(createGradingPeriodRequest.gradingPeriodDescriptor);
        const descriptorRepo = this.transactionService.getRepository(GradingPeriodDescriptor, queryRunner);
        const descriptor = await descriptorRepo.findOne({
            where: { gradingPeriodDescriptorId: descriptorId }
        });
        if (!descriptor) {
            throw new BadRequestError(`Invalid grading period descriptor: ${createGradingPeriodRequest.gradingPeriodDescriptor}`);
        }

        // [Step-2]: Validate school
        const schoolRepo = this.transactionService.getRepository(School, queryRunner);
        const school = await schoolRepo.findOne({
            where: { schoolId: createGradingPeriodRequest.schoolReference.schoolId }
        });
        if (!school) {
            throw new BadRequestError(`Invalid school ID: ${createGradingPeriodRequest.schoolReference.schoolId}`);
        }
    }
} 