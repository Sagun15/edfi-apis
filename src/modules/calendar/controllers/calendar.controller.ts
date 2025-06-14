import {
    Controller,
    Get,
    HttpStatus,
    Param,
    Query,
    UseGuards,
    Post,
    Body,
    Delete,
    HttpCode,
} from '@nestjs/common';
import {
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiTags,
    ApiBody,
    ApiHeader,
} from '@nestjs/swagger';
import { GenericResponse } from 'src/common/decorators/genericResponse.decorator';
import { LogMethod } from 'src/common/decorators/log-method.decorator';
import { CustomLogger } from 'src/common/utils/logger/logger.service';
import {
    ApiGetAllResponse,
    ApiGetSingleResponse,
    ApiCreateResponse,
    ApiDeleteResponse,
    GetAllResponse,
    GetSingleResponse,
    CreateResponse,
    DeleteResponse,
    HttpGetResponses,
    HttpPostResponses,
    HttpDeleteResponses,
} from 'src/common/decorators/applicationAPIResponse.decorator';
import { RoleGuard } from 'src/core/guards/role.guard';
import { QueryOptionFiltersMap } from 'src/common/interfaces/queryOptions.interface';
import { getApiPath } from 'src/common/utils/api/api-utils';
import {
    ApiPrefixes,
    ApplicationEndpoints,
} from 'src/common/constants/apiPathConstants';
import { SwaggerTagNames } from 'src/common/constants/enums';
import { CalendarService } from '../services/calendar.service';
import { CalendarDTO } from '../dto/calendar.dto';
import { CreateCalendarDTO } from '../dto/request/createCalendar.dto';
import { IfMatch, IfNoneMatch } from 'src/common/decorators/etag.decorator';

const CONTROLLER_ROUTE: string = ApplicationEndpoints.CALENDAR;

@ApiTags(SwaggerTagNames.CALENDAR)
@Controller(
    getApiPath({
        apiPrefix: ApiPrefixes.EDFI,
        endpoint: CONTROLLER_ROUTE,
    }),
)
@UseGuards(RoleGuard)
export class CalendarController {
    private readonly logger: CustomLogger = new CustomLogger();

    constructor(private readonly calendarService: CalendarService) {
        this.logger.setContext('CalendarController');
    }

    /**
     * Retrieves a paginated list of calendar resources
     * 
     * @param queryOptionsFromRequest - Query parameters for filtering and pagination
     * @param httpResponse - HTTP response object for setting headers
     * @returns Promise<CalendarDTO[]> Array of calendar DTOs
     */
    @Get()
    @ApiOperation({
        operationId: 'getAllCalendars',
        summary: 'Retrieves specific resources using the resource\'s property values (using the "Get" pattern).',
        description: `This GET operation provides access to resources using the "Get" 
            search pattern. The values of any properties of the resource that are specified 
            will be used to return all matching results (if it exists).`,
    })
    @ApiQuery({
        name: 'offset',
        required: false,
        type: Number,
        description: 'Indicates how many items should be skipped before returning results.',
        example: 0,
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Indicates the maximum number of items that should be returned in the results.',
        example: 25,
    })
    @ApiQuery({
        name: 'totalCount',
        required: false,
        type: Boolean,
        description: 'Indicates if the total number of items available should be returned in the \'Total-Count\' header of the response.',
        example: false,
    })
    @ApiGetAllResponse(CalendarDTO)
    @HttpGetResponses()
    @LogMethod()
    async getAllCalendars(
        @Query() queryOptionsFromRequest: QueryOptionFiltersMap,
        @GenericResponse() httpResponse: GenericResponse,
    ): Promise<GetAllResponse<CalendarDTO>> {
        this.logger.log('Processing request to fetch all calendars');

        const calendarsWithMetadata = await this.calendarService.getAllCalendars(
            queryOptionsFromRequest,
            httpResponse
        );

        this.logger.log('Successfully processed request to fetch all calendars');
        return calendarsWithMetadata;
    }

