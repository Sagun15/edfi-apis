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
import { Status } from 'src/common/constants/enums';
import { CourseRepository } from '../repositories/course.repository';
import { CourseDTO } from '../dto/course.dto';
import { CreateCourseDTO } from '../dto/request/create-course.dto';
import { Course } from 'src/common/entities/course.entity';
import { AcademicSubjectDescriptor } from 'src/common/entities/academic-subject-descriptor.entity';
import { CareerPathwayDescriptor } from 'src/common/entities/career-pathway-descriptor.entity';
import { CourseDefinedByDescriptor } from 'src/common/entities/course-defined-by-descriptor.entity';
import { CourseGPAApplicabilityDescriptor } from 'src/common/entities/course-gpa-applicability-descriptor.entity';
import { CreditTypeDescriptor } from 'src/common/entities/credit-type-descriptor.entity';
import { EducationOrganization } from 'src/common/entities/education-organization.entity';

@Injectable()
export class CourseService {
    private readonly logger: CustomLogger = new CustomLogger();

    constructor(
        private readonly courseRepository: CourseRepository,
        private readonly etagService: ETagService,
        private readonly transactionService: TransactionService,
    ) {
        this.logger.setContext('CourseService');
    }

    /**
     * Retrieves a paginated list of courses based on query options
     * Only returns active records (not deleted or inactive)
     * 
     * @param queryOptionsFromRequest - Query parameters for filtering and pagination
     * @param httpResponse - HTTP response object for setting headers
     * @returns Promise<CourseDTO[]> Array of course DTOs
     */
    @LogMethod()
    @UseInterceptors(CacheInterceptor)
    @CacheKey('all-courses')
    @CacheTTL(3600)
    async getAllCourses(
        queryOptionsFromRequest: IQueryOptions,
        httpResponse: GenericResponse,
    ): Promise<CourseDTO[]> {
        const cacheKey = 'all-courses';
        this.logger.log('Starting process to retrieve all courses', { cacheKey });

        // [Step-1]: Retrieve courses from repository with active status filter
        const [coursesFromDatabase, totalCoursesCount] = 
            await this.courseRepository.findAllBy(queryOptionsFromRequest, { status: Status.ACTIVE });

        // [Step-2]: Handle empty result set
        if (!coursesFromDatabase || coursesFromDatabase.length === 0) {
            this.logger.log('No courses found matching the criteria');
            return [];
        }

        // [Step-3]: Set total count header if requested
        if (queryOptionsFromRequest.totalCount) {
            httpResponse.setHeader('Total-Count', totalCoursesCount.toString());
            this.logger.log(`Set Total-Count header: ${totalCoursesCount}`);
        }

        // [Step-4]: Transform entities to DTOs
        const courseDTOs = coursesFromDatabase.map(course => new CourseDTO(course));

        this.logger.log(`Successfully retrieved ${courseDTOs.length} courses`);
        return courseDTOs;
    }

    /**
     * Retrieves a specific course by its identifier
     * Only returns active records (not deleted or inactive)
     * 
     * @param id - The resource identifier in format "courseCode:educationOrganizationId"
     * @param httpResponse - HTTP response object for setting ETag headers
     * @returns Promise<CourseDTO> Single course DTO
     * @throws BadRequestError if course ID is invalid
     * @throws UnknownObjectError if course is not found or not active
     */
    @LogMethod()
    @UseInterceptors(CacheInterceptor)
    @CacheKey('course-by-id')
    @CacheTTL(3600)
    async getCourseById(
        id: string,
        httpResponse: GenericResponse,
    ): Promise<CourseDTO> {
        this.logger.log('Starting process to retrieve course by ID', { id });

        // [Step-1]: Validate input parameters
        if (!id?.trim()) {
            throw new BadRequestError('Course ID is required');
        }

        // [Step-2]: Retrieve course from repository with active status filter
        const courseFromDatabase = await this.courseRepository.findById(id, Status.ACTIVE);

        // [Step-3]: Handle course not found or not active
        if (!courseFromDatabase) {
            this.logger.warn(`Course with ID ${id} not found or not active`);
            throw new UnknownObjectError(`Course with ID ${id} not found`);
        }

        // [Step-4]: Transform to DTO and set ETag header
        const courseDTO = new CourseDTO(courseFromDatabase);
        httpResponse.setHeader('ETag', courseDTO._etag);

        this.logger.log(`Successfully retrieved course with ID ${id}`);
        return courseDTO;
    }

