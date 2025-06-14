import { Injectable, UseInterceptors } from '@nestjs/common';
import { CourseOfferingRepository } from '../repositories/course-offerings.repository';
import { CourseOfferingDTO } from '../dto/course-offering.dto';
import { CreateCourseOfferingDTO } from '../dto/request/course-offering.request.dto';
import { CustomLogger } from '../../../common/utils/logger/logger.service';
import { IQueryOptions } from '../../../common/interfaces/queryOptions.interface';
import { GenericResponse } from '../../../common/decorators/genericResponse.decorator';
import { BadRequestError } from '../../../common/errors/BadRequestError';
import { UnknownObjectError } from '../../../common/errors/UnknownObjectError';
import { ETagService } from '../../../common/services/etag.service';
import { TransactionService } from '../../../common/services/transaction.service';
import { CourseOffering } from '../../../common/entities/course-offering.entity';
import { LogMethod } from '../../../common/decorators/log-method.decorator';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { Transactional } from '../../../common/decorators/transaction.decorator';

/**
 * CourseOffering Service
 * 
 * Contains all business logic for course offering operations including validation,
 * data transformation, and error handling. This service acts as the business
 * layer between the controller and repository.
 */
@Injectable()
export class CourseOfferingService {
    private readonly logger: CustomLogger = new CustomLogger();

    constructor(
        private readonly courseOfferingRepository: CourseOfferingRepository,
        private readonly etagService: ETagService,
        private readonly transactionService: TransactionService,
    ) {
        this.logger.setContext('CourseOfferingService');
    }

    /**
     * Retrieves a paginated list of course offerings based on query options
     * 
     * @param queryOptionsFromRequest - Query parameters for filtering and pagination
     * @param httpResponse - HTTP response object for setting headers
     * @returns Promise<CourseOfferingDTO[]> Array of course offering DTOs
     */
    @LogMethod()
    @UseInterceptors(CacheInterceptor)
    @CacheKey('all-course-offerings')
    @CacheTTL(3600)
    async getAllCourseOfferings(
        queryOptionsFromRequest: IQueryOptions,
        httpResponse: GenericResponse,
    ): Promise<CourseOfferingDTO[]> {
        const cacheKey = `all-course-offerings`;
        this.logger.log('Starting process to retrieve all course offerings', { cacheKey });

        // [Step-1]: Retrieve course offerings from repository
        const [courseOfferingsFromDatabase, totalCourseOfferingsCount] = 
            await this.courseOfferingRepository.findAllBy(queryOptionsFromRequest, {});

        // [Step-2]: Handle empty result set
        if (!courseOfferingsFromDatabase || courseOfferingsFromDatabase.length === 0) {
            this.logger.log('No course offerings found matching the criteria');
            return [];
        }

        // [Step-3]: Set total count header if requested
        if (queryOptionsFromRequest.totalCount) {
            httpResponse.setHeader('Total-Count', totalCourseOfferingsCount.toString());
            this.logger.log(`Set Total-Count header: ${totalCourseOfferingsCount}`);
        }

        // [Step-4]: Transform entities to DTOs
        const courseOfferingDTOsForResponse = await Promise.all(
            courseOfferingsFromDatabase.map(courseOffering => CourseOfferingDTO.fromEntity(courseOffering))
        );

        this.logger.log(`Successfully retrieved ${courseOfferingDTOsForResponse.length} course offerings`);
        return courseOfferingDTOsForResponse;
    }

    /**
     * Retrieves a specific course offering by its identifier
     * 
     * @param courseOfferingIdFromRequest - Course offering identifier as string from request
     * @param httpResponse - HTTP response object for setting ETag headers
     * @returns Promise<CourseOfferingDTO> Single course offering DTO
     * @throws UnknownObjectError if course offering is not found
     */
    @LogMethod()
    @UseInterceptors(CacheInterceptor)
    @CacheKey('course-offering-by-id')
    @CacheTTL(3600)
    async getCourseOfferingById(
        courseOfferingIdFromRequest: string,
        httpResponse: GenericResponse,
    ): Promise<CourseOfferingDTO> {
        const cacheKey = `course-offering-by-id`;
        this.logger.log('Starting process to retrieve course offering by ID', { cacheKey });

        // [Step-1]: Retrieve course offering from repository
        const courseOfferingFromDatabase = await this.courseOfferingRepository.findById(courseOfferingIdFromRequest);

        // [Step-2]: Handle course offering not found
        if (!courseOfferingFromDatabase) {
            this.logger.warn(`Course offering with ID ${courseOfferingIdFromRequest} not found`);
            throw new UnknownObjectError(`Course offering with ID ${courseOfferingIdFromRequest} not found`);
        }

        // [Step-3]: Transform to DTO and set ETag header
        const courseOfferingDTOForResponse = await CourseOfferingDTO.fromEntity(courseOfferingFromDatabase);
        httpResponse.setHeader('ETag', courseOfferingDTOForResponse._etag);

        this.logger.log(`Successfully retrieved course offering with ID ${courseOfferingIdFromRequest}`);
        return courseOfferingDTOForResponse;
    }

