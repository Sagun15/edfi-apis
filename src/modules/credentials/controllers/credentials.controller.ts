import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiTags,
    ApiHeader,
    ApiBody,
} from '@nestjs/swagger';
import { GenericResponse } from 'src/common/decorators/genericResponse.decorator';
import { LogMethod } from 'src/common/decorators/log-method.decorator';
import { CustomLogger } from 'src/common/utils/logger/logger.service';
import {
    ApiGetAllResponse,
    ApiGetSingleResponse,
    ApiCreateResponse,
    ApiUpdateResponse,
    ApiDeleteResponse,
    GetAllResponse,
    GetSingleResponse,
    CreateResponse,
    UpdateResponse,
    DeleteResponse,
    HttpGetResponses,
    HttpPostResponses,
    HttpPutResponses,
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
import { IfMatch, IfNoneMatch } from 'src/common/decorators/etag.decorator';
import { CredentialService } from '../services/credentials.service';
import { CredentialResponseDTO } from '../dto/credential.response.dto';
import { CreateCredentialDTO } from '../dto/create-credential.dto';
import { UpdateCredentialDTO } from '../dto/update-credential.dto';

const CONTROLLER_ROUTE: string = ApplicationEndpoints.CREDENTIAL;

/**
 * Credential Controller
 * 
 * Handles HTTP requests for credential resources following Ed-Fi API standards.
 * This controller follows the thin controller pattern - it only handles HTTP concerns
 * and delegates all business logic to the service layer.
 */
@ApiTags(SwaggerTagNames.CREDENTIAL)
@Controller(
    getApiPath({
        apiPrefix: ApiPrefixes.EDFI,
        endpoint: CONTROLLER_ROUTE,
    }),
)
@UseGuards(RoleGuard)
export class CredentialController {
    private readonly logger: CustomLogger = new CustomLogger();

    constructor(private readonly credentialService: CredentialService) {
        this.logger.setContext('CredentialController');
    }

    /**
     * Retrieves a paginated list of credential resources
     * 
     * @param queryOptionsFromRequest - Query parameters for filtering and pagination
     * @param httpResponse - HTTP response object for setting headers
     * @returns Promise<CredentialResponseDTO[]> Array of credential DTOs
     */
    @Get()
    @ApiOperation({
        operationId: 'getAllCredentials',
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
    @ApiGetAllResponse(CredentialResponseDTO)
    @HttpGetResponses()
    @LogMethod()
    async getAllCredentials(
        @Query() queryOptionsFromRequest: QueryOptionFiltersMap,
        @GenericResponse() httpResponse: GenericResponse,
    ): Promise<GetAllResponse<CredentialResponseDTO>> {
        this.logger.log('Processing request to fetch all credentials');

        const credentialsWithMetadata = await this.credentialService.getAllCredentials(
            queryOptionsFromRequest,
            httpResponse
        );

        this.logger.log('Successfully processed request to fetch all credentials');
        return credentialsWithMetadata;
    }

    /**
     * Retrieves a specific credential resource by its identifier
     * 
     * @param id - The unique identifier (UUID) for the credential
     * @param httpResponse - HTTP response object for setting ETag headers
     * @returns Promise<CredentialResponseDTO> Single credential DTO
     */
    @Get(':id')
    @ApiOperation({
        operationId: 'getCredentialById',
        summary: 'Retrieves a specific resource using the resource\'s identifier (using the "Get By Id" pattern).',
        description: 'This GET operation retrieves a resource by the specified resource identifier.',
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'A resource identifier that uniquely identifies the resource.',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiGetSingleResponse(CredentialResponseDTO)
    @HttpGetResponses()
    @LogMethod()
    async getCredentialById(
        @Param('id') id: string,
        @GenericResponse() httpResponse: GenericResponse,
    ): Promise<GetSingleResponse<CredentialResponseDTO>> {
        this.logger.log('Processing request to fetch credential by id');

        const credentialWithETag = await this.credentialService.getCredentialById(
            id,
            httpResponse
        );

        this.logger.log('Successfully processed request to fetch credential by id');
        console.log("credentialWithETag", credentialWithETag);
        return credentialWithETag;
    }

    /**
     * Creates or updates a credential resource (upsert operation)
     * 
     * @param createCredentialRequest - Credential data from request body
     * @param ifNoneMatchHeader - Optional ETag header for preventing duplicates
     * @param httpResponse - HTTP response object
     * @returns Promise<CreateResponse> No content response for successful creation
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        operationId: 'createCredential',
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
        type: CreateCredentialDTO,
        description: 'The JSON representation of the "credential" resource to be created or updated.',
    })
    @ApiCreateResponse()
    @HttpPostResponses()
    @LogMethod()
    async createCredential(
        @Body() createCredentialRequest: CreateCredentialDTO,
        @IfNoneMatch() ifNoneMatchHeader: string,
        @GenericResponse() httpResponse: GenericResponse,
    ): Promise<CreateResponse> {
        this.logger.log('Processing request to create credential');

        await this.credentialService.createCredential(
            createCredentialRequest,
            httpResponse,
            ifNoneMatchHeader,
        );

        this.logger.log('Successfully processed request to create credential');
    }

    /**
     * Updates a credential resource by its identifier
     * 
     * @param id - The unique identifier (UUID) for the credential
     * @param updateCredentialRequest - Credential data from request body
     * @param ifMatchHeader - Required ETag header for concurrency control
     * @param httpResponse - HTTP response object
     * @returns Promise<UpdateResponse> No content response for successful update
     */
    @Put(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        operationId: 'updateCredentialById',
        summary: 'Updates an existing resource based on the resource identifier.',
        description: `The PUT operation is used to update an existing resource by identifier. Clients should NOT include the resource "id" in the JSON body because it will result in an error. The web service will identify the resource to update based on the resource identifier in the URL path.`,
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'A resource identifier that uniquely identifies the resource.',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiHeader({
        name: 'If-Match',
        description: 'The ETag header value used to prevent the update of a resource modified by another party.',
        required: true,
        example: '"2025-05-29T07:53:44.000Z"',
    })
    @ApiBody({
        type: UpdateCredentialDTO,
        description: 'The JSON representation of the "credential" resource to be updated.',
    })
    @ApiUpdateResponse()
    @HttpPutResponses()
    @LogMethod()
    async updateCredentialById(
        @Param('id') id: string,
        @Body() updateCredentialRequest: UpdateCredentialDTO,
        @IfMatch() ifMatchHeader: string,
        @GenericResponse() httpResponse: GenericResponse,
    ): Promise<UpdateResponse> {
        this.logger.log('Processing request to update credential by ID');

        await this.credentialService.updateCredential(
            id,
            updateCredentialRequest,
            ifMatchHeader,
            httpResponse
        );

        this.logger.log('Successfully processed request to update credential by ID');
    }

    /**
     * Deletes a credential resource by its identifier
     * 
     * @param credentialId - The credential identifier from URL parameter
     * @param ifMatchHeader - Required ETag header for concurrency control
     * @returns Promise<DeleteResponse> No content response for successful deletion
     */
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        operationId: 'deleteCredentialById',
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
    async deleteCredentialById(
        @Param('id') credentialId: string,
        @IfMatch() ifMatchHeader: string,
    ): Promise<DeleteResponse> {
        this.logger.log('Processing request to delete credential by ID');

        await this.credentialService.deleteCredential(credentialId, ifMatchHeader);

        this.logger.log('Successfully processed request to delete credential by ID');
    }
} 