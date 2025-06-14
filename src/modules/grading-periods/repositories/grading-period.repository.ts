import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { LogMethod } from 'src/common/decorators/log-method.decorator';
import BaseRepository from 'src/common/repositories/baseRepository.repository';
import { GradingPeriod } from 'src/common/entities/gradingPeriod.entity';
import { CustomLogger } from 'src/common/utils/logger/logger.service';
import { IQueryOptions } from 'src/common/interfaces/queryOptions.interface';
import { Status } from 'src/common/constants/enums';
import { UUID } from 'crypto';

@Injectable()
export class GradingPeriodRepository extends BaseRepository<GradingPeriod> {
    protected readonly logger: CustomLogger = new CustomLogger();

    constructor(
        @InjectRepository(GradingPeriod)
        private readonly gradingPeriodRepository: Repository<GradingPeriod>,
    ) {
        super(gradingPeriodRepository);
        this.logger.setContext('GradingPeriodRepository');
    }

    /**
     * Fetches an array of GradingPeriod entities along with the total count, using the
     * provided IQueryOptions and FindOptionsWhere as filters.
     *
     * @param queryOptions - The IQueryOptions object that contains the limit, offset parameters
     * @param whereConditions - The FindOptionsWhere object that contains the conditions for the where clause
     * @returns Promise<[GradingPeriod[], number]> A tuple containing an array of GradingPeriod entities 
     *                                             and the total count matching the criteria
     */
    @LogMethod()
    async findAllBy(
        queryOptions: IQueryOptions,
        whereConditions: FindOptionsWhere<GradingPeriod>,
    ): Promise<[GradingPeriod[], number]> {
        const { limit, offset } = queryOptions;

        this.logger.log('Executing findAndCount query for grading periods', {
            limit,
            offset,
            whereConditions
        });

        // [Step-1]: Execute database query with pagination and filtering
        const [gradingPeriodsFromDatabase, totalCountFromDatabase]: [GradingPeriod[], number] = 
            await this.gradingPeriodRepository.findAndCount({
                where: whereConditions,
                skip: offset,
                take: limit,
                order: {
                    id: 'ASC',
                },
            });

        this.logger.log('Successfully executed findAndCount query', {
            foundGradingPeriods: gradingPeriodsFromDatabase.length,
            totalCount: totalCountFromDatabase
        });

        return [gradingPeriodsFromDatabase, totalCountFromDatabase];
    }

    /**
     * Finds a GradingPeriod entity by composite key for constraint validation
     * Used for constraint validation in create operations
     * 
     * @param gradingPeriodDescriptorId - The grading period descriptor ID
     * @param periodSequence - The period sequence
     * @param schoolId - The school ID
     * @param schoolYear - The school year
     * @returns Promise<GradingPeriod | null> The GradingPeriod entity if found, null otherwise
     */
    @LogMethod()
    async findByCompositeKey(
        gradingPeriodDescriptorId: number,
        periodSequence: number,
        schoolId: number,
        schoolYear: number,
    ): Promise<GradingPeriod | null> {
        this.logger.log('Executing findOne query by composite key', {
            gradingPeriodDescriptorId,
            periodSequence,
            schoolId,
            schoolYear
        });

        const gradingPeriodFromDatabase: GradingPeriod | null = await this.gradingPeriodRepository.findOne({
            where: {
                gradingPeriodDescriptorId,
                periodSequence,
                schoolId,
                schoolYear,
            }
        });

        this.logger.log('Completed findOne query by composite key', {
            gradingPeriodDescriptorId,
            periodSequence,
            schoolId,
            schoolYear,
            found: !!gradingPeriodFromDatabase
        });

        return gradingPeriodFromDatabase;
    }

    /**
     * Soft deletes a GradingPeriod entity by updating status and timestamps
     * 
     * @param idToDelete - The GradingPeriod identifier to delete
     * @returns Promise<void> No return value for successful deletion
     */
    @LogMethod()
    async delete(idToDelete: string): Promise<void> {
        this.logger.log('Executing soft delete operation for grading period', { id: idToDelete });

        // [Step-1]: Prepare soft delete data
        const updateData = {
            status: Status.DELETED,
            deletedate: new Date(),
            lastmodifieddate: new Date()
        };

        // [Step-2]: Execute soft delete operation
        const updateResult = await this.gradingPeriodRepository.update(
            { id: idToDelete as UUID },
            updateData
        );

        // [Step-3]: Log the result
        this.logger.log('Completed soft delete operation for grading period', {
            id: idToDelete,
            affectedRows: updateResult.affected
        });
    }
} 