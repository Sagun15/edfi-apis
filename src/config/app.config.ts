/**
 * Empty arrays for security requirements are a convention in the Swagger specification.
 * While OAuth2 typically contains scopes (e.g., ['read', 'write']) in these arrays,
 * JWT Bearer tokens and API keys do not use scopes, which is why empty arrays are used.
 */
export const SECURITY_HEADERS = [
  { bearer: [] as string[] },
  { 'x-app-key': [] as string[] },
  { 'x-client-id': [] as string[] },
];

export const API_CONFIG = {
  title: '<Application Name>',
  description: '<Application Description>',
  version: '<Application version>',
};

// TODO : Extend to add custom auth headers as needed
export const AUTH_CONFIG = {
  bearerAuth: {
    type: 'http' as const,
    scheme: 'bearer',
    bearerFormat: 'JWT',
    name: 'Authorization',
    description: 'Enter JWT token',
    in: 'header',
    key: 'bearer',
  },
  apiKeyAppKey: {
    type: 'apiKey' as const,
    name: 'x-app-key',
    in: 'header',
    description: 'Application Key',
    key: 'x-app-key',
  },
  apiKeyClientId: {
    type: 'apiKey' as const,
    name: 'x-client-id',
    in: 'header',
    description: 'Client ID',
    key: 'x-client-id',
  },
};
