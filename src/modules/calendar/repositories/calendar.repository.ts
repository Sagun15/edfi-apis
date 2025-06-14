import {
    FindOptionsWhere,
    Repository,
    DeepPartial,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { IQueryOptions } from 'src/common/interfaces/queryOptions.interface';
import { LogMethod } from 'src/common/decorators/log-method.decorator';
import BaseRepository from 'src/common/repositories/baseRepository.repository';
import { Calendar } from 'src/common/entities/calendar.entity';
import { CustomLogger } from 'src/common/utils/logger/logger.service';
import { Status } from 'src/common/constants/enums';

@Injectable()
export class CalendarRepository extends BaseRepository<Calendar> {
    protected readonly logger: CustomLogger = new CustomLogger();

    constructor(
        @InjectRepository(Calendar)
        private readonly calendarRepository: Repository<Calendar>,
    ) {
        super(calendarRepository);
        this.logger.setContext('CalendarRepository');
    }

    /**
     * Fetches an array of Calendar entities along with the total count, using the
     * provided IQueryOptions and FindOptionsWhere as filters.
     * **IMPORTANT**: This method properly handles lazy-loaded foreign relationships.
     *
     * @param queryOptions - The IQueryOptions object that contains the limit, offset parameters
     * @param whereConditions - The FindOptionsWhere object that contains the conditions for the where clause
     * @returns Promise<[Calendar[], number]> A tuple containing an array of Calendar entities 
     *                                       and the total count matching the criteria
     */
    @LogMethod()
    async findAllBy(
        queryOptions: IQueryOptions,
        whereConditions: FindOptionsWhere<Calendar>,
    ): Promise<[Calendar[], number]> {
        const { limit, offset } = queryOptions;

        this.logger.log('Executing findAndCount query for calendars', {
            limit,
            offset,
            whereConditions
        });

        // [Step-1]: Execute database query with pagination and filtering
        const [calendarsFromDatabase, totalCountFromDatabase] = 
            await this.calendarRepository.findAndCount({
                where: whereConditions,
                relations: {
                    school: true,
                    calendarTypeDescriptor: true,
                },
                skip: offset,
                take: limit,
                order: {
                    calendarCode: 'ASC',
                    schoolId: 'ASC',
                    schoolYear: 'ASC',
                },
            });

        // [Step-2]: Handle lazy-loaded relationships for DTO transformation
        for (const calendar of calendarsFromDatabase) {
            // Load school data if needed for DTO
            if (calendar.school) {
                await calendar.school;
            }
            // Load calendar type descriptor data if needed for DTO
            if (calendar.calendarTypeDescriptor) {
                await calendar.calendarTypeDescriptor;
            }
        }

        this.logger.log('Successfully executed findAndCount query', {
            foundCalendars: calendarsFromDatabase.length,
            totalCount: totalCountFromDatabase
        });

        return [calendarsFromDatabase, totalCountFromDatabase];
    }

    /**
     * Finds a single Calendar entity by its composite key components
     * **IMPORTANT**: This method properly handles lazy-loaded foreign relationships.
     * 
     * @param calendarId - The Calendar identifier (calendarCode) to search for
     * @param status - Optional status filter
     * @returns Promise<Calendar | null> The Calendar entity if found, null otherwise
     */
    @LogMethod()
    async findById(calendarId: string, status?: Status): Promise<Calendar | null> {
        this.logger.log('Executing findOne query by calendar code', { calendarCode: calendarId, status });

        // Build where conditions including status if provided
        const whereConditions: FindOptionsWhere<Calendar> = {
            calendarCode: calendarId,
            ...(status && { status }),
        };

        // [Step-1]: Execute database query
        const calendarFromDatabase = await this.calendarRepository.findOne({
            where: whereConditions,
            relations: {
                school: true,
                calendarTypeDescriptor: true,
            }
        });

        // [Step-2]: Handle lazy-loaded relationships if entity exists
        if (calendarFromDatabase) {
            // Load school data if needed for DTO
            if (calendarFromDatabase.school) {
                await calendarFromDatabase.school;
            }
            // Load calendar type descriptor data if needed for DTO
            if (calendarFromDatabase.calendarTypeDescriptor) {
                await calendarFromDatabase.calendarTypeDescriptor;
            }
        }

        this.logger.log('Completed findOne query by calendar code', {
            calendarCode: calendarId,
            found: !!calendarFromDatabase
        });

        return calendarFromDatabase;
    }

    /**
     * Finds a single Calendar entity by composite/natural key
     * Used for constraint validation in create operations
     * 
     * @param compositeKey - Object containing the natural key fields
     * @returns Promise<Calendar | null> The Calendar entity if found, null otherwise
     */
    @LogMethod()
    async findByCompositeKey(compositeKey: {
        calendarCode: string;
        schoolId: number;
        schoolYear: number;
    }): Promise<Calendar | null> {
        this.logger.log('Executing findOne query by composite key', { compositeKey });

        const calendarFromDatabase = await this.calendarRepository.findOne({
            where: {
                calendarCode: compositeKey.calendarCode,
                schoolId: compositeKey.schoolId,
                schoolYear: compositeKey.schoolYear,
            } as FindOptionsWhere<Calendar>
        });

        this.logger.log('Completed findOne query by composite key', {
            compositeKey,
            found: !!calendarFromDatabase
        });

        return calendarFromDatabase;
    }

    /**
     * Soft deletes a Calendar entity by updating status and timestamps
     * 
     * @param calendarId - The Calendar identifier to delete
     * @returns Promise<boolean> True if deletion was successful, false if no rows were affected
     */
    @LogMethod()
    async deleteCalendar(calendarId: string): Promise<boolean> {
        this.logger.log('Executing soft delete operation for calendar', { calendarCode: calendarId });

        // [Step-1]: Prepare soft delete data
        const updateData: DeepPartial<Calendar> = {
            status: Status.DELETED,
            deletedate: new Date(),
            lastmodifieddate: new Date()
        };

        // [Step-2]: Execute soft delete operation
        const updateResult = await this.calendarRepository.update(
            { id: calendarId } as FindOptionsWhere<Calendar>,
            updateData
        );

        // [Step-3]: Determine if deletion was successful based on affected rows
        const deletionWasSuccessful = (updateResult.affected || 0) > 0;

        this.logger.log('Completed soft delete operation for calendar', {
            id: calendarId,
            successful: deletionWasSuccessful,
            affectedRows: updateResult.affected
        });

        return deletionWasSuccessful;
    }
} 