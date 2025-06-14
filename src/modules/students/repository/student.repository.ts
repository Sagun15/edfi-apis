import {
    FindOptionsWhere,
    Repository,
    DeepPartial,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { IQueryOptions } from 'src/common/interfaces/queryOptions.interface';
import { LogMethod } from 'src/common/decorators/log-method.decorator';
import BaseRepository from 'src/common/repositories/baseRepository.repository';
import { Status } from 'src/common/constants/enums';
import { Student } from 'src/common/entities/student.entity';

/**
 * Student Repository
 * 
 * Handles all database operations for Student entities.
 * This repository follows the data access layer pattern and only contains
 * database interaction logic without any business rules or validation.
 */
@Injectable()
export class StudentRepository extends BaseRepository<Student> {
    constructor(
        @InjectRepository(Student)
        private readonly studentRepository: Repository<Student>,
    ) {
        super(studentRepository);
        this.logger.setContext('StudentRepository');
    }

    /**
     * Fetches an array of Student entities along with the total count, using the
     * provided IQueryOptions and FindOptionsWhere as filters.
     * **IMPORTANT**: This method properly handles lazy-loaded foreign relationships.
     *
     * @param queryOptions - The IQueryOptions object that contains the limit, offset parameters
     * @param whereConditions - The FindOptionsWhere object that contains the conditions for the where clause
     * @returns Promise<[Student[], number]> A tuple containing an array of Student entities 
     *                                       and the total count matching the criteria
     */
    @LogMethod()
    async findAllBy(
        queryOptions: IQueryOptions,
        whereConditions: FindOptionsWhere<Student>,
    ): Promise<[Student[], number]> {
        const { limit, offset } = queryOptions;

        this.logger.log('Executing findAndCount query for students', {
            limit,
            offset,
            whereConditions
        });

        // [Step-1]: Execute database query with pagination and filtering
        const [studentsFromDatabase, totalCountFromDatabase]: [Student[], number] = 
            await this.studentRepository.findAndCount({
                where: whereConditions,
                relations: {
                    // **AUTO-DISCOVERED**: Load all foreign key relationships for DTO transformation
                    citizenshipStatusDescriptor: true,
                    birthCountryDescriptor: true,
                    birthSexDescriptor: true,
                    birthStateAbbreviationDescriptor: true,
                },
                skip: offset,
                take: limit,
                order: {
                    studentUsi: 'ASC',
                },
            });

        // [Step-2]: Resolve all lazy-loaded relationships using helper method
        const studentsWithResolvedPromises = await Promise.all(
            studentsFromDatabase.map(async (student) => 
                this.resolveStudentRelationships(student)
            )
        );

        this.logger.log('Successfully executed findAndCount query', {
            foundStudents: studentsWithResolvedPromises.length,
            totalCount: totalCountFromDatabase
        });

        return [studentsWithResolvedPromises, totalCountFromDatabase];
    }

    /**
     * Finds a single Student entity by their primary identifier
     * **IMPORTANT**: This method properly handles lazy-loaded foreign relationships.
     * 
     * @param idToFind - The Student identifier to search for
     * @param status - Optional status filter (ACTIVE, INACTIVE, DELETED)
     * @returns Promise<Student | null> The Student entity if found, null otherwise
     */
    @LogMethod()
    async findById(idToFind: any, status?: Status): Promise<Student | null> {
        this.logger.log('Executing findOne query by ID', { id: idToFind, status });

        // [Step-1]: Build where conditions
        const whereConditions: FindOptionsWhere<Student> = {
            id: idToFind
        };
        if (status) {
            whereConditions.status = status;
        }

        // [Step-2]: Execute database query
        const studentFromDatabase: Student | null = await this.studentRepository.findOne({
            where: whereConditions,
            relations: {
                // **AUTO-DISCOVERED**: Load all foreign key relationships for DTO transformation
                citizenshipStatusDescriptor: true,
                birthCountryDescriptor: true,
                birthSexDescriptor: true,
                birthStateAbbreviationDescriptor: true,
            }
        });

        if (!studentFromDatabase) {
            this.logger.log('Student not found', { id: idToFind });
            return null;
        }

        // [Step-3]: Resolve lazy-loaded relationships using helper method
        const studentWithResolvedPromises = await this.resolveStudentRelationships(studentFromDatabase);
        this.logger.log('Successfully resolved relationships for student', { id: idToFind });

        return studentWithResolvedPromises;
    }

    /**
     * Finds a single Student entity by their unique identifier
     * **IMPORTANT**: This method properly handles lazy-loaded foreign relationships.
     * 
     * @param studentUniqueIdToFind - The unique identifier to search for
     * @returns Promise<Student | null> The Student entity if found, null otherwise
     */
    @LogMethod()
    async findByStudentUniqueId(studentUniqueIdToFind: string): Promise<Student | null> {
        this.logger.log('Executing findOne query by studentUniqueId', { studentUniqueId: studentUniqueIdToFind });

        const studentFromDatabase: Student | null = await this.studentRepository.findOne({
            where: { studentUniqueId: studentUniqueIdToFind } as FindOptionsWhere<Student>,
            relations: {
                // **AUTO-DISCOVERED**: Load all foreign key relationships for DTO transformation
                citizenshipStatusDescriptor: true,
                birthCountryDescriptor: true,
                birthSexDescriptor: true,
                birthStateAbbreviationDescriptor: true,
            }
        });

        if (!studentFromDatabase) {
            this.logger.log('Student not found by studentUniqueId', { studentUniqueId: studentUniqueIdToFind });
            return null;
        }

        // Resolve lazy-loaded relationships using helper method
        const studentWithResolvedPromises = await this.resolveStudentRelationships(studentFromDatabase);
        this.logger.log('Successfully found and resolved student by studentUniqueId', { studentUniqueId: studentUniqueIdToFind });

        return studentWithResolvedPromises;
    }

    /**
     * Finds a single Student entity by their studentUsi (primary key)
     * **IMPORTANT**: This method properly handles lazy-loaded foreign relationships.
     * 
     * @param studentUsiToFind - The studentUsi to search for
     * @returns Promise<Student | null> The Student entity if found, null otherwise
     */
    @LogMethod()
    async findByStudentUsi(studentUsiToFind: number): Promise<Student | null> {
        this.logger.log('Executing findOne query by studentUsi', { studentUsi: studentUsiToFind });

        const studentFromDatabase: Student | null = await this.studentRepository.findOne({
            where: { studentUsi: studentUsiToFind } as FindOptionsWhere<Student>,
            relations: {
                // **AUTO-DISCOVERED**: Load all foreign key relationships for DTO transformation
                citizenshipStatusDescriptor: true,
                birthCountryDescriptor: true,
                birthSexDescriptor: true,
                birthStateAbbreviationDescriptor: true,
            }
        });

        if (!studentFromDatabase) {
            this.logger.log('Student not found by studentUsi', { studentUsi: studentUsiToFind });
            return null;
        }

        // Resolve lazy-loaded relationships using helper method
        const studentWithResolvedPromises = await this.resolveStudentRelationships(studentFromDatabase);
        this.logger.log('Successfully found and resolved student by studentUsi', { studentUsi: studentUsiToFind });

        return studentWithResolvedPromises;
    }

    /**
     * Finds a single Student entity by composite/natural key
     * Used for constraint validation in create operations
     * 
     * @param compositeKey - Object containing the natural key fields
     * @returns Promise<Student | null> The Student entity if found, null otherwise
     */
    @LogMethod()
    async findByCompositeKey(compositeKey: FindOptionsWhere<Student>): Promise<Student | null> {
        this.logger.log('Executing findOne query by composite key', { compositeKey });

        const studentFromDatabase: Student | null = await this.studentRepository.findOne({
            where: compositeKey,
            relations: {
                // **AUTO-DISCOVERED**: Load relationships if needed for validation
                citizenshipStatusDescriptor: true,
                birthCountryDescriptor: true,
                birthSexDescriptor: true,
                birthStateAbbreviationDescriptor: true,
            }
        });

        this.logger.log('Completed findOne query by composite key', {
            compositeKey,
            found: !!studentFromDatabase
        });

        return studentFromDatabase;
    }

    /**
     * Soft deletes a Student entity by updating status and timestamps
     * 
     * @param idToDelete - The Student identifier to delete
     * @returns Promise<boolean> True if deletion was successful, false if no rows were affected
     */
    @LogMethod()
    async deleteStudent(idToDelete: any): Promise<boolean> {
        this.logger.log('Executing soft delete operation for student', { id: idToDelete });

        // [Step-1]: Prepare soft delete data
        const updateData: DeepPartial<Student> = {
            status: Status.DELETED,
            deletedate: new Date(),
            lastmodifieddate: new Date()
        };

        // [Step-2]: Execute soft delete operation
        const updateResult = await this.studentRepository.update(
            { studentUsi: idToDelete } as FindOptionsWhere<Student>,
            updateData
        );

        // [Step-3]: Determine if deletion was successful based on affected rows
        const deletionWasSuccessful: boolean = (updateResult.affected || 0) > 0;

        this.logger.log('Completed soft delete operation for student', {
            id: idToDelete,
            successful: deletionWasSuccessful,
            affectedRows: updateResult.affected
        });

        return deletionWasSuccessful;
    }

    /**
     * Helper method to resolve all foreign key relationships for Student
     * **IMPORTANT**: This method awaits all lazy-loaded relationships to make them accessible in DTOs
     * **AUTO-DISCOVERED**: Foreign key relationships are automatically identified from entity decorators
     * 
     * @param student - The Student entity with lazy-loaded relationships
     * @returns Promise<Student> The Student entity with resolved relationships
     */
    @LogMethod()
    async resolveStudentRelationships(student: Student): Promise<Student> {
        const studentWithResolvedPromises = {
            ...student,
            // **AUTO-DISCOVERED**: Resolve all foreign key relationships
            citizenshipStatusDescriptor: student.citizenshipStatusDescriptor ? await student.citizenshipStatusDescriptor : null,
            birthCountryDescriptor: student.birthCountryDescriptor ? await student.birthCountryDescriptor : null,
            birthSexDescriptor: student.birthSexDescriptor ? await student.birthSexDescriptor : null,
            birthStateAbbreviationDescriptor: student.birthStateAbbreviationDescriptor ? await student.birthStateAbbreviationDescriptor : null,
        } as unknown as Student;

        return studentWithResolvedPromises;
    }
}