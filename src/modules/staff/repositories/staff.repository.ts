import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { LogMethod } from 'src/common/decorators/log-method.decorator';
import BaseRepository from 'src/common/repositories/baseRepository.repository';
import { Staff } from 'src/common/entities/staff.entity';
import { IQueryOptions } from 'src/common/interfaces/queryOptions.interface';
import { Status } from 'src/common/constants/enums';
import { UUID } from 'crypto';
import { SexDescriptor } from 'src/common/entities/descriptors/sex.descriptor.entity';
import { OldEthnicityDescriptor } from 'src/common/entities/descriptors/old-ethnicity.descriptor.entity';
import { CitizenshipStatusDescriptor } from 'src/common/entities/descriptors/citizenship-status.descriptor.entity';
import { LevelOfEducationDescriptor } from 'src/common/entities/descriptors/level-of-education.descriptor.entity';

@Injectable()
export class StaffRepository extends BaseRepository<Staff> {
    constructor(
        @InjectRepository(Staff)
        private readonly staffRepository: Repository<Staff>,
        @InjectRepository(SexDescriptor)
        private readonly sexDescriptorRepository: Repository<SexDescriptor>,
        @InjectRepository(OldEthnicityDescriptor)
        private readonly oldEthnicityDescriptorRepository: Repository<OldEthnicityDescriptor>,
        @InjectRepository(CitizenshipStatusDescriptor)
        private readonly citizenshipStatusDescriptorRepository: Repository<CitizenshipStatusDescriptor>,
        @InjectRepository(LevelOfEducationDescriptor)
        private readonly levelOfEducationDescriptorRepository: Repository<LevelOfEducationDescriptor>,
    ) {
        super(staffRepository);
        this.logger.setContext('StaffRepository');
    }

    /**
     * Helper method to resolve all lazy-loaded descriptor relationships
     * 
     * @param staff - The Staff entity with lazy-loaded relationships
     * @returns Promise<Staff> Staff entity with resolved relationships
     */
    private async resolveStaffDescriptors(staff: Staff): Promise<Staff> {
        const staffWithResolvedPromises = {
            ...staff,
            sexDescriptor: staff.sexDescriptor ? await staff.sexDescriptor : null,
            oldEthnicityDescriptor: staff.oldEthnicityDescriptor ? await staff.oldEthnicityDescriptor : null,
            citizenshipStatusDescriptor: staff.citizenshipStatusDescriptor ? await staff.citizenshipStatusDescriptor : null,
            highestCompletedLevelOfEducationDescriptor: staff.highestCompletedLevelOfEducationDescriptor ? await staff.highestCompletedLevelOfEducationDescriptor : null,
        } as Staff;

        return staffWithResolvedPromises;
    }

    /**
     * Fetches an array of Staff entities along with the total count, using the
     * provided IQueryOptions and FindOptionsWhere as filters.
     * **IMPORTANT**: This method properly handles lazy-loaded foreign relationships.
     *
     * @param queryOptions - The IQueryOptions object that contains the limit, offset parameters
     * @param whereConditions - The FindOptionsWhere object that contains the conditions for the where clause
     * @returns Promise<[Staff[], number]> A tuple containing an array of Staff entities 
     *                                    and the total count matching the criteria
     */
    @LogMethod()
    async findAllBy(
        queryOptions: IQueryOptions,
        whereConditions: FindOptionsWhere<Staff>,
    ): Promise<[Staff[], number]> {
        const { limit, offset } = queryOptions;

        this.logger.log('Executing findAndCount query for staff', {
            limit,
            offset,
            whereConditions
        });

        // [Step-1]: Execute database query with pagination and filtering
        const [staffFromDatabase, totalCountFromDatabase]: [Staff[], number] =
            await this.staffRepository.findAndCount({
                where: whereConditions,
                relations: {
                    // Load all descriptor relationships for DTO transformation
                    sexDescriptor: true,
                    oldEthnicityDescriptor: true,
                    citizenshipStatusDescriptor: true,
                    highestCompletedLevelOfEducationDescriptor: true,
                },
                skip: offset,
                take: limit,
                order: {
                    staffUsi: 'ASC',
                },
            });

        // [Step-2]: Resolve lazy-loaded relationships
        const staffWithResolvedPromises = await Promise.all(
            staffFromDatabase.map(async (staff) => this.resolveStaffDescriptors(staff))
        );

        this.logger.log('Successfully executed findAndCount query', {
            foundStaff: staffWithResolvedPromises.length,
            totalCount: totalCountFromDatabase
        });

        return [staffWithResolvedPromises, totalCountFromDatabase];
    }