    /**
     * Creates or updates a course offering resource (upsert operation)
     * 
     * @param createCourseOfferingRequest - Validated course offering data from request
     * @param ifNoneMatchHeader - Optional ETag header for preventing duplicates
     * @returns Promise<void> No return value for successful creation/update
     * @throws BadRequestError for validation errors
     * @throws ConflictError for ETag mismatches or duplicate key violations
     */
    @LogMethod()
    @Transactional()
    async createCourseOffering(
        createCourseOfferingRequest: CreateCourseOfferingDTO,
        ifNoneMatchHeader: string,
    ): Promise<void> {
        return this.transactionService.executeInTransaction(async (queryRunner) => {
            this.logger.log('Starting process to create/update course offering');

            // [Step-1]: Check for existing course offering (for upsert behavior)
            const existingCourseOffering = await this.courseOfferingRepository.findByNaturalKey(
                createCourseOfferingRequest.localCourseCode,
                createCourseOfferingRequest.schoolId,
                createCourseOfferingRequest.schoolYear,
                createCourseOfferingRequest.sessionName
            );

            // [Step-2]: Validate ETag if provided and course offering exists
            if (ifNoneMatchHeader && existingCourseOffering) {
                const existingCourseOfferingDTO = await CourseOfferingDTO.fromEntity(existingCourseOffering);
                this.etagService.validateIfNoneMatch(ifNoneMatchHeader, existingCourseOfferingDTO._etag);
            }

            // [Step-3]: Create course offering entity from validated request
            const courseOfferingEntityToSave = new CourseOffering();
            Object.assign(courseOfferingEntityToSave, {
                ...createCourseOfferingRequest,
                id: existingCourseOffering?.id
            });

            // Use transaction repository
            const repository = this.transactionService.getRepository(CourseOffering, queryRunner);

            if (existingCourseOffering) {
                // [Step-4a]: Update existing course offering (upsert behavior)
                this.logger.log('Course offering exists, performing update operation');
                await repository.save({
                    ...existingCourseOffering,
                    ...courseOfferingEntityToSave
                });
            } else {
                // [Step-4b]: Create new course offering
                this.logger.log('Course offering does not exist, performing create operation');
                await repository.save(courseOfferingEntityToSave);
            }

            this.logger.log(`Successfully processed course offering with local code ${createCourseOfferingRequest.localCourseCode}`);
        });
    }

    /**
     * Deletes a course offering by its identifier
     * 
     * @param courseOfferingIdFromRequest - Course offering identifier as string from request
     * @param ifMatchHeader - Required ETag header for concurrency control
     * @returns Promise<void> No return value for successful deletion
     * @throws BadRequestError if course offering ID is invalid or ETag is missing
     * @throws UnknownObjectError if course offering is not found
     */
    @LogMethod()
    async deleteCourseOffering(
        courseOfferingIdFromRequest: string,
        ifMatchHeader: string,
    ): Promise<void> {
        this.logger.log('Starting process to delete course offering');

        // [Step-1]: Validate ETag header presence
        if (!ifMatchHeader?.trim()) {
            throw new BadRequestError('If-Match header is required for delete operations');
        }

        // [Step-2]: Retrieve existing course offering for validation
        const existingCourseOffering = await this.courseOfferingRepository.findById(courseOfferingIdFromRequest);

        // [Step-3]: Handle course offering not found
        if (!existingCourseOffering) {
            this.logger.warn(`Course offering with ID ${courseOfferingIdFromRequest} not found for deletion`);
            throw new UnknownObjectError(`Course offering with ID ${courseOfferingIdFromRequest} not found`);
        }

        // [Step-4]: Validate ETag for concurrency control
        const existingCourseOfferingDTO = await CourseOfferingDTO.fromEntity(existingCourseOffering);
        this.etagService.validateIfMatch(ifMatchHeader, existingCourseOfferingDTO._etag);

        // [Step-5]: Perform deletion
        const deletionSuccessful = await this.courseOfferingRepository.deleteCourseOffering(courseOfferingIdFromRequest);

        // [Step-6]: Handle deletion failure
        if (!deletionSuccessful) {
            this.logger.error(`Failed to delete course offering with ID ${courseOfferingIdFromRequest}`);
            throw new UnknownObjectError(`Failed to delete course offering with ID ${courseOfferingIdFromRequest}`);
        }

        this.logger.log(`Successfully deleted course offering with ID ${courseOfferingIdFromRequest}`);
    }
} 