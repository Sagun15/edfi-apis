import { DeepPartial, FindOptionsWhere, InsertResult } from 'typeorm';
import { IQueryOptions } from './queryOptions.interface';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { EntityConflictConfig } from '../types/databaseTypes';

export interface IBaseRepository<T> {
  save(data: DeepPartial<T>): Promise<T>;
  findById(id: string): Promise<T>;
  findAll(options: IQueryOptions): Promise<T[]>;
  update(id: string, data: DeepPartial<T>): Promise<T>;
  delete(id: string): Promise<void>;
  findOneBy(conditions: FindOptionsWhere<T>): Promise<T>;
  upsertExcludingKeys(
    entityOrEntities: QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[],
    entityConflictConfig: EntityConflictConfig,
  ): Promise<InsertResult>;
}
