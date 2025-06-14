import { DatabaseErrorInfo } from '../types/errorTypes';
import {
  ReferencedEntityRetrievalQueryInputs,
  SingleReferenceEntityRetrievalQueryInput,
} from '../types/databaseTypes';
import { UUID } from 'crypto';

/**
 * Extracts the `code` and `message` properties from a database error object.
 *
 * This function takes an error object (typically thrown by the database) and checks
 * if it contains the `code` and `message` properties. If they are found and are of
 * type `string`, it will return these values. If not, it will return `null` for both
 * `code` and `message`.
 *
 * @param {unknown} error - The error object to extract information from.
 *                           It can be of any type, but the function expects the
 *                           object to potentially contain `code` and `message` properties.
 *
 * @returns {DatabaseErrorInfo} - An object containing the `code` and `message` properties.
 *                                If they exist, they will be returned; otherwise, `null` will be returned.
 *                                The result will have the following structure:
 *                                - `code`: string | null
 *                                - `message`: string | null
 */
export function extractDatabaseErrorInfo(error: unknown): DatabaseErrorInfo {
  const databaseErrorInfo: DatabaseErrorInfo = { code: null, message: null };

  if (error && typeof error === 'object') {
    if ('code' in error && typeof error.code === 'string') {
      databaseErrorInfo.code = error.code;
    }
    if ('message' in error && typeof error.message === 'string') {
      databaseErrorInfo.message = error.message;
    }
  }
  return databaseErrorInfo;
}

/**
 * Generates an SQL query to retrieve reference details for a list of tables based on the provided inputs.
 * Each input defines the table, `sourcedId` values to filter on, and optional additional select columns and where clauses.
 *
 * @param {ReferencedEntityRetrievalQueryInputs[]} referenceDetailsRetrievalQueryInputs - An array of objects that specify the details for generating the SQL query. Each object should include:
 * - `table`: The name of the table to query.
 * - `additionalSelectColumns` (optional): Additional columns to select in the query.
 * - `additionalWhereClause` (optional): An additional `WHERE` clause to apply to the query.
 *
 * @returns {string} A string representing the SQL query. The query will retrieve the `id` with optional additional columns and where conditions.
 * The queries for each input are combined using `UNION ALL`.
 */
export function buildReferenceEntitiesRetrievalQuery(
  referenceDetailsRetrievalQueryInputs: ReferencedEntityRetrievalQueryInputs[],
): string {
  const retrieveReferenceIdsSqlQuery: string =
    referenceDetailsRetrievalQueryInputs
      .map(
        (
          referenceIdRetrievalQueryInput: ReferencedEntityRetrievalQueryInputs,
        ): string => {
          const additionalSelectColumns: string =
            referenceIdRetrievalQueryInput.additionalSelectColumns
              ? `, ${referenceIdRetrievalQueryInput.additionalSelectColumns}`
              : '';

          let query: string = `SELECT '${referenceIdRetrievalQueryInput.table}' as table, id ${additionalSelectColumns} FROM ${referenceIdRetrievalQueryInput.table}`;

          if (referenceIdRetrievalQueryInput.additionalWhereClause) {
            query += ` AND ${referenceIdRetrievalQueryInput.additionalWhereClause}`;
          }

          return query;
        },
      )
      .join(' UNION ALL ');

  return retrieveReferenceIdsSqlQuery;
}

/**
 * Builds a SQL query to retrieve reference entity details for single sourced ID.
 * Generates a UNION ALL query combining lookups across multiple tables.
 * Supports additional where clauses and select columns for each table query.
 *
 * @param {SingleReferenceEntityRetrievalQueryInput[]} referenceDetailsRetrievalQueryInputs - Array of query inputs for each table
 *        Each input specifies table name and optional additional clauses
 *
 * @returns {string} Combined SQL query string for retrieving reference entities
 */
export function buildSingleReferenceEntitiesQuery(
  referenceDetailsRetrievalQueryInputs: SingleReferenceEntityRetrievalQueryInput[],
): string {
  const retrieveReferenceDetailsSqlQuery: string =
    referenceDetailsRetrievalQueryInputs
      .map((queryInput: SingleReferenceEntityRetrievalQueryInput): string => {
        const additionalSelectColumns: string =
          queryInput.additionalSelectColumns
            ? `, ${queryInput.additionalSelectColumns}`
            : '';

        let query: string = `SELECT '${queryInput.table}' as table, id ${additionalSelectColumns} FROM ${queryInput.table}'`;

        if (queryInput.additionalWhereClause) {
          query += ` AND ${queryInput.additionalWhereClause}`;
        }

        return query;
      })
      .join(' UNION ALL ');

  return retrieveReferenceDetailsSqlQuery;
}
