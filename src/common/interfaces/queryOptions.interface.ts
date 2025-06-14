import { FindOptionsWhere } from 'typeorm';

export type QueryOptionFiltersMap = Record<string, FindOptionsWhere<unknown>[]>;

export interface IQueryOptions {
  limit?: number;
  offset?: number;
  totalCount?: boolean;
}

export interface IEntityExamples {
  sortFields: string[];
  filterExamples: string[];
  defaultSort?: string;
  validFields: string[];
  collectionResponseDataKey: string;
  singleResponseDataKey: string;
}
