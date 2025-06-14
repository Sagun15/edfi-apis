import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { CustomLogger } from '../utils/logger/logger.service';

@Injectable()
export class TransactionService {
    private readonly logger = new CustomLogger();

    constructor(private readonly dataSource: DataSource) {
        this.logger.setContext('TransactionService');
    }

    /**
     * Executes a function within a transaction
     * 
     * @param operation - Function to execute within transaction
     * @returns Promise with the result of the operation
     */
    async executeInTransaction<T>(
        operation: (queryRunner: QueryRunner) => Promise<T>
    ): Promise<T> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            this.logger.log('Starting transaction');
            const result = await operation(queryRunner);
            await queryRunner.commitTransaction();
            this.logger.log('Transaction committed successfully');
            return result;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logger.error(`Transaction failed, rolling back: ${errorMessage}`);
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            this.logger.log('Releasing query runner');
            await queryRunner.release();
        }
    }

    /**
     * Gets a repository within a transaction context
     * 
     * @param entity - Entity class to get repository for
     * @param queryRunner - Active query runner
     * @returns Repository instance within transaction
     */
    getRepository<T>(entity: new () => T, queryRunner: QueryRunner) {
        return queryRunner.manager.getRepository(entity);
    }
} 