import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiBody,
    ApiHeader,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { GenericResponse } from 'src/common/decorators/genericResponse.decorator';
import { LogMethod } from 'src/common/decorators/log-method.decorator';
import { CustomLogger } from 'src/common/utils/logger/logger.service';
import {
    ApiCreateResponse,
    ApiDeleteResponse,
    ApiGetAllResponse,
    ApiGetSingleResponse,
    CreateResponse,
    DeleteResponse,
    GetAllResponse,
    GetSingleResponse,
    HttpDeleteResponses,
    HttpGetResponses,
    HttpPostResponses,
} from 'src/common/decorators/applicationAPIResponse.decorator';
import { RoleGuard } from 'src/core/guards/role.guard';
import { QueryOptionFiltersMap } from 'src/common/interfaces/queryOptions.interface';
import { getApiPath } from 'src/common/utils/api/api-utils';
import {
    ApiPrefixes,
    ApplicationEndpoints,
} from 'src/common/constants/apiPathConstants';
import { SwaggerTagNames } from 'src/common/constants/enums';
import { IfMatch, IfNoneMatch } from 'src/common/decorators/etag.decorator';
import { GradingPeriodService } from '../services/grading-period.service';
import { CreateGradingPeriodDTO } from '../dto/request/create-grading-period.dto';
import { GradingPeriodDTO } from '../dto/grading-period.dto';

const CONTROLLER_ROUTE: string = ApplicationEndpoints.GRADING_PERIOD;

@ApiTags(SwaggerTagNames.GRADING_PERIOD)
@Controller(
    getApiPath({
        apiPrefix: ApiPrefixes.EDFI,
        endpoint: CONTROLLER_ROUTE,
    }),
)
@UseGuards(RoleGuard)
export class GradingPeriodController {
    private readonly logger: CustomLogger = new CustomLogger();

    constructor(private readonly gradingPeriodService: GradingPeriodService) {
        this.logger.setContext('GradingPeriodController');
    }

    /**
     * Retrieves a paginated list of grading period resources
     * 
     * @param queryOptionsFromRequest - Query parameters for filtering and pagination
     * @param httpResponse - HTTP response object for setting headers
     * @returns Promise<GradingPeriodDTO[]> Array of grading period DTOs
     */
    @Get()
    @ApiOperation({
        operationId: 'getAllGradingPeriods',
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
    @ApiGetAllResponse(GradingPeriodDTO)
    @HttpGetResponses()
    @LogMethod()
    async getAllGradingPeriods(
        @Query() queryOptionsFromRequest: QueryOptionFiltersMap,
        @GenericResponse() httpResponse: GenericResponse,
    ): Promise<GetAllResponse<GradingPeriodDTO>> {
        this.logger.log('Processing request to fetch all grading periods');

        const gradingPeriodsWithMetadata = await this.gradingPeriodService.getAllGradingPeriods(
            queryOptionsFromRequest,
            httpResponse
        );

        this.logger.log('Successfully processed request to fetch all grading periods');
        return gradingPeriodsWithMetadata;
    }

    /**
     * Creates or updates a grading period resource (upsert operation)
     * 
     * @param createGradingPeriodRequest - Grading period data from request body
     * @param ifNoneMatchHeader - Optional ETag header for preventing duplicates
     * @param httpResponse - HTTP response object
     * @returns Promise<CreateResponse> No content response for successful creation
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        operationId: 'createGradingPeriod',
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
        type: CreateGradingPeriodDTO,
        description: 'The JSON representation of the "gradingPeriod" resource to be created or updated.',
    })
    @ApiCreateResponse()
    @HttpPostResponses()
    @LogMethod()
    async createGradingPeriod(
        @Body() createGradingPeriodRequest: CreateGradingPeriodDTO,
        @IfNoneMatch() ifNoneMatchHeader: string,
        @GenericResponse() httpResponse: GenericResponse,
    ): Promise<CreateResponse> {
        this.logger.log('Processing request to create grading period');

        await this.gradingPeriodService.createGradingPeriod(
            createGradingPeriodRequest,
            ifNoneMatchHeader
        );

        this.logger.log('Successfully processed request to create grading period');
    }

    /**
     * Retrieves a specific grading period resource by its primary identifier
     * 
     * @param gradingPeriodIdFromRequest - The grading period primary identifier from URL parameter
     * @param httpResponse - HTTP response object for setting ETag headers
     * @returns Promise<GradingPeriodDTO> Single grading period DTO
     */
    @Get(':id')
    @ApiOperation({
        operationId: 'getGradingPeriodById',
        summary: 'Retrieves a specific resource using the resource\'s identifier (using the "Get By Id" pattern).',
        description: 'This GET operation retrieves a resource by the specified resource identifier.',
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'A resource identifier that uniquely identifies the resource.',
        example: 'uuid-1234',
    })
    @ApiGetSingleResponse(GradingPeriodDTO)
    @HttpGetResponses()
    @LogMethod()
    async getGradingPeriodById(
        @Param('id') gradingPeriodIdFromRequest: string,
        @GenericResponse() httpResponse: GenericResponse,
    ): Promise<GetSingleResponse<GradingPeriodDTO>> {
        this.logger.log('Processing request to fetch grading period by ID');

        const gradingPeriodWithETag = await this.gradingPeriodService.getGradingPeriodById(
            gradingPeriodIdFromRequest,
            httpResponse
        );

        this.logger.log('Successfully processed request to fetch grading period by ID');
        return gradingPeriodWithETag;
    }

    /**
     * Deletes a grading period resource by its identifier
     * 
     * @param gradingPeriodIdFromRequest - The grading period identifier from URL parameter
     * @param ifMatchHeader - Required ETag header for concurrency control
     * @returns Promise<DeleteResponse> No content response for successful deletion
     */
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        operationId: 'deleteGradingPeriodById',
        summary: 'Deletes an existing resource using the resource identifier.',
        description: 'The DELETE operation is used to delete an existing resource by identifier. If the resource doesn\'t exist, an error may result to indicate this condition.',
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'A resource identifier that uniquely identifies the resource.',
        example: 'uuid-1234',
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
    async deleteGradingPeriodById(
        @Param('id') gradingPeriodIdFromRequest: string,
        @IfMatch() ifMatchHeader: string,
    ): Promise<DeleteResponse> {
        this.logger.log('Processing request to delete grading period by ID');

        await this.gradingPeriodService.deleteGradingPeriod(gradingPeriodIdFromRequest, ifMatchHeader);

        this.logger.log('Successfully processed request to delete grading period by ID');
    }
} 