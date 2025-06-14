import { ApiPathParams } from 'src/common/types/apiPathTypes';

/**
 * Constructs a full API path by combining the service prefix, version, and endpoint.
 *
 * @param {ApiPathParams} params - The parameters required to build the API path.
 * @param {API_PREFIXES} params.apiPrefix - The base API prefix for the service (e.g., `/api/hello-world`).
 * @param {string} params.version - The API version (e.g., `"v1p2"`).
 * @param {string} params.endpoint - The specific API endpoint (e.g., `"/items"`).
 *
 * @returns {string} The fully constructed API path (e.g., `"/api/hello-world/v1p2/items"`).
 *
 * @example
 * const url = getApiPath({
 *   apiPrefix: API_PREFIXES.hello-world,
 *   version: API_VERSIONS.V1P2,
 *   endpoint: "/items"
 * });
 * console.log(url); // "/api/hello-world/v1p2/items"
 */
export const getApiPath = ({
  apiPrefix,
  endpoint,
}: ApiPathParams): string => `${apiPrefix}/${endpoint}`;
