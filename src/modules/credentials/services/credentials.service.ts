import { Injectable, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { ETagService } from 'src/common/services/etag.service';
import { IQueryOptions } from 'src/common/interfaces/queryOptions.interface';
import { CustomLogger } from 'src/common/utils/logger/logger.service';
import { LogMethod } from 'src/common/decorators/log-method.decorator';
import { UnknownObjectError } from 'src/common/errors/UnknownObjectError';
import { BadRequestError } from 'src/common/errors/BadRequestError';
import { CredentialRepository } from '../repositories/credentials.repository';
import { CredentialResponseDTO } from '../dto/credential.response.dto';
import { StateAbbreviationDescriptor } from 'src/common/entities/descriptors/state-abbreviation.descriptor';
import { TransactionService } from 'src/common/services/transaction.service';
import { Transactional } from 'src/common/decorators/transaction.decorator';
import { CreateCredentialDTO } from '../dto/create-credential.dto';
import { UpdateCredentialDTO } from '../dto/update-credential.dto';
import { Credential } from 'src/common/entities/credential.entity';
import { Status } from 'src/common/constants/enums';
import { CredentialTypeDescriptor } from 'src/common/entities/descriptors/credential-type.descriptor';
import { CredentialFieldDescriptor } from 'src/common/entities/descriptors/credential-field.descriptor';
import { TeachingCredentialDescriptor } from 'src/common/entities/descriptors/teaching-credential.descriptor';
import { TeachingCredentialBasisDescriptor } from 'src/common/entities/descriptors/teaching-credential-basis.descriptor';
import { FindOptionsWhere } from 'typeorm';
import { UUID } from 'crypto';

@Injectable()
export class CredentialService {
    private readonly logger: CustomLogger = new CustomLogger();

    constructor(
        private readonly credentialRepository: CredentialRepository,
        private readonly etagService: ETagService,
        private readonly transactionService: TransactionService,
    ) {
        this.logger.setContext('CredentialService');
    }

    /**
     * Retrieves a paginated list of credentials based on query options
     * Only returns active records (not deleted or inactive)
     * 
     * @param queryOptionsFromRequest - Query parameters for filtering and pagination
     * @param httpResponse - HTTP response object for setting headers
     * @returns Promise<CredentialResponseDTO[]> Array of credential DTOs
     */
    @LogMethod()
    @UseInterceptors(CacheInterceptor)
    @CacheKey('all-credentials')
    @CacheTTL(3600)
    async getAllCredentials(
        queryOptionsFromRequest: IQueryOptions,
        httpResponse: any,
    ): Promise<CredentialResponseDTO[]> {
        const cacheKey = 'all-credentials';
        this.logger.log('Starting process to retrieve all credentials', { cacheKey });

        // [Step-1]: Retrieve credentials from repository with active status filter
        const [credentialsFromDatabase, totalCredentialsCount]: [any[], number] = 
            await this.credentialRepository.findAllBy(queryOptionsFromRequest, { status: Status.ACTIVE });

        // [Step-2]: Handle empty result set
        if (!credentialsFromDatabase || credentialsFromDatabase.length === 0) {
            this.logger.log('No credentials found matching the criteria');
            return [];
        }

        // [Step-3]: Set total count header if requested
        if (queryOptionsFromRequest.totalCount) {
            httpResponse.setHeader('Total-Count', totalCredentialsCount.toString());
            this.logger.log(`Set Total-Count header: ${totalCredentialsCount}`);
        }

        // [Step-4]: Transform entities to DTOs
        const credentialDTOsForResponse: CredentialResponseDTO[] = credentialsFromDatabase.map(
            credential => new CredentialResponseDTO(credential)
        );

        this.logger.log(`Successfully retrieved ${credentialDTOsForResponse.length} credentials`);
        return credentialDTOsForResponse;
    }

    /**
     * Retrieves a specific credential by its unique identifier
     * Only returns active records (not deleted or inactive)
     * 
     * @param id - The unique identifier (UUID) for the credential
     * @param httpResponse - HTTP response object for setting ETag headers
     * @returns Promise<CredentialResponseDTO> Single credential DTO
     * @throws BadRequestError if credential ID is invalid
     * @throws UnknownObjectError if credential is not found or not active
     */
    @LogMethod()
    @UseInterceptors(CacheInterceptor)
    @CacheKey('credential-by-id')
    @CacheTTL(3600)
    async getCredentialById(
        id: string,
        httpResponse: any,
    ): Promise<CredentialResponseDTO> {
        this.logger.log('Starting process to retrieve credential by id', { id });

        // [Step-1]: Validate input parameters
        if (!id?.trim()) {
            throw new BadRequestError('Credential id is required');
        }

        // [Step-2]: Retrieve credential from repository with active status filter
        const credentialFromDatabase = await this.credentialRepository.findById(id, Status.ACTIVE);

        // [Step-3]: Handle credential not found
        if (!credentialFromDatabase) {
            this.logger.warn(`Credential with ID ${id} not found or not active`);
            throw new UnknownObjectError(`Credential with ID ${id} not found`);
        }

        // [Step-4]: Transform to DTO and set ETag header
        const credentialDTOForResponse: CredentialResponseDTO = new CredentialResponseDTO(credentialFromDatabase);
        httpResponse.setHeader('ETag', credentialDTOForResponse._etag);

        this.logger.log(`Successfully retrieved credential with id ${id}`);
        return credentialDTOForResponse;
    }

    /**
     * Creates a new credential resource
     * 
     * **IMPORTANT**: This method performs comprehensive constraint validation:
     * - Checks if record exists by primary key/ID
     * - Checks if record exists by all unique key constraints
     * - Validates all descriptor references
     * - Throws BadRequestError if record already exists
     * 
     * @param createCredentialRequest - Validated credential data from request
     * @returns Promise<void> No return value for successful creation
     * @throws BadRequestError for constraint violations or validation errors
     */
    @LogMethod()
    @Transactional()
    async createCredential(
        createCredentialRequest: CreateCredentialDTO,
        httpResponse: any,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ifNoneMatchHeader: string,
    ): Promise<void> {
        return this.transactionService.executeInTransaction(async (queryRunner) => {
            this.logger.log('Starting process to create credential');

            // [Step-1]: Check for existing record by PRIMARY KEY/ID
            let existingCredentialByPrimaryKey: Credential | null = null;
            if (createCredentialRequest.id) {
                existingCredentialByPrimaryKey = await this.credentialRepository.findById(createCredentialRequest.id);
                if (existingCredentialByPrimaryKey) {
                    this.logger.warn(`Credential with primary key ${createCredentialRequest.id} already exists`);
                    throw new BadRequestError(`Credential with ID ${createCredentialRequest.id} already exists`);
                }
            }

            // [Step-2]: Check for existing record by COMPOSITE/NATURAL KEY
            const compositeKeyWhere: FindOptionsWhere<Credential> = {
                credentialIdentifier: createCredentialRequest.credentialIdentifier,
                stateOfIssueStateAbbreviationDescriptorId: parseInt(createCredentialRequest.stateOfIssueStateAbbreviationDescriptor)
            };

            const existingCredentialByCompositeKey: Credential | null = 
                await this.credentialRepository.findByCompositeKey(compositeKeyWhere);

            if (existingCredentialByCompositeKey) {
                this.logger.warn('Credential already exists with the same composite key');
                throw new BadRequestError('Credential already exists with the same identifier and state combination');
            }

            // [Step-3]: Validate descriptor references
            await this.validateDescriptorReferences(createCredentialRequest, queryRunner);

            // [Step-4]: Create credential entity from validated request
            const credentialEntityToSave: Credential = this.createCredentialEntityFromRequest(createCredentialRequest);

            // [Step-5]: Save new credential using transaction repository
            const repository = this.transactionService.getRepository(Credential, queryRunner);
            const savedCredential = await repository.save({
                ...credentialEntityToSave,
                createdate: new Date(),
                lastmodifieddate: new Date()
            });

            // [Step-6]: Retrieve the saved credential with relationships loaded for DTO creation using transaction
            const credentialWithRelationships = await repository.findOne({
                where: { id: savedCredential.id },
                relations: {
                    credentialFieldDescriptor: true,
                    credentialTypeDescriptor: true,
                    stateOfIssueStateAbbreviationDescriptor: true,
                    teachingCredentialDescriptor: true,
                    teachingCredentialBasisDescriptor: true,
                }
            });
            
            if (!credentialWithRelationships) {
                this.logger.error(`Failed to retrieve created credential with ID ${savedCredential.id}`);
                throw new UnknownObjectError(`Failed to retrieve created credential with ID ${savedCredential.id}`);
            }

            // [Step-7]: Resolve lazy-loaded relationships
            const resolvedCredential = await this.credentialRepository.resolveCredentialDescriptors(credentialWithRelationships);

            // [Step-8]: Set ETag header for the created credential
            const createdCredentialDTO: CredentialResponseDTO = new CredentialResponseDTO(resolvedCredential);
            httpResponse.setHeader('ETag', createdCredentialDTO._etag);

            this.logger.log('Successfully created credential');
        });
    }

    /**
     * Validates all descriptor references in the credential request
     * 
     * @param credentialRequest - The request containing descriptor references (CreateCredentialDTO or UpdateCredentialDTO)
     * @param queryRunner - The transaction query runner
     * @throws BadRequestError if any descriptor reference is invalid
     */
    private async validateDescriptorReferences(
        credentialRequest: CreateCredentialDTO | UpdateCredentialDTO,
        queryRunner: any
    ): Promise<void> {
        // Validate required descriptors
        const stateAbbrevRepo = this.transactionService.getRepository(StateAbbreviationDescriptor, queryRunner);
        const credTypeRepo = this.transactionService.getRepository(CredentialTypeDescriptor, queryRunner);

        const stateAbbrev = await stateAbbrevRepo.findOne({
            where: { stateAbbreviationDescriptorId: parseInt(credentialRequest.stateOfIssueStateAbbreviationDescriptor) }
        });
        if (!stateAbbrev) {
            throw new BadRequestError(`Invalid state abbreviation descriptor: ${credentialRequest.stateOfIssueStateAbbreviationDescriptor}`);
        }

        const credType = await credTypeRepo.findOne({
            where: { credentialTypeDescriptorId: parseInt(credentialRequest.credentialTypeDescriptor) }
        });
        if (!credType) {
            throw new BadRequestError(`Invalid credential type descriptor: ${credentialRequest.credentialTypeDescriptor}`);
        }

        // Validate optional descriptors if provided
        if (credentialRequest.credentialFieldDescriptor) {
            const credFieldRepo = this.transactionService.getRepository(CredentialFieldDescriptor, queryRunner);
            const credField = await credFieldRepo.findOne({
                where: { credentialFieldDescriptorId: parseInt(credentialRequest.credentialFieldDescriptor) }
            });
            if (!credField) {
                throw new BadRequestError(`Invalid credential field descriptor: ${credentialRequest.credentialFieldDescriptor}`);
            }
        }

        if (credentialRequest.teachingCredentialDescriptor) {
            const teachCredRepo = this.transactionService.getRepository(TeachingCredentialDescriptor, queryRunner);
            const teachCred = await teachCredRepo.findOne({
                where: { teachingCredentialDescriptorId: parseInt(credentialRequest.teachingCredentialDescriptor) }
            });
            if (!teachCred) {
                throw new BadRequestError(`Invalid teaching credential descriptor: ${credentialRequest.teachingCredentialDescriptor}`);
            }
        }

        if (credentialRequest.teachingCredentialBasisDescriptor) {
            const teachCredBasisRepo = this.transactionService.getRepository(TeachingCredentialBasisDescriptor, queryRunner);
            const teachCredBasis = await teachCredBasisRepo.findOne({
                where: { teachingCredentialBasisDescriptorId: parseInt(credentialRequest.teachingCredentialBasisDescriptor) }
            });
            if (!teachCredBasis) {
                throw new BadRequestError(`Invalid teaching credential basis descriptor: ${credentialRequest.teachingCredentialBasisDescriptor}`);
            }
        }
    }

    /**
     * Updates an existing credential resource
     * 
     * **IMPORTANT**: This method performs comprehensive validation:
     * - Validates the resource exists and is active
     * - Validates ETag for concurrency control
     * - Validates all descriptor references
     * - Updates the resource with new data
     * 
     * @param id - The unique identifier (UUID) for the credential
     * @param updateCredentialRequest - Validated credential data from request
     * @param ifMatchHeader - Required ETag header for concurrency control
     * @param httpResponse - HTTP response object for setting ETag headers
     * @returns Promise<CredentialResponseDTO> Updated credential DTO
     * @throws BadRequestError for validation errors
     * @throws UnknownObjectError if credential is not found
     */
    @LogMethod()
    @Transactional()
    async updateCredential(
        id: string,
        updateCredentialRequest: UpdateCredentialDTO,
        ifMatchHeader: string,
        httpResponse: any,
    ): Promise<void> {
        return this.transactionService.executeInTransaction(async (queryRunner) => {
            this.logger.log('Starting process to update credential', { id });

            // [Step-1]: Validate if-match header
            if (!ifMatchHeader?.trim()) {
                throw new BadRequestError('If-Match header is required for update operations');
            }

            // [Step-2]: Retrieve existing credential for validation
            const existingCredentialFromDatabase: Credential | null = 
                await this.credentialRepository.findById(id, Status.ACTIVE);

            if (!existingCredentialFromDatabase) {
                this.logger.warn(`Credential with ID ${id} not found or not active`);
                throw new UnknownObjectError(`Credential with ID ${id} not found`);
            }

            // [Step-3]: Validate ETag for concurrency control
            const existingCredentialDTO: CredentialResponseDTO = new CredentialResponseDTO(existingCredentialFromDatabase);
            this.etagService.validateIfMatch(ifMatchHeader, existingCredentialDTO._etag);

            // [Step-4]: Check for composite key conflicts (excluding current record)
            const compositeKeyWhere: FindOptionsWhere<Credential> = {
                credentialIdentifier: updateCredentialRequest.credentialIdentifier,
                stateOfIssueStateAbbreviationDescriptorId: parseInt(updateCredentialRequest.stateOfIssueStateAbbreviationDescriptor)
            };

            const existingCredentialByCompositeKey: Credential | null = 
                await this.credentialRepository.findByCompositeKey(compositeKeyWhere);

            if (existingCredentialByCompositeKey && existingCredentialByCompositeKey.id !== id) {
                this.logger.warn('Another credential already exists with the same composite key');
                throw new BadRequestError('Another credential already exists with the same identifier and state combination');
            }

            // [Step-5]: Validate descriptor references
            await this.validateDescriptorReferences(updateCredentialRequest, queryRunner);

            // [Step-6]: Create updated credential entity
            const updatedCredentialEntity: Credential = this.createCredentialEntityFromRequest(updateCredentialRequest);

            // [Step-7]: Update credential using transaction repository
            const updateResult = await this.credentialRepository.updateByWhere(
                { id: id } as FindOptionsWhere<Credential>,
                {
                    ...updatedCredentialEntity,
                    lastmodifieddate: new Date()
                }
            );

            if (!updateResult.affected || updateResult.affected === 0) {
                this.logger.error(`Failed to update credential with ID ${id}`);
                throw new UnknownObjectError(`Failed to update credential with ID ${id}`);
            }

            // [Step-8]: Retrieve and return updated credential
            const updatedCredentialFromDatabase: Credential | null = 
                await this.credentialRepository.findById(id, Status.ACTIVE);

            if (!updatedCredentialFromDatabase) {
                this.logger.error(`Failed to retrieve updated credential with ID ${id}`);
                throw new UnknownObjectError(`Failed to retrieve updated credential with ID ${id}`);
            }

            // [Step-9]: Transform to DTO and set ETag header
            const updatedCredentialDTO: CredentialResponseDTO = new CredentialResponseDTO(updatedCredentialFromDatabase);
            httpResponse.setHeader('ETag', updatedCredentialDTO._etag);

            this.logger.log(`Successfully updated credential with ID ${id}`);
        });
    }



    /**
     * Deletes a credential by their identifier (soft delete)
     * 
     * @param credentialId - Credential identifier as string from request
     * @param ifMatchHeader - Required ETag header for concurrency control
     * @returns Promise<void> No return value for successful deletion
     * @throws BadRequestError if credential ID is invalid or ETag is missing
     * @throws UnknownObjectError if credential is not found
     */
    @LogMethod()
    async deleteCredential(
        credentialId: string,
        ifMatchHeader: string,
    ): Promise<void> {
        this.logger.log('Starting process to delete credential');

        // [Step-1]: Validate ETag header presence
        if (!ifMatchHeader?.trim()) {
            throw new BadRequestError('If-Match header is required for delete operations');
        }

        // [Step-2]: Convert and validate credential ID
        if (!credentialId?.trim()) {
            throw new BadRequestError('Credential ID is required');
        }

        // [Step-3]: Retrieve existing credential for validation
        const existingCredentialFromDatabase: Credential | null = 
            await this.credentialRepository.findById(credentialId);

        // [Step-4]: Handle credential not found
        if (!existingCredentialFromDatabase) {
            this.logger.warn(`Credential with ID ${credentialId} not found for deletion`);
            throw new UnknownObjectError(`Credential with ID ${credentialId} not found`);
        }

        // [Step-5]: Validate ETag for concurrency control
        const existingCredentialDTO: CredentialResponseDTO = new CredentialResponseDTO(existingCredentialFromDatabase);
        this.etagService.validateIfMatch(ifMatchHeader, existingCredentialDTO._etag);

        // [Step-6]: Perform soft deletion
        const updateResult = await this.credentialRepository.updateByWhere(
            { id: credentialId } as FindOptionsWhere<Credential>,
            {
                status: Status.DELETED,
                deletedate: new Date(),
                lastmodifieddate: new Date()
            }
        );

        // [Step-7]: Handle deletion failure
        if (!updateResult.affected || updateResult.affected === 0) {
            this.logger.error(`Failed to delete credential with ID ${credentialId}`);
            throw new UnknownObjectError(`Failed to delete credential with ID ${credentialId}`);
        }

        this.logger.log(`Successfully soft deleted credential with ID ${credentialId}`);
    }

    /**
     * Helper method to create a Credential entity from a credential request DTO
     * 
     * @param credentialRequest - The validated request DTO (CreateCredentialDTO or UpdateCredentialDTO)
     * @returns Credential - A new Credential entity
     */
    private createCredentialEntityFromRequest(credentialRequest: CreateCredentialDTO | UpdateCredentialDTO): Credential {
        const credentialEntity = new Credential();

        // Map all fields from request to entity
        credentialEntity.id = credentialRequest.id as UUID;
        credentialEntity.credentialIdentifier = credentialRequest.credentialIdentifier;
        credentialEntity.stateOfIssueStateAbbreviationDescriptorId = credentialRequest.stateOfIssueStateAbbreviationDescriptor ? parseInt(credentialRequest.stateOfIssueStateAbbreviationDescriptor) : null;
        credentialEntity.effectiveDate = credentialRequest.effectiveDate ? new Date(credentialRequest.effectiveDate) : null;
        credentialEntity.expirationDate = credentialRequest.expirationDate ? new Date(credentialRequest.expirationDate) : null;
        credentialEntity.credentialFieldDescriptorId = credentialRequest.credentialFieldDescriptor ? parseInt(credentialRequest.credentialFieldDescriptor) : null;
        credentialEntity.issuanceDate = credentialRequest.issuanceDate ? new Date(credentialRequest.issuanceDate) : null;
        credentialEntity.credentialTypeDescriptorId = credentialRequest.credentialTypeDescriptor ? parseInt(credentialRequest.credentialTypeDescriptor) : null;
        credentialEntity.teachingCredentialDescriptorId = credentialRequest.teachingCredentialDescriptor ? parseInt(credentialRequest.teachingCredentialDescriptor) : null;
        credentialEntity.teachingCredentialBasisDescriptorId = credentialRequest.teachingCredentialBasisDescriptor ? parseInt(credentialRequest.teachingCredentialBasisDescriptor) : null;
        credentialEntity.namespace = credentialRequest.namespace;

        return credentialEntity;
    }
} 