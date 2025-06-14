import { ApiProperty } from '@nestjs/swagger';
import { Calendar } from '../../../common/entities/calendar.entity';
import { Type } from 'class-transformer';

class LinkDTO {
    @ApiProperty({ description: 'The type of the link', example: 'self' })
    rel: string;

    @ApiProperty({ description: 'The URL of the link' })
    href: string;
}

class SchoolReferenceDTO {
    @ApiProperty({ description: 'The identifier for the school', example: 123 })
    schoolId: number;

    @ApiProperty({ description: 'The link to the school resource' })
    @Type(() => LinkDTO)
    link: LinkDTO;
}

class SchoolYearReferenceDTO {
    @ApiProperty({ description: 'The identifier for the school year', example: 2024 })
    schoolYear: number;

    @ApiProperty({ description: 'The link to the school year resource' })
    @Type(() => LinkDTO)
    link: LinkDTO;
}

class GradeLevelDTO {
    @ApiProperty({ description: 'The grade level descriptor', example: 'Ninth grade' })
    gradeLevelDescriptor: string;
}

export class CalendarDTO {
    @ApiProperty({ description: 'Resource identifier', example: 'f1e85f64-9f04-4123-8567-4523451fa9c8' })
    id: string;

    @ApiProperty({ description: 'Calendar code', example: 'CAL-2024' })
    calendarCode: string;

    @ApiProperty({ description: 'School reference' })
    @Type(() => SchoolReferenceDTO)
    schoolReference: SchoolReferenceDTO;

    @ApiProperty({ description: 'School year reference' })
    @Type(() => SchoolYearReferenceDTO)
    schoolYearTypeReference: SchoolYearReferenceDTO;

    @ApiProperty({ description: 'Calendar type descriptor', example: 'Regular school calendar' })
    calendarTypeDescriptor: string;

    @ApiProperty({ description: 'Grade levels', type: [GradeLevelDTO] })
    @Type(() => GradeLevelDTO)
    gradeLevels: GradeLevelDTO[] = [];

    @ApiProperty({ description: 'ETag for concurrency control', example: '"2025-05-29T07:53:44.000Z"' })
    _etag: string;

    @ApiProperty({ description: 'Last modified date', example: '2025-05-29T07:53:44.000Z' })
    _lastModifiedDate: string;

    constructor(calendar: Calendar) {
        this.id = calendar.id;
        this.calendarCode = calendar.calendarCode;

        // Set up school reference
        this.schoolReference = {
            schoolId: calendar.schoolId,
            link: {
                rel: 'School',
                href: `/ed-fi/schools/${calendar.schoolId}`
            }
        };

        // Set up school year reference
        this.schoolYearTypeReference = {
            schoolYear: calendar.schoolYear,
            link: {
                rel: 'SchoolYear',
                href: `/ed-fi/schoolYears/${calendar.schoolYear}`
            }
        };

        // Calendar type descriptor will be loaded from the relationship
        this.calendarTypeDescriptor = calendar.calendarTypeDescriptor['codeValue'];

        // Grade levels would be loaded from a separate relationship/collection
        this.gradeLevels = [];

        // Generate Ed-Fi ETag and lastModifiedDate
        const lastModified = calendar.lastmodifieddate || calendar.createdate;
        this._etag = `"${lastModified.toISOString()}"`;
        this._lastModifiedDate = lastModified.toISOString();
    }
} 