import { DatabaseTables } from '../constants/databaseConstants';

export type ReferencedEntityRetrievalQueryInputs = {
  table: DatabaseTables;
  additionalWhereClause?: string;
  additionalSelectColumns?: string;
};

export interface SingleReferenceEntityRetrievalQueryInput {
  table: DatabaseTables;
  additionalWhereClause?: string;
  additionalSelectColumns?: string;
}

export interface EntityConflictConfig {
  /**
   * Array of entity column names that should be checked for conflicts
   * Example: ['sourced_id']
   */
  conflictTargets: string[];

  /**
   * Optional array of entity column names that should be ignored during conflict resolution
   * Example: ['id']
   */
  entityKeysToIgnore?: string[];
}
