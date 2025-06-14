import { PAGINATION_HEADERS } from '../constants/httpConstants';
import { GenericResponse } from '../decorators/genericResponse.decorator';
import {
  PaginationLinkParams,
  PaginationParams,
} from '../types/paginationTypes';
import { QueryOptionsDto } from '../dto/queryOptions.dto';
import { QUERY_CONSTANTS } from '../constants/httpConstants';

/**
 * This function constructs and sets the response headers that should be returned by a paginated API
 * @param response The Generic Response object from the Http Context
 * @param options Query options
 * @param totalCount Total count of the db rows that satisfy the filter
 * @param host The host url of the app, used to create next, previous links for pagination
 * @param endpoint The endpoint of the API being called
 */
export const setPaginationHeaders = (
  response: GenericResponse,
  options: QueryOptionsDto,
  totalCount: number,
  host: string,
  endpoint: string,
) => {
  const { first, next, previous, last } = generatePaginationParams(
    options,
    totalCount,
  );

  response
    .setHeader(
      PAGINATION_HEADERS.FIRST,
      getPaginatedLinkFromParams(host, endpoint, options, first),
    )
    .setHeader(
      PAGINATION_HEADERS.LAST,
      getPaginatedLinkFromParams(host, endpoint, options, last),
    )
    .setHeader(
      PAGINATION_HEADERS.NEXT,
      getPaginatedLinkFromParams(host, endpoint, options, next),
    )
    .setHeader(
      PAGINATION_HEADERS.PREVIOUS,
      getPaginatedLinkFromParams(host, endpoint, options, previous),
    )
    .setHeader(PAGINATION_HEADERS.TOTAL_COUNT, totalCount.toString());
};

/**
 *
 * @param host The host of the 2 hour learning APIs
 * @param endpoint The endpoint that is being invoked
 * @param paginationDetails Limit and offset parameters
 * @returns The complete url of the API with limit and offset parameters set
 */
const getPaginatedLinkFromParams = (
  host: string,
  endpoint: string,
  options: QueryOptionsDto,
  paginationDetails: PaginationParams,
): string => {
  const urlTemplate: string = '{host}/{endpoint}?limit={limit}&offset={offset}';

  let constructedUrl = urlTemplate
    .replace('{host}', host)
    .replace('{endpoint}', endpoint)
    .replace('{limit}', paginationDetails.limit.toString())
    .replace('{offset}', paginationDetails.offset.toString());

  // Encode query parameters with special characters and construct URL
  if (options.filter) {
    const encodedFilter = encodeURIComponent(options.filter);
    constructedUrl += '&' + QUERY_CONSTANTS.FILTER + '=' + encodedFilter;
  }

  return constructedUrl;
};

/**
 * Creates the limit and offset of the first, next, previous and last page using
 * the current limit, offset and count of pages
 * @param options Query options from the request
 * @param totalCount The total count of the items matching the filter
 * @returns The first, next, previous and last page's limit and offset
 */
const generatePaginationParams = (
  options: QueryOptionsDto,
  totalCount: number,
): PaginationLinkParams => {
  const first: PaginationParams = {
    limit: options.limit,
    offset: 0,
  };

  // If the limit + offset of the current request goes over the total count,
  // return the same offset for the "next" link.
  const nextPageOffset =
    Number(options.limit) + Number(options.offset) >= totalCount
      ? options.offset
      : Number(options.limit) + Number(options.offset);
  const next: PaginationParams = {
    limit: options.limit,
    offset: nextPageOffset,
  };

  const previousPageOffset =
    Number(options.offset) - Number(options.limit) > 0
      ? Number(options.offset) - Number(options.limit)
      : options.offset;
  const previous: PaginationParams = {
    limit: options.limit,
    offset: previousPageOffset,
  };

  const lastPageOffset = Math.ceil(totalCount / options.limit) - 1;
  const last: PaginationParams = {
    limit: options.limit,
    offset: Math.max(lastPageOffset * options.limit, 0),
  };

  return {
    first,
    next,
    previous,
    last,
  };
};
