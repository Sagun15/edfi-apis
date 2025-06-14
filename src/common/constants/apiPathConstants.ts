/**
 * Base URL paths for different API standards
 */
export const enum ApiBases {
  APPLICATION_PATH = '/api',
}

/**
 * Available API version identifiers
 */
export const enum ApiVersions {
  V1P1 = 'v1p1',
  V1P2 = 'v1p2',
}

/**
 * Version string for Custom APIs
 * Used when extending beyond standard OneRoster specifications
 */
export const enum CustomApiVersions {
  V1 = 'v1',
  V1P0 = 'v1p0',
}

export const enum ApiPrefixes {
  EDFI = '/ed-fi',
}

/**
 * Represents the primary resource endpoints in the API
 * 
 * TODO : Remove Hello World and extend to add your API Endpoints here
 */
export const enum ApplicationEndpoints {
  STUDENT = 'students',
  GRADING_PERIOD = 'gradingPeriods',
  COURSE_OFFERING = 'courseOfferings',
  STAFF = 'staffs',
  CREDENTIAL = 'credentials',
  CALENDAR = 'calendars',
  COURSES = 'courses',
}
