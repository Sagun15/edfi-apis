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
    GetAllResponse,
    GetSingleResponse,
    HttpGetResponses,
    HttpPostResponses,
    HttpDeleteResponses,
    ApiCreateResponse,
    ApiDeleteResponse,
    CreateResponse,
    DeleteResponse,
} from 'src/common/decorators/applicationAPIResponse.decorator';
import { RoleGuard } from 'src/core/guards/role.guard';
import { QueryOptionFiltersMap } from 'src/common/interfaces/queryOptions.interface';
import { getApiPath } from 'src/common/utils/api/api-utils';
import {
    ApiPrefixes,
    ApplicationEndpoints,
} from 'src/common/constants/apiPathConstants';
import { SwaggerTagNames } from 'src/common/constants/enums';
import { StaffService } from '../services/staff.service';
import { StaffResponseDTO } from '../dto/staff.response.dto';
import { CreateStaffDTO } from '../dto/request/create-staff.dto';
import { IfMatch, IfNoneMatch } from 'src/common/decorators/etag.decorator';

const CONTROLLER_ROUTE: string = ApplicationEndpoints.STAFF;

/**
 * Staff Controller
 * 
 * Handles HTTP requests for staff resources following Ed-Fi API standards.
 * This controller follows the thin controller pattern - it only handles HTTP concerns
 * and delegates all business logic to the service layer.
 */
@ApiTags(SwaggerTagNames.STAFF)
@Controller(
    getApiPath({
        apiPrefix: ApiPrefixes.EDFI,
        endpoint: CONTROLLER_ROUTE,
    }),
)
@UseGuards(RoleGuard)
export class StaffController {
    private readonly logger: CustomLogger = new CustomLogger();

    constructor(private readonly staffService: StaffService) {
        this.logger.setContext('StaffController');
    }

    /**
     * Retrieves a paginated list of staff resources
     * 
     * @param queryOptionsFromRequest - Query parameters for filtering and pagination
     * @param httpResponse - HTTP response object for setting headers
     * @returns Promise<StaffResponseDTO[]> Array of staff DTOs
     */
    @Get()
    @ApiOperation({
        operationId: 'getAllStaff',
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
    @ApiGetAllResponse(StaffResponseDTO)
    @HttpGetResponses()
    @LogMethod()
    async getAllStaff(
        @Query() queryOptionsFromRequest: QueryOptionFiltersMap,
        @GenericResponse() httpResponse: GenericResponse,
    ): Promise<GetAllResponse<StaffResponseDTO>> {
        this.logger.log('Processing request to fetch all staff');

        const staffWithMetadata = await this.staffService.getAllStaff(
            queryOptionsFromRequest,
            httpResponse
        );

        this.logger.log('Successfully processed request to fetch all staff');
        return staffWithMetadata;
    }

    /**
     * Retrieves a specific staff resource by their identifier
     * 
     * @param id - The Staff unique system identifier
     * @param httpResponse - HTTP response object for setting ETag headers
     * @returns Promise<StaffResponseDTO> Single staff DTO
     */
    @Get(':id')
    @ApiOperation({
        operationId: 'getStaffById',
        summary: 'Retrieves a specific resource using the resource\'s identifier (using the "Get By Id" pattern).',
        description: 'This GET operation retrieves a resource by the specified resource identifier.',
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'A resource identifier that uniquely identifies the resource.',
        example: '123456',
    })
    @ApiGetSingleResponse(StaffResponseDTO)
    @HttpGetResponses()
    @LogMethod()
    async getStaffById(
        @Param('id') id: string,
        @GenericResponse() httpResponse: GenericResponse,
    ): Promise<GetSingleResponse<StaffResponseDTO>> {
        this.logger.log('Processing request to fetch staff by ID');

        const staffWithETag = await this.staffService.getStaffById(
            id,
            httpResponse
        );

        this.logger.log('Successfully processed request to fetch staff by ID');
        return staffWithETag;
    }

    /**
     * Creates or updates a staff resource (upsert operation)
     * 
     * @param createStaffRequest - Staff data from request body
     * @param ifNoneMatchHeader - Optional ETag header for preventing duplicates
     * @param httpResponse - HTTP response object
     * @returns Promise<CreateResponse> No content response for successful creation
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        operationId: 'createStaff',
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
        type: CreateStaffDTO,
        description: 'The JSON representation of the "staff" resource to be created or updated.',
    })
    @ApiCreateResponse()
    @HttpPostResponses()
    @LogMethod()
    async createStaff(
        @Body() createStaffRequest: CreateStaffDTO,
        @IfNoneMatch() ifNoneMatchHeader: string,
        @GenericResponse() httpResponse: GenericResponse,
    ): Promise<CreateResponse> {
        this.logger.log('Processing request to create staff');

        await this.staffService.createStaff(
            createStaffRequest,
            ifNoneMatchHeader
        );

        this.logger.log('Successfully processed request to create staff');
    }

    /**
     * Deletes a staff resource by its identifier
     * 
     * @param id - The Staff identifier from URL parameter
     * @param ifMatchHeader - Required ETag header for concurrency control
     * @returns Promise<DeleteResponse> No content response for successful deletion
     */
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        operationId: 'deleteStaffById',
        summary: 'Deletes an existing resource using the resource identifier.',
        description: 'The DELETE operation is used to delete an existing resource by identifier. If the resource doesn\'t exist, an error may result to indicate this condition.',
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'A resource identifier that uniquely identifies the resource.',
        example: '123456',
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
    async deleteStaffById(
        @Param('id') id: string,
        @IfMatch() ifMatchHeader: string,
    ): Promise<DeleteResponse> {
        this.logger.log('Processing request to delete staff by ID');

        await this.staffService.deleteStaff(id, ifMatchHeader);

        this.logger.log('Successfully processed request to delete staff by ID');
    }
} 