    /**
     * Creates a new course resource
     * 
     * **IMPORTANT**: This method performs comprehensive validation:
     * - Checks if record exists by composite key
     * - Validates all foreign key references
     * - Throws BadRequestError if any constraint violation or invalid foreign key is found
     * 
     * @param createCourseRequest - Validated course data from request
     * @param ifNoneMatchHeader - Optional ETag header (not used in validation)
     * @returns Promise<void> No return value for successful creation
     * @throws BadRequestError for constraint violations, validation errors, or invalid foreign keys
     */
    @LogMethod()
    @Transactional()
    async createCourse(
        createCourseRequest: CreateCourseDTO,
        ifNoneMatchHeader: string,
    ): Promise<void> {
        return this.transactionService.executeInTransaction(async (queryRunner) => {
            this.logger.log('Starting process to create course');

            // [Step-1]: Check if record exists by ID
            if (createCourseRequest.id) {
                const existingById = await this.courseRepository.findById(createCourseRequest.id);
                if (existingById) {
                    this.logger.warn(`Course already exists with ID: ${createCourseRequest.id}`);
                    throw new BadRequestError(`Cannot create course: Record already exists with ID ${createCourseRequest.id}`);
                }
            }

            // [Step-2]: Check for existing record by composite key
            const existingCourse = await this.courseRepository.findByCompositeKey(
                createCourseRequest.courseCode,
                createCourseRequest.educationOrganizationReference.educationOrganizationId
            );

            if (existingCourse) {
                this.logger.warn('Course already exists with the same composite key');
                throw new BadRequestError('Course already exists with the same courseCode and educationOrganizationId combination');
            }

            // [Step-3]: Validate all foreign key references
            await this.validateForeignKeyReferences(createCourseRequest, queryRunner);

            // [Step-4]: Create course entity from validated request
            const courseEntityToSave = new Course();
            Object.assign(courseEntityToSave, {
                ...createCourseRequest,
                educationOrganizationId: createCourseRequest.educationOrganizationReference.educationOrganizationId,
                status: Status.ACTIVE,
                createdate: new Date(),
                lastmodifieddate: new Date()
            });

            // [Step-5]: Save new course using transaction repository
            const repository = this.transactionService.getRepository(Course, queryRunner);
            await repository.save(courseEntityToSave);

            this.logger.log('Successfully created course');
        });
    }

    /**
     * Deletes a course by their identifier (soft delete)
     * 
     * @param id - Course UUID from base table
     * @param ifMatchHeader - Required ETag header for concurrency control
     * @returns Promise<void> No return value for successful deletion
     * @throws BadRequestError if course ID is invalid
     * @throws UnknownObjectError if course is not found
     */
    @LogMethod()
    async deleteCourse(
        id: string,
        ifMatchHeader: string,
    ): Promise<void> {
        this.logger.log('Starting process to delete course');

        // [Step-1]: Validate input parameters
        if (!id?.trim()) {
            throw new BadRequestError('Course ID is required');
        }

        // [Step-2]: Retrieve existing course for validation
        const existingCourseFromDatabase = await this.courseRepository.findById(id);

        // [Step-3]: Handle course not found
        if (!existingCourseFromDatabase) {
            this.logger.warn(`Course with ID ${id} not found for deletion`);
            throw new UnknownObjectError(`Course with ID ${id} not found`);
        }

        // [Step-4]: Validate ETag for concurrency control
        const existingCourseDTO = new CourseDTO(existingCourseFromDatabase);
        this.etagService.validateIfMatch(ifMatchHeader, existingCourseDTO._etag);

        // [Step-5]: Perform soft deletion
        const deletionSuccessful = await this.courseRepository.deleteCourse(id);

        // [Step-6]: Handle deletion failure
        if (!deletionSuccessful) {
            this.logger.error(`Failed to delete course with ID ${id}`);
            throw new UnknownObjectError(`Failed to delete course with ID ${id}`);
        }

        this.logger.log(`Successfully deleted course with ID ${id}`);
    }

