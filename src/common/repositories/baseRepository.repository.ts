/* eslint-disable @typescript-eslint/no-unused-vars */
import { IQueryOptions } from '../interfaces/queryOptions.interface';
import { IBaseRepository } from '../interfaces/repository.interface';
import {
  DeepPartial,
  EntityMetadata,
  FindOptionsWhere,
  InsertResult,
  Repository,
} from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UUID } from 'crypto';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { EntityConflictConfig } from '../types/databaseTypes';
import { CustomLogger } from '../utils/logger/logger.service';
import { EntityColumns } from '../constants/databaseConstants';

export default class BaseRepository<T> implements IBaseRepository<T> {
  protected readonly logger = new CustomLogger();
  protected readonly entityPropertyToDatabaseName: Map<string, string>;
  protected readonly entityPropertyNames: string[];

  constructor(private readonly entityRepository: Repository<T>) {
    this.entityPropertyToDatabaseName =
      this.getEntityPropertyToDatabaseNameMap();
    this.entityPropertyNames = this.getEntityPropertyNames();
  }

  /**
   * Constructs a map that associates entity property names with their corresponding
   * database column names using the entity repository metadata.
   *
   * @returns {Map<string, string>} A map where keys are entity property names and
   * values are the corresponding database column names.
   */
  private getEntityPropertyToDatabaseNameMap(): Map<string, string> {
    return new Map<string, string>(
      this.entityRepository.metadata.columns.map((column: ColumnMetadata) => [
        column.propertyName,
        column.databaseName,
      ]),
    );
  }

  /**
   * Retrieves an array of property names from the entity repository metadata.
   *
   * @returns {string[]} An array of property names.
   */
  private getEntityPropertyNames(): string[] {
    return this.entityRepository.metadata.columns.map(
      (column: ColumnMetadata) => column.propertyName,
    );
  }

  save(data: DeepPartial<T>): Promise<T> {
    return this.entityRepository.save(data);
  }

  saveAll(data: DeepPartial<T>[]): Promise<T[]> {
    return this.entityRepository.save(data);
  }

  findById(id: string): Promise<T> {
    return this.entityRepository.findOne({ where: { id } as any });
  }

  findAll(options: IQueryOptions): Promise<T[]> {
    return this.entityRepository.find();
  }

  async update(id: string, data: DeepPartial<T>): Promise<T> {
    const entity = await this.findById(id);

    // Merge the updated data with the existing entity
    const updatedEntity = this.entityRepository.merge(entity, data);

    // Save the updated entity
    return await this.entityRepository.save(updatedEntity);
  }

  /**
   * Performs an upsert operation on the entity repository, inserting new records or updating existing ones
   * based on the specified conflict target while excluding certain keys from being updated.
   *
   * @param {QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[]} entityOrEntities - The entity or list of entities to be upserted.
   * @param {EntityConflictConfig} entityConflictConfig - Configuration object containing conflict targets and keys to ignore.
   * @param {EntityConflictConfig.conflictTargets} entityConflictConfig.conflictTargets - The column(s) used to detect conflicts.
   * @param {EntityConflictConfig.entityKeysToIgnore} entityConflictConfig.entityKeysToIgnore - The column(s) that should be excluded from updates when a conflict occurs (optional).
   *
   * @returns {Promise<InsertResult>} The result of the upsert operation.
   */
  async upsertExcludingKeys(
    entityOrEntities: QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[],
    entityConflictConfig: EntityConflictConfig,
  ): Promise<InsertResult> {
    const entityKeysToIgnoreSet: Set<string> = new Set(
      entityConflictConfig.entityKeysToIgnore,
    );

    const entityKeysToUpdate: string[] = this.entityPropertyNames.filter(
      (entityKey: string) => !entityKeysToIgnoreSet.has(entityKey),
    );
    const dbKeysToUpdate: string[] = this.getDbColumnNames(entityKeysToUpdate);

    const dbConflictTargets: string[] = this.getDbColumnNames(
      entityConflictConfig.conflictTargets,
    );

    return await this.entityRepository
      .createQueryBuilder()
      .insert()
      .values(entityOrEntities)
      .orUpdate(dbKeysToUpdate, dbConflictTargets)
      .execute();
  }

  /**
   * Converts an array of entity property names into their corresponding database column names.
   * If a property does not have a matching database column, it is returned as it is.
   *
   * @param {string[]} entityKeys - The property name(s) to convert to database column names.
   * @returns {string[]} The corresponding database column names.
   */
  private getDbColumnNames(entityKeys: string[]): string[] {
    return entityKeys.map(
      (key: string) => this.entityPropertyToDatabaseName.get(key) ?? key,
    );
  }

  async delete(id: string): Promise<void> {
    const entity = await this.findById(id);
    await this.entityRepository.remove(entity);
  }

  async findOneBy(where: FindOptionsWhere<T>): Promise<T> {
    const entity = await this.entityRepository.findOneBy(where);
    if (!entity) {
      throw new NotFoundException('Entity not found');
    }
    return entity;
  }

  async getTotalCount(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
  ): Promise<number> {
    return this.entityRepository.countBy(where);
  }

  async findIdBySourcedId(sourcedId: UUID): Promise<UUID> {
    const data: T = await this.entityRepository.findOne({
      select: [EntityColumns.ID] as any,
      where: { sourcedId } as any,
    });
    return data ? data[EntityColumns.ID] : null;
  }

  async existsBySourcedId(sourcedId: UUID): Promise<boolean> {
    return await this.entityRepository.exists({
      where: { sourcedId } as any,
    });
  }

  /**
   * Checks if an entity exists in the database based on given criteria.
   *
   * @param where - The criteria to check for existence.
   * @returns A promise that resolves to boolean indicating if entity exists.
   * @typeParam T - The entity type to check for existence.
   *
   **/
  async existsBy(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
  ): Promise<boolean> {
    return await this.entityRepository.exists({
      where,
    });
  }

  async findIdBy(where: FindOptionsWhere<T>): Promise<UUID | null> {
    const data: T = await this.entityRepository.findOne({
      select: [EntityColumns.ID] as any,
      where,
    });
    return data ? data[EntityColumns.ID] : null;
  }

  async insert(
    data: QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[],
  ): Promise<InsertResult> {
    return this.entityRepository.insert(data);
  }

  async query(query: string, parameters?: any[]): Promise<any> {
    return this.entityRepository.query(query, parameters);
  }
}