    /**
     * Retrieves a specific calendar resource by its primary identifier
     * 
     * @param calendarId - The calendar primary identifier from URL parameter
     * @param httpResponse - HTTP response object for setting ETag headers
     * @returns Promise<CalendarDTO> Single calendar DTO
     */
    @Get(':id')
    @ApiOperation({
        operationId: 'getCalendarById',
        summary: 'Retrieves a specific resource using the resource\'s identifier (using the "Get By Id" pattern).',
        description: 'This GET operation retrieves a resource by the specified resource identifier.',
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'A resource identifier that uniquely identifies the resource.',
        example: 'CAL-2024',
    })
    @ApiGetSingleResponse(CalendarDTO)
    @HttpGetResponses()
    @LogMethod()
    async getCalendarById(
        @Param('id') calendarId: string,
        @GenericResponse() httpResponse: GenericResponse,
    ): Promise<GetSingleResponse<CalendarDTO>> {
        this.logger.log('Processing request to fetch calendar by ID');

        const calendarWithETag = await this.calendarService.getCalendarById(
            calendarId,
            httpResponse
        );

        this.logger.log('Successfully processed request to fetch calendar by ID');
        return calendarWithETag;
    }

    /**
     * Creates or updates a calendar resource (upsert operation)
     * 
     * @param createCalendarRequest - Calendar data from request body
     * @param ifNoneMatchHeader - Optional ETag header for preventing duplicates
     * @param httpResponse - HTTP response object
     * @returns Promise<CreateResponse> No content response for successful creation
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        operationId: 'createCalendar',
        summary: 'Creates or updates resources based on the natural key values of the supplied resource.',
        description: `The POST operation can be used to create or update resources. In database terms, this is often referred to as an "upsert" operation (insert + update). Clients should NOT include the resource "id" in the JSON body because it will result in an error. The web service will identify whether the resource already exists based on the natural key values provided, and update or create the resource appropriately.`,
    })
    @ApiHeader({
        name: 'If-None-Match',
        description: 'The previously returned ETag header value, used here to prevent the creation of duplicate resources.',
        required: false,
        example: '"2025-05-29T07:53:44.000Z"',
    })
    @ApiBody({
        type: CreateCalendarDTO,
        description: 'The JSON representation of the "calendar" resource to be created or updated.',
    })
    @ApiCreateResponse()
    @HttpPostResponses()
    @LogMethod()
    async createCalendar(
        @Body() createCalendarRequest: CreateCalendarDTO,
        @IfNoneMatch() ifNoneMatchHeader: string,
        @GenericResponse() httpResponse: GenericResponse,
    ): Promise<CreateResponse> {
        this.logger.log('Processing request to create calendar');

        await this.calendarService.createCalendar(
            createCalendarRequest,
            ifNoneMatchHeader
        );

        this.logger.log('Successfully processed request to create calendar');
    }

    /**
     * Deletes a calendar resource by its identifier
     * 
     * @param calendarId - The calendar identifier from URL parameter
     * @param ifMatchHeader - Required ETag header for concurrency control
     * @returns Promise<DeleteResponse> No content response for successful deletion
     */
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        operationId: 'deleteCalendarById',
        summary: 'Deletes an existing resource using the resource identifier.',
        description: 'The DELETE operation is used to delete an existing resource by identifier. If the resource doesn\'t exist, an error may result to indicate this condition.',
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'A resource identifier that uniquely identifies the resource.',
        example: 'CAL-2024',
    })
    @ApiHeader({
        name: 'If-Match',
        description: 'The ETag header value used to prevent the deletion of a resource modified by another party.',
        required: true,
        example: '"2025-05-29T07:53:44.000Z"',
    })
    @ApiDeleteResponse()
    @HttpDeleteResponses()
    @LogMethod()
    async deleteCalendarById(
        @Param('id') calendarId: string,
        @IfMatch() ifMatchHeader: string,
    ): Promise<DeleteResponse> {
        this.logger.log('Processing request to delete calendar by ID');

        await this.calendarService.deleteCalendar(calendarId, ifMatchHeader);

        this.logger.log('Successfully processed request to delete calendar by ID');
    }
} 