    /**
     * Finds a single Staff entity by their unique identifier
     * **IMPORTANT**: This method properly handles lazy-loaded foreign relationships.
     * 
     * @param id - The Staff unique system identifier (staffUsi)
     * @param status - Optional status filter (ACTIVE, INACTIVE, DELETED)
     * @returns Promise<Staff | null> The Staff entity if found, null otherwise
     */
    @LogMethod()
    override async findById(id: UUID, status?: Status): Promise<Staff | null> {
        this.logger.log('Executing findOne query by staffUsi', { id, status });

        // [Step-1]: Build where conditions
        const whereConditions: FindOptionsWhere<Staff> = { id };
        if (status) {
            whereConditions.status = status;
        }

        // [Step-2]: Execute database query
        const staffFromDatabase = await this.staffRepository.findOne({
            where: whereConditions,
            relations: {
                // Load all descriptor relationships for DTO transformation
                sexDescriptor: true,
                oldEthnicityDescriptor: true,
                citizenshipStatusDescriptor: true,
                highestCompletedLevelOfEducationDescriptor: true,
            }
        });

        if (!staffFromDatabase) {
            this.logger.log('Staff not found', { id });
            return null;
        }

        // [Step-3]: Resolve lazy-loaded relationships
        const staffWithResolvedPromises = await this.resolveStaffDescriptors(staffFromDatabase);
        this.logger.log('Successfully resolved relationships for staff', { id });

        return staffWithResolvedPromises;
    }

    /**
     * Finds a single Staff entity by their unique identifier
     * Used for constraint validation in create operations
     * 
     * @param staffUniqueId - The Staff unique identifier
     * @returns Promise<Staff | null> The Staff entity if found, null otherwise
     */
    @LogMethod()
    async findByUniqueId(staffUniqueId: string): Promise<Staff | null> {
        this.logger.log('Executing findOne query by staffUniqueId', { staffUniqueId });

        const staffFromDatabase = await this.staffRepository.findOne({
            where: { staffUniqueId }
        });

        this.logger.log('Completed findOne query by staffUniqueId', {
            staffUniqueId,
            found: !!staffFromDatabase
        });

        return staffFromDatabase;
    }

    /**
     * Validates a sex descriptor by its ID
     * 
     * @param sexDescriptorId - The sex descriptor ID to validate
     * @returns Promise<boolean> True if descriptor exists, false otherwise
     */
    @LogMethod()
    async validateSexDescriptor(sexDescriptorId: number): Promise<boolean> {
        const descriptor = await this.sexDescriptorRepository.findOne({
            where: { sexDescriptorId }
        });
        return !!descriptor;
    }

    /**
     * Validates an old ethnicity descriptor by its ID
     * 
     * @param oldEthnicityDescriptorId - The old ethnicity descriptor ID to validate
     * @returns Promise<boolean> True if descriptor exists, false otherwise
     */
    @LogMethod()
    async validateOldEthnicityDescriptor(oldEthnicityDescriptorId: number): Promise<boolean> {
        const descriptor = await this.oldEthnicityDescriptorRepository.findOne({
            where: { oldEthnicityDescriptorId }
        });
        return !!descriptor;
    }

    /**
     * Validates a citizenship status descriptor by its ID
     * 
     * @param citizenshipStatusDescriptorId - The citizenship status descriptor ID to validate
     * @returns Promise<boolean> True if descriptor exists, false otherwise
     */
    @LogMethod()
    async validateCitizenshipStatusDescriptor(citizenshipStatusDescriptorId: number): Promise<boolean> {
        const descriptor = await this.citizenshipStatusDescriptorRepository.findOne({
            where: { citizenshipStatusDescriptorId }
        });
        return !!descriptor;
    }

    /**
     * Validates a level of education descriptor by its ID
     * 
     * @param levelOfEducationDescriptorId - The level of education descriptor ID to validate
     * @returns Promise<boolean> True if descriptor exists, false otherwise
     */
    @LogMethod()
    async validateLevelOfEducationDescriptor(levelOfEducationDescriptorId: number): Promise<boolean> {
        const descriptor = await this.levelOfEducationDescriptorRepository.findOne({
            where: { levelOfEducationDescriptorId }
        });
        return !!descriptor;
    }

    /**
     * Soft deletes a Staff entity by updating status and timestamps
     * 
     * @param id - The Staff identifier to delete
     * @returns Promise<boolean> True if deletion was successful, false if no rows were affected
     */
    @LogMethod()
    async deleteStaff(id: string): Promise<boolean> {
        this.logger.log('Executing soft delete operation for staff', { id });

        // [Step-1]: Prepare soft delete data
        const updateData = {
            status: Status.DELETED,
            deletedate: new Date(),
            lastmodifieddate: new Date()
        };

        // [Step-2]: Execute soft delete operation
        const updateResult = await this.staffRepository.update(
            { staffUsi: parseInt(id) },
            updateData
        );

        // [Step-3]: Determine if deletion was successful based on affected rows
        const deletionWasSuccessful: boolean = (updateResult.affected || 0) > 0;

        this.logger.log('Completed soft delete operation for staff', {
            id,
            successful: deletionWasSuccessful,
            affectedRows: updateResult.affected
        });

        return deletionWasSuccessful;
    }
} 