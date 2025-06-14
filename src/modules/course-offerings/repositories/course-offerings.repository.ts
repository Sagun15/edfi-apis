import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { CourseOffering } from '../../../common/entities/course-offering.entity';
import BaseRepository from '../../../common/repositories/baseRepository.repository';
import { CustomLogger } from '../../../common/utils/logger/logger.service';
import { IQueryOptions } from '../../../common/interfaces/queryOptions.interface';
import { LogMethod } from '../../../common/decorators/log-method.decorator';

/**
 * CourseOffering Repository
 * 
 * Handles all database operations for CourseOffering entities.
 * This repository follows the data access layer pattern and only contains
 * database interaction logic without any business rules or error handling.
 */
@Injectable()
export class CourseOfferingRepository extends BaseRepository<CourseOffering> {
    constructor(
        @InjectRepository(CourseOffering)
        private readonly courseOfferingRepository: Repository<CourseOffering>,
    ) {
        super(courseOfferingRepository);
        this.logger.setContext('CourseOfferingRepository');
    }

    /**
     * Fetches an array of CourseOffering entities along with the total count, using the
     * provided IQueryOptions and FindOptionsWhere as filters.
     * The method will return an array of CourseOffering entities and the total count.
     *
     * @param queryOptions - The IQueryOptions object that contains the limit, offset parameters
     * @param whereConditions - The FindOptionsWhere object that contains the conditions for the where clause
     * @returns Promise<[CourseOffering[], number]> A tuple containing an array of CourseOffering entities 
     *                                              and the total count matching the criteria
     */
    @LogMethod()
    async findAllBy(
        queryOptions: IQueryOptions,
        whereConditions: FindOptionsWhere<CourseOffering>,
    ): Promise<[CourseOffering[], number]> {
        const { limit, offset } = queryOptions;

        this.logger.log('Executing findAndCount query for course offerings', {
            limit,
            offset,
            whereConditions
        });

        const [courseOfferingsFromDatabase, totalCountFromDatabase] = await this.courseOfferingRepository.findAndCount({
            where: whereConditions,
            skip: offset,
            take: limit,
            order: {
                id: 'ASC',
            },
        });

        this.logger.log('Successfully executed findAndCount query', {
            foundCourseOfferings: courseOfferingsFromDatabase.length,
            totalCount: totalCountFromDatabase
        });

        return [courseOfferingsFromDatabase, totalCountFromDatabase];
    }

    /**
     * Finds a CourseOffering by its composite natural key
     * 
     * @param localCourseCode - Local course code
     * @param schoolId - School ID
     * @param schoolYear - School year
     * @param sessionName - Session name
     * @returns Promise<CourseOffering | null> The found CourseOffering or null
     */
    @LogMethod()
    async findByNaturalKey(
        localCourseCode: string,
        schoolId: number,
        schoolYear: number,
        sessionName: string,
    ): Promise<CourseOffering | null> {
        this.logger.log('Finding course offering by natural key', {
            localCourseCode,
            schoolId,
            schoolYear,
            sessionName
        });

        const courseOffering = await this.courseOfferingRepository.findOne({
            where: {
                localCourseCode,
                schoolId,
                schoolYear,
                sessionName
            }
        });

        this.logger.log(
            courseOffering ? 'Found course offering by natural key' : 'Course offering not found by natural key',
            { localCourseCode, schoolId, schoolYear, sessionName }
        );

        return courseOffering;
    }

    /**
     * Deletes a CourseOffering by its ID
     * 
     * @param id - The UUID of the CourseOffering to delete
     * @returns Promise<boolean> True if deletion was successful
     */
    @LogMethod()
    async deleteCourseOffering(id: string): Promise<boolean> {
        this.logger.log('Deleting course offering', { id });

        const result = await this.courseOfferingRepository.delete(id);

        const wasDeleted = result.affected === 1;
        this.logger.log(
            wasDeleted ? 'Successfully deleted course offering' : 'Failed to delete course offering',
            { id, affected: result.affected }
        );

        return wasDeleted;
    }
} 