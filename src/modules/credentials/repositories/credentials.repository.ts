import {
    FindOptionsWhere,
    Repository,
    UpdateResult
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { IQueryOptions } from 'src/common/interfaces/queryOptions.interface';
import { LogMethod } from 'src/common/decorators/log-method.decorator';
import BaseRepository from 'src/common/repositories/baseRepository.repository';
import { Credential } from 'src/common/entities/credential.entity';
import { StateAbbreviationDescriptor } from 'src/common/entities/descriptors/state-abbreviation.descriptor';
import { Status } from 'src/common/constants/enums';

@Injectable()
export class CredentialRepository extends BaseRepository<Credential> {
    constructor(
        @InjectRepository(Credential)
        private readonly credentialRepository: Repository<Credential>,
        @InjectRepository(StateAbbreviationDescriptor)
        private readonly stateAbbreviationDescriptorRepository: Repository<StateAbbreviationDescriptor>,
    ) {
        super(credentialRepository);
        this.logger.setContext('CredentialRepository');
    }

    async resolveCredentialDescriptors(credential: Credential): Promise<Credential> {
        const credentialWithResolvedPromises = {
            ...credential,
            credentialFieldDescriptor: credential.credentialFieldDescriptor ? await credential.credentialFieldDescriptor : null,
            credentialTypeDescriptor: credential.credentialTypeDescriptor ? await credential.credentialTypeDescriptor : null,
            stateOfIssueStateAbbreviationDescriptor: credential.stateOfIssueStateAbbreviationDescriptor ? await credential.stateOfIssueStateAbbreviationDescriptor : null,
            teachingCredentialDescriptor: credential.teachingCredentialDescriptor ? await credential.teachingCredentialDescriptor : null,
            teachingCredentialBasisDescriptor: credential.teachingCredentialBasisDescriptor ? await credential.teachingCredentialBasisDescriptor : null,
        } as unknown as Credential;

        return credentialWithResolvedPromises;
    }

    /**
     * Fetches an array of Credential entities along with the total count, using the
     * provided IQueryOptions and FindOptionsWhere as filters.
     * **IMPORTANT**: This method properly handles lazy-loaded foreign relationships.
     *
     * @param queryOptions - The IQueryOptions object that contains the limit, offset parameters
     * @param whereConditions - The FindOptionsWhere object that contains the conditions for the where clause
     * @returns Promise<[Credential[], number]> A tuple containing an array of Credential entities 
     *                                         and the total count matching the criteria
     */
    @LogMethod()
    async findAllBy(
        queryOptions: IQueryOptions,
        whereConditions: FindOptionsWhere<Credential>,
    ): Promise<[Credential[], number]> {
        const { limit, offset } = queryOptions;

        this.logger.log('Executing findAndCount query for credentials', {
            limit,
            offset,
            whereConditions
        });

        // [Step-1]: Execute database query with pagination and filtering
        const [credentialsFromDatabase, totalCountFromDatabase]: [Credential[], number] =
            await this.credentialRepository.findAndCount({
                where: whereConditions,
                relations: {
                    // Load all descriptor relationships for DTO transformation
                    credentialFieldDescriptor: true,
                    credentialTypeDescriptor: true,
                    stateOfIssueStateAbbreviationDescriptor: true,
                    teachingCredentialDescriptor: true,
                    teachingCredentialBasisDescriptor: true,
                },
                skip: offset,
                take: limit,
                order: {
                    credentialIdentifier: 'ASC',
                    stateOfIssueStateAbbreviationDescriptorId: 'ASC',
                },
            });

        const credentialsWithResolvedPromises = await Promise.all(credentialsFromDatabase.map(async (credential) => this.resolveCredentialDescriptors(credential)));

        this.logger.log('Successfully executed findAndCount query', {
            foundCredentials: credentialsWithResolvedPromises.length,
            totalCount: totalCountFromDatabase
        });

        return [credentialsWithResolvedPromises, totalCountFromDatabase];
    }

    /**
     * Finds a single Credential entity by composite/natural key
     * Used for constraint validation in create operations
     * 
     * @param compositeKey - Object containing the natural key fields
     * @returns Promise<Credential | null> The Credential entity if found, null otherwise
     */
    @LogMethod()
    async findByCompositeKey(compositeKey: FindOptionsWhere<Credential>): Promise<Credential | null> {
        this.logger.log('Executing findOne query by composite key', { compositeKey });

        const credentialFromDatabase: Credential | null = await this.credentialRepository.findOne({
            where: compositeKey,
            relations: {
                credentialFieldDescriptor: true,
                credentialTypeDescriptor: true,
                stateOfIssueStateAbbreviationDescriptor: true,
                teachingCredentialDescriptor: true,
                teachingCredentialBasisDescriptor: true
            }
        });

        this.logger.log('Completed findOne query by composite key', {
            compositeKey,
            found: !!credentialFromDatabase
        });

        return credentialFromDatabase;
    }

    /**
     * Finds a StateAbbreviationDescriptor by its code value
     * Used to convert state abbreviation codes to descriptor IDs
     * 
     * @param stateAbbreviation - The state abbreviation code (e.g., 'TX')
     * @returns Promise<StateAbbreviationDescriptor | null> The descriptor if found, null otherwise
     */
    @LogMethod()
    async findStateAbbreviationDescriptorByCode(
        stateAbbreviation: string
    ): Promise<StateAbbreviationDescriptor | null> {
        this.logger.log('Executing findOne query for state abbreviation descriptor', { stateAbbreviation });

        const descriptorFromDatabase = await this.stateAbbreviationDescriptorRepository.findOne({
            where: {
                codeValue: stateAbbreviation.toUpperCase(),
            } as FindOptionsWhere<StateAbbreviationDescriptor>
        });

        this.logger.log('Completed findOne query for state abbreviation descriptor', {
            stateAbbreviation,
            found: !!descriptorFromDatabase
        });

        return descriptorFromDatabase;
    }

    /**
     * Finds a single Credential entity by its unique identifier
     * **IMPORTANT**: This method properly handles lazy-loaded foreign relationships.
     * 
     * @param id - The unique identifier (UUID) for the credential
     * @param status - Optional status filter (ACTIVE, INACTIVE, DELETED)
     * @returns Promise<Credential | null> The Credential entity if found, null otherwise
     */
    @LogMethod()
    async findById(id: string, status?: Status): Promise<Credential | null> {
        this.logger.log('Executing findOne query by id', { id, status });

        // [Step-1]: Build where conditions with proper UUID type casting
        const whereConditions: FindOptionsWhere<Credential> = {
            id: id as `${string}-${string}-${string}-${string}-${string}`
        };
        if (status) {
            whereConditions.status = status;
        }

        // [Step-2]: Execute database query
        const credentialFromDatabase = await this.credentialRepository.findOne({
            where: whereConditions,
            relations: {
                // Load all descriptor relationships for DTO transformation
                credentialFieldDescriptor: true,
                credentialTypeDescriptor: true,
                stateOfIssueStateAbbreviationDescriptor: true,
                teachingCredentialDescriptor: true,
                teachingCredentialBasisDescriptor: true,
            }
        });

        if (!credentialFromDatabase) {
            this.logger.log('Credential not found', { id });
            return null;
        }

        const credentialWithResolvedPromises = await this.resolveCredentialDescriptors(credentialFromDatabase);
        this.logger.log('Successfully resolved relationships for credential', { id });

        return credentialWithResolvedPromises;
    }

    /**
     * Deletes a credential by its identifier
     * 
     * @param id - The credential identifier to delete
     * @returns Promise<boolean> True if deletion was successful, false otherwise
     */
    @LogMethod()
    async deleteCredential(id: string): Promise<boolean> {
        this.logger.log('Executing delete operation', { id });

        const deleteResult = await this.credentialRepository.delete({ 
            id: id as unknown as string
        } as FindOptionsWhere<Credential>);

        const wasDeleted = deleteResult.affected === 1;
        this.logger.log('Completed delete operation', { 
            id,
            wasDeleted,
            affectedRows: deleteResult.affected 
        });

        return wasDeleted;
    }

    /**
     * Updates a credential entity with the given criteria and values
     * 
     * @param criteria - The criteria to find the credential to update
     * @param updateValues - The values to update
     * @returns Promise<UpdateResult> The result of the update operation
     */
    @LogMethod()
    async updateByWhere(
        criteria: FindOptionsWhere<Credential>,
        updateValues: Partial<Credential>
    ): Promise<UpdateResult> {
        this.logger.log('Executing update operation', { criteria, updateValues });
        return this.credentialRepository.update(criteria, updateValues);
    }
} 