import {
  ApiPrefixes,
  ApiVersions,
  CustomApiVersions,
} from '../constants/apiPathConstants';

export interface ApiPathParams {
  apiPrefix: ApiPrefixes;
  endpoint: string;
}
