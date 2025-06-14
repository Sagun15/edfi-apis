import { validate } from 'class-validator';
import { IsUTCTimestamp } from '../decorators/validator/utcTimestamp.decorator';
import { ValidationError } from '@nestjs/common';

interface IMockTimestamp {
  value: string;
  description: string;
}

class MockTestDTO {
  @IsUTCTimestamp()
  // Type is Date but validation happens on string input(s) to mimic real-world usage
  timestamp: Date;
}

describe('UTCTimestampConstraint', () => {
  let mockRequestPayload: MockTestDTO;

  beforeAll(() => {
    mockRequestPayload = new MockTestDTO();
  });

  const validTimestamps: IMockTimestamp[] = [
    { value: '2024-01-01T00:00:00Z', description: 'Valid UTC timestamp' },
    {
      value: '2024-12-31T23:59:59Z',
      description: 'Valid UTC timestamp end of year',
    },
    {
      value: '2024-02-05T15:30:45Z',
      description: 'Valid UTC timestamp with HH:mm:ss',
    },
    { value: '2024-02-29T12:00:00Z', description: 'Leap year valid timestamp' },
  ];

  const invalidTimestamps: IMockTimestamp[] = [
    // Invalid types
    {
      value: 'null',
      description: 'null value (converted to string for safety)',
    },
    {
      value: 'undefined',
      description: 'undefined value (converted to string for safety)',
    },
    {
      value: new Date().toISOString(),
      description: 'Date object converted to string',
    },
    { value: 'invalid date', description: 'Invalid date format' },

    // Invalid formats
    { value: '2024-01-01T00:00:00+01:00', description: 'Non-UTC timezone' },
    {
      value: '2024-01-01T00:00:00.000Z',
      description: 'Timestamp with milliseconds',
    },
    { value: '2024-01-01 00:00:00', description: 'Local time format' },
    { value: '2024-01-01', description: 'Date-only format' },

    // Invalid date components
    { value: '2024-13-01T00:00:00Z', description: 'Invalid month (13)' },
    { value: '2024-04-31T00:00:00Z', description: 'Invalid day (31 in April)' },
    {
      value: '2025-02-29T00:00:00Z',
      description: 'Invalid day (29 in non-leap year)',
    },
    { value: '2024-01-01T24:00:00Z', description: 'Invalid hour (24)' },
    { value: '2024-01-01T00:60:00Z', description: 'Invalid minutes (60)' },
    { value: '2024-01-01T00:00:60Z', description: 'Invalid seconds (60)' },

    // Format edge cases
    { value: '2024-01-01 00:00:00Z', description: 'Missing T separator' },
    { value: '2024-01-01T00:00:00', description: 'Missing Z suffix' },
    { value: '2024-01-01T00:00:00z', description: 'Lowercase z suffix' },
    { value: '2024-01-01T00:00:00 Z', description: 'Space before Z' },
  ];

  describe('UTC Timestamp Validation Tests', () => {
    it.each(validTimestamps)(
      'should pass for valid UTC timestamp: $description',
      async ({ value }) => {
        mockRequestPayload.timestamp = value as any;
        const errors: ValidationError[] = await validate(mockRequestPayload);
        expect(errors).toHaveLength(0);
      },
    );

    it.each(invalidTimestamps)(
      'should fail for $description',
      async ({ value }) => {
        mockRequestPayload.timestamp = value as any;
        const errors: ValidationError[] = await validate(mockRequestPayload);
        expect(errors).toHaveLength(1);
        expect(errors[0].constraints?.isUTCTimestamp).toBe(
          'timestamp must be a valid UTC timestamp in format YYYY-MM-DDThh:mm:ssZ',
        );
      },
    );
  });
});
