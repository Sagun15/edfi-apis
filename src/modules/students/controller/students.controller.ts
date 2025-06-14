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
import { IfMatch, IfNoneMatch } from 'src/common/decorators/etag.decorator';
import { StudentService } from '../service/student.service';
import { StudentDTO } from '../dto/student.dto';
import { CreateStudentDTO } from '../dto/request/create-student.dto';

/**
 * Student Controller
 * 
 * Handles all HTTP requests for Student resources following Ed-Fi REST API specifications.
 * This controller follows the thin controller pattern and delegates all business logic
 * to the StudentService layer.
 */
const CONTROLLER_ROUTE: string = ApplicationEndpoints.STUDENT;

@ApiTags(SwaggerTagNames.STUDENT)
@Controller(
    getApiPath({
        apiPrefix: ApiPrefixes.EDFI,
        endpoint: CONTROLLER_ROUTE,
    }),
)
@UseGuards(RoleGuard)
export class StudentsController {
    private readonly logger: CustomLogger = new CustomLogger();

    constructor(private readonly studentService: StudentService) {
        this.logger.setContext('StudentsController');
    }

    /**
     * Retrieves a paginated list of student resources
     * 
     * @param queryOptionsFromRequest - Query parameters for filtering and pagination
     * @param httpResponse - HTTP response object for setting headers
     * @returns Promise<StudentDTO[]> Array of student DTOs
     */
    @Get()
    @ApiOperation({
        operationId: 'getAllStudents',
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
    @ApiGetAllResponse(StudentDTO)
    @HttpGetResponses()
    @LogMethod()
    async getAllStudents(
        @Query() queryOptionsFromRequest: QueryOptionFiltersMap,
        @GenericResponse() httpResponse: GenericResponse,
    ): Promise<GetAllResponse<StudentDTO>> {
        this.logger.log('Processing request to fetch all students');

        const studentsWithMetadata = await this.studentService.getAllStudents(
            queryOptionsFromRequest,
            httpResponse
        );

        this.logger.log('Successfully processed request to fetch all students');
        return studentsWithMetadata;
    }

    /**
     * Retrieves a specific student resource by its primary identifier
     * 
     * @param studentIdFromRequest - The student primary identifier from URL parameter
     * @param httpResponse - HTTP response object for setting ETag headers
     * @returns Promise<StudentDTO> Single student DTO
     */
    @Get(':id')
    @ApiOperation({
        operationId: 'getStudentById',
        summary: 'Retrieves a specific resource using the resource\'s identifier (using the "Get By Id" pattern).',
        description: 'This GET operation retrieves a resource by the specified resource identifier.',
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'A resource identifier that uniquely identifies the resource.',
        example: '100001',
    })
    @ApiGetSingleResponse(StudentDTO)
    @HttpGetResponses()
    @LogMethod()
    async getStudentById(
        @Param('id') studentIdFromRequest: string,
        @GenericResponse() httpResponse: GenericResponse,
    ): Promise<GetSingleResponse<StudentDTO>> {
        this.logger.log('Processing request to fetch student by ID');

        const studentWithETag = await this.studentService.getStudentById(
            studentIdFromRequest,
            httpResponse
        );

        this.logger.log('Successfully processed request to fetch student by ID');
        return studentWithETag;
    }

    /**
     * Creates or updates a student resource (upsert operation)
     * 
     * @param createStudentRequest - Student data from request body
     * @param ifNoneMatchHeader - Optional ETag header for preventing duplicates
     * @param httpResponse - HTTP response object
     * @returns Promise<CreateResponse> No content response for successful creation
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        operationId: 'createStudent',
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
        type: CreateStudentDTO,
        description: 'The JSON representation of the "student" resource to be created or updated.',
    })
    @ApiCreateResponse()
    @HttpPostResponses()
    @LogMethod()
    async createStudent(
        @Body() createStudentRequest: CreateStudentDTO,
        @IfNoneMatch() ifNoneMatchHeader: string,
        @GenericResponse() httpResponse: GenericResponse,
    ): Promise<CreateResponse> {
        this.logger.log('Processing request to create student');

        await this.studentService.createStudent(
            createStudentRequest,
            ifNoneMatchHeader
        );

        this.logger.log('Successfully processed request to create student');
    }

    /**
     * Deletes a student resource by its identifier
     * 
     * @param studentIdFromRequest - The student identifier from URL parameter
     * @param ifMatchHeader - Required ETag header for concurrency control
     * @returns Promise<DeleteResponse> No content response for successful deletion
     */
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        operationId: 'deleteStudentById',
        summary: 'Deletes an existing resource using the resource identifier.',
        description: 'The DELETE operation is used to delete an existing resource by identifier. If the resource doesn\'t exist, an error may result to indicate this condition.',
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'A resource identifier that uniquely identifies the resource.',
        example: '100001',
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
    async deleteStudentById(
        @Param('id') studentIdFromRequest: string,
        @IfMatch() ifMatchHeader: string,
    ): Promise<DeleteResponse> {
        this.logger.log('Processing request to delete student by ID');

        await this.studentService.deleteStudent(studentIdFromRequest, ifMatchHeader);

        this.logger.log('Successfully processed request to delete student by ID');
    }
} 