import { ApiProperty } from '@nestjs/swagger';
import { CourseOffering } from '../../../common/entities/course-offering.entity';

class ReferenceLink {
    @ApiProperty({ description: 'Link relation type', example: 'self' })
    rel: string;

    @ApiProperty({ description: 'Link URL', example: 'https://api.ed-fi.org/v3/ed-fi/courses/123' })
    href: string;
}

class CourseReference {
    @ApiProperty({ description: 'Course code', example: 'ALG-1' })
    courseCode: string;

    @ApiProperty({ description: 'Education organization ID', example: 255901 })
    educationOrganizationId: number;

    @ApiProperty({ description: 'Reference link', type: ReferenceLink })
    link: ReferenceLink;
}

class SchoolReference {
    @ApiProperty({ description: 'School ID', example: 255901 })
    schoolId: number;

    @ApiProperty({ description: 'Reference link', type: ReferenceLink })
    link: ReferenceLink;
}

class SessionReference {
    @ApiProperty({ description: 'School ID', example: 255901 })
    schoolId: number;

    @ApiProperty({ description: 'School year', example: 2020 })
    schoolYear: number;

    @ApiProperty({ description: 'Session name', example: 'Fall Semester' })
    sessionName: string;

    @ApiProperty({ description: 'Reference link', type: ReferenceLink })
    link: ReferenceLink;
}

class CourseLevelCharacteristic {
    @ApiProperty({ description: 'Course level characteristic descriptor', example: 'Advanced Placement' })
    courseLevelCharacteristicDescriptor: string;
}

class CurriculumUsed {
    @ApiProperty({ description: 'Curriculum used descriptor', example: 'State Curriculum' })
    curriculumUsedDescriptor: string;
}

class GradeLevel {
    @ApiProperty({ description: 'Grade level descriptor', example: '9th Grade' })
    gradeLevelDescriptor: string;
}

export class CourseOfferingDTO {
    @ApiProperty({ description: 'Resource identifier', example: 'f1e85f64-9f04-4123-8567-4523451fa9c8' })
    id: string;

    @ApiProperty({ description: 'Local course code', example: 'ALG-1' })
    localCourseCode: string;

    @ApiProperty({ description: 'Course reference', type: CourseReference })
    courseReference: CourseReference;

    @ApiProperty({ description: 'School reference', type: SchoolReference })
    schoolReference: SchoolReference;

    @ApiProperty({ description: 'Session reference', type: SessionReference })
    sessionReference: SessionReference;

    @ApiProperty({ description: 'Course level characteristics', type: [CourseLevelCharacteristic], required: false })
    courseLevelCharacteristics: CourseLevelCharacteristic[] = [];

    @ApiProperty({ description: 'Curriculum used', type: [CurriculumUsed], required: false })
    curriculumUseds: CurriculumUsed[] = [];

    @ApiProperty({ description: 'Offered grade levels', type: [GradeLevel], required: false })
    offeredGradeLevels: GradeLevel[] = [];

    @ApiProperty({ description: 'Instructional time planned', example: 120, required: false })
    instructionalTimePlanned?: number;

    @ApiProperty({ description: 'Local course title', example: 'Algebra I', required: false })
    localCourseTitle?: string;

    @ApiProperty({ description: 'ETag for concurrency control', example: '"2025-05-29T07:53:44.000Z"' })
    _etag: string;

    @ApiProperty({ description: 'Last modified date', example: '2025-05-29T07:53:44.000Z' })
    _lastModifiedDate: string;

    constructor(courseOffering: CourseOffering) {
        this.id = courseOffering.id;
        this.localCourseCode = courseOffering.localCourseCode;
        this.courseReference = {
            courseCode: courseOffering.courseCode,
            educationOrganizationId: courseOffering.educationOrganizationId,
            link: {
                rel: 'Course',
                href: `/ed-fi/courses/${courseOffering.courseCode}/${courseOffering.educationOrganizationId}`
            }
        };
        this.schoolReference = {
            schoolId: courseOffering.schoolId,
            link: {
                rel: 'School',
                href: `/ed-fi/schools/${courseOffering.schoolId}`
            }
        };
        this.sessionReference = {
            schoolId: courseOffering.schoolId,
            schoolYear: courseOffering.schoolYear,
            sessionName: courseOffering.sessionName,
            link: {
                rel: 'Session',
                href: `/ed-fi/sessions/${courseOffering.schoolId}/${courseOffering.schoolYear}/${courseOffering.sessionName}`
            }
        };
        this.instructionalTimePlanned = courseOffering.instructionalTimePlanned;
        this.localCourseTitle = courseOffering.localCourseTitle;

        // Set ETag and last modified date
        const lastModified = courseOffering.lastmodifieddate || courseOffering.createdate;
        this._etag = `"${lastModified.toISOString()}"`;
        this._lastModifiedDate = lastModified.toISOString();

        // Initialize descriptor arrays as empty
        this.courseLevelCharacteristics = [];
        this.curriculumUseds = [];
        this.offeredGradeLevels = [];
    }

    /**
     * Static factory method to create a DTO instance with resolved relationships
     * @param courseOffering The course offering entity with relationships to resolve
     * @returns Promise<CourseOfferingDTO> A fully populated DTO
     */
    static async fromEntity(courseOffering: CourseOffering): Promise<CourseOfferingDTO> {
        return new CourseOfferingDTO(courseOffering);
    }
} 