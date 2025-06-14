import { Injectable, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { ETagService } from 'src/common/services/etag.service';
import { GenericResponse } from 'src/common/decorators/genericResponse.decorator';
import { IQueryOptions } from 'src/common/interfaces/queryOptions.interface';
import { CustomLogger } from 'src/common/utils/logger/logger.service';
import { LogMethod } from 'src/common/decorators/log-method.decorator';
import { UnknownObjectError } from 'src/common/errors/UnknownObjectError';
import { BadRequestError } from 'src/common/errors/BadRequestError';
import { Status } from 'src/common/constants/enums';
import { CalendarRepository } from '../repositories/calendar.repository';
import { CalendarDTO } from '../dto/calendar.dto';
import { CreateCalendarDTO } from '../dto/request/createCalendar.dto';
import { TransactionService } from 'src/common/services/transaction.service';
import { Transactional } from 'src/common/decorators/transaction.decorator';
import { Calendar } from 'src/common/entities/calendar.entity';
import { School } from 'src/common/entities/school.entity';
import { CalendarTypeDescriptor } from 'src/common/entities/descriptors/calendarTypeDescriptor.entity';

@Injectable()
export class CalendarService {
    private readonly logger: CustomLogger = new CustomLogger();

    constructor(
        private readonly calendarRepository: CalendarRepository,
        private readonly etagService: ETagService,
        private readonly transactionService: TransactionService,
    ) {
        this.logger.setContext('CalendarService');
    }

    /**
     * Retrieves a paginated list of calendars based on query options
     * Only returns active records (not deleted or inactive)
     * 
     * @param queryOptionsFromRequest - Query parameters for filtering and pagination
     * @param httpResponse - HTTP response object for setting headers
     * @returns Promise<CalendarDTO[]> Array of calendar DTOs
     */
    @LogMethod()
    @UseInterceptors(CacheInterceptor)
    @CacheKey('all-calendars')
    @CacheTTL(3600)
    async getAllCalendars(
        queryOptionsFromRequest: IQueryOptions,
        httpResponse: GenericResponse,
    ): Promise<CalendarDTO[]> {
        const cacheKey = 'all-calendars';
        this.logger.log('Starting process to retrieve all calendars', { cacheKey });

        // [Step-1]: Retrieve calendars from repository with active status filter
        const [calendarsFromDatabase, totalCalendarsCount] = 
            await this.calendarRepository.findAllBy(queryOptionsFromRequest, { status: Status.ACTIVE });

        // [Step-2]: Handle empty result set
        if (!calendarsFromDatabase || calendarsFromDatabase.length === 0) {
            this.logger.log('No calendars found matching the criteria');
            return [];
        }

        // [Step-3]: Set total count header if requested
        if (queryOptionsFromRequest.totalCount) {
            httpResponse.setHeader('Total-Count', totalCalendarsCount.toString());
            this.logger.log(`Set Total-Count header: ${totalCalendarsCount}`);
        }

        // [Step-4]: Transform entities to DTOs
        const calendarDTOs = calendarsFromDatabase.map(calendar => new CalendarDTO(calendar));

        this.logger.log(`Successfully retrieved ${calendarDTOs.length} calendars`);
        return calendarDTOs;
    }

    /**
     * Retrieves a specific calendar by its identifier
     * Only returns active records (not deleted or inactive)
     * 
     * @param calendarId - Calendar identifier as string from request
     * @param httpResponse - HTTP response object for setting ETag headers
     * @returns Promise<CalendarDTO> Single calendar DTO
     * @throws BadRequestError if calendar ID is invalid
     * @throws UnknownObjectError if calendar is not found or not active
     */
    @LogMethod()
    @UseInterceptors(CacheInterceptor)
    @CacheKey('calendar-by-id')
    @CacheTTL(3600)
    async getCalendarById(
        calendarId: string,
        httpResponse: GenericResponse,
    ): Promise<CalendarDTO> {
        this.logger.log('Starting process to retrieve calendar by ID', { calendarId });

        // [Step-1]: Validate input parameters
        if (!calendarId?.trim()) {
            throw new BadRequestError('Calendar ID is required');
        }

        // [Step-2]: Retrieve calendar from repository with active status filter
        const calendarFromDatabase = await this.calendarRepository.findById(calendarId, Status.ACTIVE);

        // [Step-3]: Handle calendar not found or not active
        if (!calendarFromDatabase) {
            this.logger.warn(`Calendar with ID ${calendarId} not found or not active`);
            throw new UnknownObjectError(`Calendar with ID ${calendarId} not found`);
        }

        // [Step-4]: Transform to DTO and set ETag header
        const calendarDTO = new CalendarDTO(calendarFromDatabase);
        httpResponse.setHeader('ETag', calendarDTO._etag);

        this.logger.log(`Successfully retrieved calendar with ID ${calendarId}`);
        return calendarDTO;
    }

    /**
     * Creates a new calendar resource
     * 
     * **IMPORTANT**: This method performs comprehensive validation:
     * - Checks if record exists by primary key/ID
     * - Checks if record exists by all unique key constraints
     * - Validates all foreign key references
     * - Throws BadRequestError if any constraint violation or invalid foreign key is found
     * 
     * @param createCalendarRequest - Validated calendar data from request
     * @param ifNoneMatchHeader - Optional ETag header (not used in validation)
     * @returns Promise<void> No return value for successful creation
     * @throws BadRequestError for constraint violations, validation errors, or invalid foreign keys
     */
    @LogMethod()
    @Transactional()
    async createCalendar(
        createCalendarRequest: CreateCalendarDTO,
        ifNoneMatchHeader: string,
    ): Promise<void> {
        return this.transactionService.executeInTransaction(async (queryRunner) => {
            this.logger.log('Starting process to create calendar');

            // [Step-1]: Check for existing record by ID if provided
            if (createCalendarRequest.id) {
                const existingCalendarById = await this.calendarRepository.findById(createCalendarRequest.id);
                if (existingCalendarById) {
                    this.logger.warn(`Calendar with ID ${createCalendarRequest.id} already exists`);
                    throw new BadRequestError(`Calendar record already exists with id: ${createCalendarRequest.id}`);
                }
            }

            // [Step-2]: Check for existing record by composite key
            const compositeKeyWhere = {
                calendarCode: createCalendarRequest.calendarCode,
                schoolId: createCalendarRequest.schoolReference.schoolId,
                schoolYear: createCalendarRequest.schoolYearTypeReference.schoolYear,
            };
            const existingCalendarByCompositeKey = await this.calendarRepository.findByCompositeKey(compositeKeyWhere);
            if (existingCalendarByCompositeKey) {
                this.logger.warn('Calendar already exists with the same composite key');
                throw new BadRequestError('Calendar already exists with the same field combination');
            }

            // [Step-3]: Validate all foreign key references
            await this.validateForeignKeyReferences(createCalendarRequest, queryRunner);

            // [Step-4]: Create calendar entity from validated request
            const calendarEntityToSave = this.createCalendarEntityFromRequest(createCalendarRequest);

            // [Step-5]: Save new calendar using transaction repository
            const repository = this.transactionService.getRepository(Calendar, queryRunner);
            await repository.save({
                ...calendarEntityToSave,
                createdate: new Date(),
                lastmodifieddate: new Date(),
                status: Status.ACTIVE,
            });

            this.logger.log('Successfully created calendar');
        });
    }

    /**
     * Deletes a calendar by their identifier (soft delete)
     * 
     * @param calendarId - Calendar identifier as string from request
     * @param ifMatchHeader - Required ETag header for concurrency control
     * @returns Promise<void> No return value for successful deletion
     * @throws BadRequestError if calendar ID is invalid
     * @throws UnknownObjectError if calendar is not found
     */
    @LogMethod()
    async deleteCalendar(
        calendarId: string,
        ifMatchHeader: string,
    ): Promise<void> {
        this.logger.log('Starting process to delete calendar');

        // [Step-1]: Retrieve existing calendar for validation
        const existingCalendarFromDatabase = await this.calendarRepository.findById(calendarId);

        // [Step-2]: Handle calendar not found
        if (!existingCalendarFromDatabase) {
            this.logger.warn(`Calendar with ID ${calendarId} not found for deletion`);
            throw new UnknownObjectError(`Calendar with ID ${calendarId} not found`);
        }

        // [Step-3]: Validate ETag for concurrency control
        const existingCalendarDTO = new CalendarDTO(existingCalendarFromDatabase);
        this.etagService.validateIfMatch(ifMatchHeader, existingCalendarDTO._etag);

        // [Step-4]: Perform soft deletion
        const deletionSuccessful = await this.calendarRepository.deleteCalendar(calendarId);

        // [Step-5]: Handle deletion failure
        if (!deletionSuccessful) {
            this.logger.error(`Failed to delete calendar with ID ${calendarId}`);
            throw new UnknownObjectError(`Failed to delete calendar with ID ${calendarId}`);
        }

        this.logger.log(`Successfully deleted calendar with ID ${calendarId}`);
    }

    /**
     * Validates all foreign key references in the create calendar request
     * **IMPORTANT**: Descriptors should be validated using their numeric IDs
     * 
     * @param createCalendarRequest - The request containing foreign key references
     * @param queryRunner - The transaction query runner
     * @throws BadRequestError if any foreign key reference is invalid
     */
    private async validateForeignKeyReferences(
        createCalendarRequest: CreateCalendarDTO,
        queryRunner: any
    ): Promise<void> {
        // Validate school reference
        const schoolRepo = this.transactionService.getRepository(School, queryRunner);
        const school = await schoolRepo.findOne({
            where: { schoolId: createCalendarRequest.schoolReference.schoolId }
        });
        if (!school) {
            throw new BadRequestError(`Invalid school reference: ${createCalendarRequest.schoolReference.schoolId}`);
        }

        // Validate calendar type descriptor
        const calendarTypeRepo = this.transactionService.getRepository(CalendarTypeDescriptor, queryRunner);
        const calendarType = await calendarTypeRepo.findOne({
            where: { calendarTypeDescriptorId: parseInt(createCalendarRequest.calendarTypeDescriptor) }
        });
        if (!calendarType) {
            throw new BadRequestError(`Invalid calendar type descriptor: ${createCalendarRequest.calendarTypeDescriptor}`);
        }
    }

    /**
     * Creates a Calendar entity from the validated request data
     * 
     * @param createCalendarRequest - The validated request data
     * @returns Calendar entity ready for saving
     */
    private createCalendarEntityFromRequest(createCalendarRequest: CreateCalendarDTO): Calendar {
        const calendar = new Calendar();
        calendar.calendarCode = createCalendarRequest.calendarCode;
        calendar.schoolId = createCalendarRequest.schoolReference.schoolId;
        calendar.schoolYear = createCalendarRequest.schoolYearTypeReference.schoolYear;
        calendar.calendarTypeDescriptorId = parseInt(createCalendarRequest.calendarTypeDescriptor);
        return calendar;
    }
} 