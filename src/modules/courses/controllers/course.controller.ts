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
import { CourseService } from '../services/course.service';
import { CourseDTO } from '../dto/course.dto';
import { CreateCourseDTO } from '../dto/request/create-course.dto';
import { IfMatch, IfNoneMatch } from 'src/common/decorators/etag.decorator';

const CONTROLLER_ROUTE: string = ApplicationEndpoints.COURSES;

@ApiTags(SwaggerTagNames.COURSES)
@Controller(
    getApiPath({
        apiPrefix: ApiPrefixes.EDFI,
        endpoint: CONTROLLER_ROUTE,
    }),
)
@UseGuards(RoleGuard)
export class CourseController {
    private readonly logger: CustomLogger = new CustomLogger();

    constructor(private readonly courseService: CourseService) {
        this.logger.setContext('CourseController');
    }

    /**
     * Retrieves a paginated list of course resources
     * 
     * @param queryOptionsFromRequest - Query parameters for filtering and pagination
     * @param httpResponse - HTTP response object for setting headers
     * @returns Promise<CourseDTO[]> Array of course DTOs
     */
    @Get()
    @ApiOperation({
        operationId: 'getAllCourses',
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
    @ApiGetAllResponse(CourseDTO)
    @HttpGetResponses()
    @LogMethod()
    async getAllCourses(
        @Query() queryOptionsFromRequest: QueryOptionFiltersMap,
        @GenericResponse() httpResponse: GenericResponse,
    ): Promise<GetAllResponse<CourseDTO>> {
        this.logger.log('Processing request to fetch all courses');

        const coursesWithMetadata = await this.courseService.getAllCourses(
            queryOptionsFromRequest,
            httpResponse
        );

        this.logger.log('Successfully processed request to fetch all courses');
        return coursesWithMetadata;
    }

    /**
     * Retrieves a specific course resource by its identifier
     * 
     * @param id - The resource identifier from URL parameter
     * @param httpResponse - HTTP response object for setting ETag headers
     * @returns Promise<CourseDTO> Single course DTO
     */
    @Get(':id')
    @ApiOperation({
        operationId: 'getCourseById',
        summary: 'Retrieves a specific resource using the resource\'s identifier (using the "Get By Id" pattern).',
        description: 'This GET operation retrieves a resource by the specified resource identifier.',
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'A resource identifier that uniquely identifies the resource.',
        example: 'ALG-1:123456',
    })
    @ApiGetSingleResponse(CourseDTO)
    @HttpGetResponses()
    @LogMethod()
    async getCourseById(
        @Param('id') id: string,
        @GenericResponse() httpResponse: GenericResponse,
    ): Promise<GetSingleResponse<CourseDTO>> {
        this.logger.log('Processing request to fetch course by ID');

        const courseWithETag = await this.courseService.getCourseById(id, httpResponse);

        this.logger.log('Successfully processed request to fetch course by ID');
        return courseWithETag;
    }

    /**
     * Creates or updates a course resource (upsert operation)
     * 
     * @param createCourseRequest - Course data from request body
     * @param ifNoneMatchHeader - Optional ETag header for preventing duplicates
     * @param httpResponse - HTTP response object
     * @returns Promise<CreateResponse> No content response for successful creation
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        operationId: 'createCourse',
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
        type: CreateCourseDTO,
        description: 'The JSON representation of the "course" resource to be created or updated.',
    })
    @ApiCreateResponse()
    @HttpPostResponses()
    @LogMethod()
    async createCourse(
        @Body() createCourseRequest: CreateCourseDTO,
        @IfNoneMatch() ifNoneMatchHeader: string,
        @GenericResponse() httpResponse: GenericResponse,
    ): Promise<CreateResponse> {
        this.logger.log('Processing request to create course');

        await this.courseService.createCourse(
            createCourseRequest,
            ifNoneMatchHeader
        );

        this.logger.log('Successfully processed request to create course');
    }

    /**
     * Deletes a course resource by its identifier
     * 
     * @param id - The course identifier from URL parameter
     * @param ifMatchHeader - Required ETag header for concurrency control
     * @returns Promise<DeleteResponse> No content response for successful deletion
     */
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        operationId: 'deleteCourseById',
        summary: 'Deletes an existing resource using the resource identifier.',
        description: 'The DELETE operation is used to delete an existing resource by identifier. If the resource doesn\'t exist, an error may result to indicate this condition.',
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'A resource identifier that uniquely identifies the resource.',
        example: 'ALG-1:123456',
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
    async deleteCourseById(
        @Param('id') id: string,
        @IfMatch() ifMatchHeader: string,
    ): Promise<DeleteResponse> {
        this.logger.log('Processing request to delete course by ID');

        await this.courseService.deleteCourse(id, ifMatchHeader);

        this.logger.log('Successfully processed request to delete course by ID');
    }
} 