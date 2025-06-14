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
    ApiParam,
    ApiQuery,
    ApiBody,
    ApiHeader,
} from '@nestjs/swagger';
import { CourseOfferingService } from '../services/course-offerings.service';
import { CourseOfferingDTO } from '../dto/course-offering.dto';
import { CreateCourseOfferingDTO } from '../dto/request/course-offering.request.dto';
import { GenericResponse } from '../../../common/decorators/genericResponse.decorator';
import { LogMethod } from '../../../common/decorators/log-method.decorator';
import { CustomLogger } from '../../../common/utils/logger/logger.service';
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
} from '../../../common/decorators/applicationAPIResponse.decorator';
import { RoleGuard } from '../../../core/guards/role.guard';
import { QueryOptionFiltersMap } from '../../../common/interfaces/queryOptions.interface';
import { getApiPath } from '../../../common/utils/api/api-utils';
import {
    ApiPrefixes,
    ApplicationEndpoints,
} from '../../../common/constants/apiPathConstants';
import { SwaggerTagNames } from '../../../common/constants/enums';
import { IfMatch, IfNoneMatch } from '../../../common/decorators/etag.decorator';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';

const CONTROLLER_ROUTE: string = ApplicationEndpoints.COURSE_OFFERING;

/**
 * CourseOffering Controller
 * 
 * Handles HTTP requests for course offering resources following Ed-Fi API standards.
 * This controller follows the thin controller pattern - it only handles HTTP concerns
 * and delegates all business logic to the service layer.
 */
@ApiTags(SwaggerTagNames.COURSE_OFFERING)
@Controller(
    getApiPath({
        apiPrefix: ApiPrefixes.EDFI,
        endpoint: CONTROLLER_ROUTE,
    }),
)
@UseGuards(RoleGuard)
// @UseGuards(JwtAuthGuard)
export class CourseOfferingController {
    private readonly logger: CustomLogger = new CustomLogger();

    constructor(private readonly courseOfferingService: CourseOfferingService) {
        this.logger.setContext('CourseOfferingController');
    }

    /**
     * Retrieves a paginated list of course offering resources
     * 
     * @param queryOptionsFromRequest - Query parameters for filtering and pagination
     * @param httpResponse - HTTP response object for setting headers
     * @returns Promise<CourseOfferingDTO[]> Array of course offering DTOs
     */
    @Get()
    @ApiOperation({
        operationId: 'getAllCourseOfferings',
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
    @ApiGetAllResponse(CourseOfferingDTO)
    @HttpGetResponses()
    @LogMethod()
    async getAllCourseOfferings(
        @Query() queryOptionsFromRequest: QueryOptionFiltersMap,
        @GenericResponse() httpResponse: GenericResponse,
    ): Promise<GetAllResponse<CourseOfferingDTO>> {
        this.logger.log('Processing request to fetch all course offerings');

        // [Step-1]: Delegate all business logic to service layer
        const courseOfferingsWithMetadata = await this.courseOfferingService.getAllCourseOfferings(
            queryOptionsFromRequest,
            httpResponse
        );

        this.logger.log('Successfully processed request to fetch all course offerings');
        return courseOfferingsWithMetadata;
    }

    /**
     * Retrieves a specific course offering resource by its identifier
     * 
     * @param courseOfferingIdFromRequest - The course offering identifier from URL parameter
     * @param httpResponse - HTTP response object for setting ETag headers
     * @returns Promise<CourseOfferingDTO> Single course offering DTO
     */
    @Get(':id')
    @ApiOperation({
        operationId: 'getCourseOfferingById',
        summary: 'Retrieves a specific resource using the resource\'s identifier (using the "Get By Id" pattern).',
        description: 'This GET operation retrieves a resource by the specified resource identifier.',
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'A resource identifier that uniquely identifies the resource.',
        example: 'f1e85f64-9f04-4123-8567-4523451fa9c8',
    })
    @ApiGetSingleResponse(CourseOfferingDTO)
    @HttpGetResponses()
    @LogMethod()
    async getCourseOfferingById(
        @Param('id') courseOfferingIdFromRequest: string,
        @GenericResponse() httpResponse: GenericResponse,
    ): Promise<GetSingleResponse<CourseOfferingDTO>> {
        this.logger.log('Processing request to fetch course offering by ID');

        // [Step-1]: Delegate all validation and business logic to service layer
        const courseOfferingWithETag = await this.courseOfferingService.getCourseOfferingById(
            courseOfferingIdFromRequest,
            httpResponse
        );

        this.logger.log('Successfully processed request to fetch course offering by ID');
        return courseOfferingWithETag;
    }

    /**
     * Creates or updates a course offering resource (upsert operation)
     * 
     * @param createCourseOfferingRequest - Course offering data from request body
     * @param ifNoneMatchHeader - Optional ETag header for preventing duplicates
     * @param httpResponse - HTTP response object
     * @returns Promise<void> No content response for successful creation
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        operationId: 'createCourseOffering',
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
        type: CreateCourseOfferingDTO,
        description: 'The JSON representation of the "courseOffering" resource to be created or updated.',
    })
    @ApiCreateResponse()
    @HttpPostResponses()
    @LogMethod()
    async createCourseOffering(
        @Body() createCourseOfferingRequest: CreateCourseOfferingDTO,
        @IfNoneMatch() ifNoneMatchHeader: string,
        @GenericResponse() httpResponse: GenericResponse,
    ): Promise<CreateResponse> {
        this.logger.log('Processing request to create course offering');

        // [Step-1]: Delegate all validation and business logic to service layer
        await this.courseOfferingService.createCourseOffering(
            createCourseOfferingRequest,
            ifNoneMatchHeader
        );

        this.logger.log('Successfully processed request to create course offering');
    }

    /**
     * Deletes a course offering resource by its identifier
     * 
     * @param courseOfferingIdFromRequest - The course offering identifier from URL parameter
     * @param ifMatchHeader - Required ETag header for concurrency control
     * @returns Promise<void> No content response for successful deletion
     */
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        operationId: 'deleteCourseOfferingById',
        summary: 'Deletes an existing resource using the resource identifier.',
        description: 'The DELETE operation is used to delete an existing resource by identifier. If the resource doesn\'t exist, an error may result to indicate this condition.',
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'A resource identifier that uniquely identifies the resource.',
        example: 'f1e85f64-9f04-4123-8567-4523451fa9c8',
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
    async deleteCourseOfferingById(
        @Param('id') courseOfferingIdFromRequest: string,
        @IfMatch() ifMatchHeader: string,
    ): Promise<DeleteResponse> {
        this.logger.log('Processing request to delete course offering');

        // [Step-1]: Delegate all validation and business logic to service layer
        await this.courseOfferingService.deleteCourseOffering(
            courseOfferingIdFromRequest,
            ifMatchHeader
        );

        this.logger.log('Successfully processed request to delete course offering');
    }
} 