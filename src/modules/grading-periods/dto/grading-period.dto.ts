import { ApiProperty } from '@nestjs/swagger';
import { GradingPeriod } from 'src/common/entities/gradingPeriod.entity';

class LinkDTO {
    @ApiProperty({ description: 'Link relation', example: 'self' })
    rel: string;

    @ApiProperty({ description: 'Link URL', example: 'https://api.example.com/schools/123' })
    href: string;
}

class SchoolReferenceDTO {
    @ApiProperty({ description: 'School ID', example: 123456 })
    schoolId: number;

    @ApiProperty({ description: 'School reference link' })
    link: LinkDTO;
}

class SchoolYearReferenceDTO {
    @ApiProperty({ description: 'School year', example: 2024 })
    schoolYear: number;

    @ApiProperty({ description: 'School year reference link' })
    link: LinkDTO;
}

export class GradingPeriodDTO {
    @ApiProperty({ description: 'Unique identifier', example: 'uuid-1234' })
    id: string;

    @ApiProperty({ description: 'Grading period descriptor', example: 'uri://ed-fi.org/GradingPeriodDescriptor#First Six Weeks' })
    gradingPeriodDescriptor: string;

    @ApiProperty({ description: 'Grading period name', example: 'First Six Weeks' })
    gradingPeriodName: string;

    @ApiProperty({ description: 'School reference' })
    schoolReference: SchoolReferenceDTO;

    @ApiProperty({ description: 'School year reference' })
    schoolYearTypeReference: SchoolYearReferenceDTO;

    @ApiProperty({ description: 'Period sequence', example: 1 })
    periodSequence: number;

    @ApiProperty({ description: 'Begin date', example: '2024-08-01' })
    beginDate: string;

    @ApiProperty({ description: 'End date', example: '2024-12-20' })
    endDate: string;

    @ApiProperty({ description: 'Total instructional days', example: 90 })
    totalInstructionalDays: number;

    @ApiProperty({ description: 'ETag for concurrency control' })
    _etag: string;

    @ApiProperty({ description: 'Last modified date' })
    _lastModifiedDate: string;

    constructor(gradingPeriod: GradingPeriod) {
        this.id = gradingPeriod.id;
        this.gradingPeriodDescriptor = `uri://ed-fi.org/GradingPeriodDescriptor#${gradingPeriod.gradingPeriodDescriptorId}`;
        this.gradingPeriodName = gradingPeriod.gradingPeriodName;
        this.periodSequence = gradingPeriod.periodSequence;
        this.beginDate = gradingPeriod.beginDate.toISOString().split('T')[0];
        this.endDate = gradingPeriod.endDate.toISOString().split('T')[0];
        this.totalInstructionalDays = gradingPeriod.totalInstructionalDays;

        // Set up references with links
        this.schoolReference = {
            schoolId: gradingPeriod.schoolId,
            link: {
                rel: 'School',
                href: `/ed-fi/schools/${gradingPeriod.schoolId}`
            }
        };

        this.schoolYearTypeReference = {
            schoolYear: gradingPeriod.schoolYear,
            link: {
                rel: 'SchoolYearType',
                href: `/ed-fi/schoolYearTypes/${gradingPeriod.schoolYear}`
            }
        };

        // Standard Ed-Fi fields
        const lastModified = gradingPeriod.lastmodifieddate || gradingPeriod.createdate;
        this._etag = `"${lastModified.toISOString()}"`;
        this._lastModifiedDate = lastModified.toISOString();
    }
} 