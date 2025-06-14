export const CREDENTIAL_CONSTANTS = {
    HEADERS: {
        ETAG: 'ETag',
        TOTAL_COUNT: 'Total-Count',
    },
    NAMESPACE: 'uri://ed-fi.org/Credential',
    DESCRIPTOR_RANGES: {
        STATE_ABBREVIATION: { min: 1, max: 50 },
        CREDENTIAL_TYPE: { min: 1, max: 10 },
        CREDENTIAL_FIELD: { min: 1, max: 20 },
        TEACHING_CREDENTIAL: { min: 1, max: 5 },
        TEACHING_CREDENTIAL_BASIS: { min: 1, max: 5 },
    },
} as const; 