    /**
     * Validates all foreign key references in the create course request
     * **IMPORTANT**: Descriptors should be validated using their numeric IDs
     * 
     * @param createCourseRequest - The request containing foreign key references
     * @param queryRunner - The transaction query runner
     * @throws BadRequestError if any foreign key reference is invalid
     */
    private async validateForeignKeyReferences(
        createCourseRequest: CreateCourseDTO,
        queryRunner: any
    ): Promise<void> {
        // [Step-1]: Validate education organization reference
        const educationOrgRepo = this.transactionService.getRepository(EducationOrganization, queryRunner);
        const educationOrg = await educationOrgRepo.findOne({
            where: { educationOrganizationId: createCourseRequest.educationOrganizationReference.educationOrganizationId }
        });
        if (!educationOrg) {
            throw new BadRequestError(`Invalid education organization ID: ${createCourseRequest.educationOrganizationReference.educationOrganizationId}`);
        }

        // [Step-2]: Validate academic subject descriptors
        const academicSubjectRepo = this.transactionService.getRepository(AcademicSubjectDescriptor, queryRunner);
        for (const subject of createCourseRequest.academicSubjects) {
            const academicSubject = await academicSubjectRepo.findOne({
                where: { academicSubjectDescriptorId: parseInt(subject.academicSubjectDescriptor) }
            });
            if (!academicSubject) {
                throw new BadRequestError(`Invalid academic subject descriptor: ${subject.academicSubjectDescriptor}`);
            }
        }

        // [Step-3]: Validate career pathway descriptor if provided
        if (createCourseRequest.careerPathwayDescriptor) {
            const careerPathwayRepo = this.transactionService.getRepository(CareerPathwayDescriptor, queryRunner);
            const careerPathway = await careerPathwayRepo.findOne({
                where: { careerPathwayDescriptorId: parseInt(createCourseRequest.careerPathwayDescriptor) }
            });
            if (!careerPathway) {
                throw new BadRequestError(`Invalid career pathway descriptor: ${createCourseRequest.careerPathwayDescriptor}`);
            }
        }

        // [Step-4]: Validate course defined by descriptor if provided
        if (createCourseRequest.courseDefinedByDescriptor) {
            const courseDefinedByRepo = this.transactionService.getRepository(CourseDefinedByDescriptor, queryRunner);
            const courseDefinedBy = await courseDefinedByRepo.findOne({
                where: { courseDefinedByDescriptorId: parseInt(createCourseRequest.courseDefinedByDescriptor) }
            });
            if (!courseDefinedBy) {
                throw new BadRequestError(`Invalid course defined by descriptor: ${createCourseRequest.courseDefinedByDescriptor}`);
            }
        }

        // [Step-5]: Validate course GPA applicability descriptor if provided
        if (createCourseRequest.courseGPAApplicabilityDescriptor) {
            const courseGPARepo = this.transactionService.getRepository(CourseGPAApplicabilityDescriptor, queryRunner);
            const courseGPA = await courseGPARepo.findOne({
                where: { courseGPAApplicabilityDescriptorId: parseInt(createCourseRequest.courseGPAApplicabilityDescriptor) }
            });
            if (!courseGPA) {
                throw new BadRequestError(`Invalid course GPA applicability descriptor: ${createCourseRequest.courseGPAApplicabilityDescriptor}`);
            }
        }

        // [Step-6]: Validate credit type descriptors if provided
        if (createCourseRequest.minimumAvailableCreditTypeDescriptor) {
            const creditTypeRepo = this.transactionService.getRepository(CreditTypeDescriptor, queryRunner);
            const minCreditType = await creditTypeRepo.findOne({
                where: { creditTypeDescriptorId: parseInt(createCourseRequest.minimumAvailableCreditTypeDescriptor) }
            });
            if (!minCreditType) {
                throw new BadRequestError(`Invalid minimum available credit type descriptor: ${createCourseRequest.minimumAvailableCreditTypeDescriptor}`);
            }
        }

        if (createCourseRequest.maximumAvailableCreditTypeDescriptor) {
            const creditTypeRepo = this.transactionService.getRepository(CreditTypeDescriptor, queryRunner);
            const maxCreditType = await creditTypeRepo.findOne({
                where: { creditTypeDescriptorId: parseInt(createCourseRequest.maximumAvailableCreditTypeDescriptor) }
            });
            if (!maxCreditType) {
                throw new BadRequestError(`Invalid maximum available credit type descriptor: ${createCourseRequest.maximumAvailableCreditTypeDescriptor}`);
            }
        }
    }
} 