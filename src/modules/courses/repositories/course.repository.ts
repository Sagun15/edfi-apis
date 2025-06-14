import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { IQueryOptions } from 'src/common/interfaces/queryOptions.interface';
import { LogMethod } from 'src/common/decorators/log-method.decorator';
import BaseRepository from 'src/common/repositories/baseRepository.repository';
import { Course } from 'src/common/entities/course.entity';
import { CustomLogger } from 'src/common/utils/logger/logger.service';
import { Status } from 'src/common/constants/enums';
import { UUID } from 'crypto';

@Injectable()
export class CourseRepository extends BaseRepository<Course> {
    protected readonly logger: CustomLogger = new CustomLogger();

    constructor(
        @InjectRepository(Course)
        private readonly courseRepository: Repository<Course>,
    ) {
        super(courseRepository);
        this.logger.setContext('CourseRepository');
    }

    /**
     * Fetches an array of Course entities along with the total count, using the
     * provided IQueryOptions and FindOptionsWhere as filters.
     * **IMPORTANT**: This method properly handles lazy-loaded foreign relationships.
     *
     * @param queryOptions - The IQueryOptions object that contains the limit, offset parameters
     * @param whereConditions - The FindOptionsWhere object that contains the conditions for the where clause
     * @returns Promise<[Course[], number]> A tuple containing an array of Course entities 
     *                                     and the total count matching the criteria
     */
    @LogMethod()
    async findAllBy(
        queryOptions: IQueryOptions,
        whereConditions: FindOptionsWhere<Course>,
    ): Promise<[Course[], number]> {
        const { limit, offset } = queryOptions;

        this.logger.log('Executing findAndCount query for courses', {
            limit,
            offset,
            whereConditions
        });

        // [Step-1]: Execute database query with pagination and filtering
        const [coursesFromDatabase, totalCountFromDatabase]: [Course[], number] = 
            await this.courseRepository.findAndCount({
                where: whereConditions,
                relations: {
                    academicSubjectDescriptor: true,
                    careerPathwayDescriptor: true,
                    courseDefinedByDescriptor: true,
                    courseGPAApplicabilityDescriptor: true,
                    minimumAvailableCreditTypeDescriptor: true,
                    maximumAvailableCreditTypeDescriptor: true,
                    educationOrganization: true,
                },
                skip: offset,
                take: limit,
                order: {
                    courseCode: 'ASC',
                },
            });

        this.logger.log('Successfully executed findAndCount query', {
            foundCourses: coursesFromDatabase.length,
            totalCount: totalCountFromDatabase
        });

        return [coursesFromDatabase, totalCountFromDatabase];
    }

    /**
     * Finds a single Course entity by their primary identifier
     * **IMPORTANT**: This method properly handles lazy-loaded foreign relationships.
     * 
     * @param id - The base table UUID
     * @param status - Optional status filter
     * @returns Promise<Course | null> The Course entity if found, null otherwise
     */
    @LogMethod()
    async findById(id: string, status?: Status): Promise<Course | null> {
        this.logger.log('Executing findOne query by ID', { id });

        // [Step-1]: Build where conditions
        const whereConditions: FindOptionsWhere<Course> = {
            id: id as UUID,
            ...(status && { status }),
        };

        // [Step-2]: Execute database query
        const courseFromDatabase: Course | null = await this.courseRepository.findOne({
            where: whereConditions,
            relations: {
                academicSubjectDescriptor: true,
                careerPathwayDescriptor: true,
                courseDefinedByDescriptor: true,
                courseGPAApplicabilityDescriptor: true,
                minimumAvailableCreditTypeDescriptor: true,
                maximumAvailableCreditTypeDescriptor: true,
                educationOrganization: true,
            }
        });

        this.logger.log('Completed findOne query by ID', {
            id,
            found: !!courseFromDatabase
        });

        return courseFromDatabase;
    }

    /**
     * Finds a Course entity by composite key for constraint validation
     * Used for constraint validation in create operations
     * 
     * @param courseCode - The course code
     * @param educationOrganizationId - The education organization ID
     * @returns Promise<Course | null> The Course entity if found, null otherwise
     */
    @LogMethod()
    async findByCompositeKey(
        courseCode: string,
        educationOrganizationId: number,
    ): Promise<Course | null> {
        this.logger.log('Executing findOne query by composite key', { courseCode, educationOrganizationId });

        const courseFromDatabase: Course | null = await this.courseRepository.findOne({
            where: {
                courseCode,
                educationOrganizationId,
            }
        });

        this.logger.log('Completed findOne query by composite key', {
            courseCode,
            educationOrganizationId,
            found: !!courseFromDatabase
        });

        return courseFromDatabase;
    }

    /**
     * Soft deletes a Course entity by updating status and timestamps
     * 
     * @param id - The base table UUID
     * @returns Promise<boolean> True if deletion was successful, false if no rows were affected
     */
    @LogMethod()
    async deleteCourse(id: string): Promise<boolean> {
        this.logger.log('Executing soft delete operation for course', { id });

        // [Step-1]: Prepare soft delete data
        const updateData = {
            status: Status.DELETED,
            deletedate: new Date(),
            lastmodifieddate: new Date()
        };

        // [Step-2]: Execute soft delete operation
        const updateResult = await this.courseRepository.update(
            { id: id as UUID },
            updateData
        );

        // [Step-3]: Determine if deletion was successful based on affected rows
        const deletionWasSuccessful = (updateResult.affected || 0) > 0;

        this.logger.log('Completed soft delete operation for course', {
            id,
            successful: deletionWasSuccessful,
            affectedRows: updateResult.affected
        });

        return deletionWasSuccessful;
    }
} 