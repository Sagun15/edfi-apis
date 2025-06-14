import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Course } from '../../../common/entities/course.entity';

export class CourseIdentificationCodeDTO {
  @ApiProperty({ description: 'Course identification system descriptor', example: 'State Course Code' })
  courseIdentificationSystemDescriptor: string;

  @ApiProperty({ description: 'Assigning organization identification code', example: 'ABC123' })
  assigningOrganizationIdentificationCode: string;

  @ApiPropertyOptional({ description: 'Course catalog URL', example: 'http://example.com/course' })
  courseCatalogURL?: string;

  @ApiProperty({ description: 'Identification code', example: 'MATH101' })
  identificationCode: string;
}

export class EducationOrganizationReferenceDTO {
  @ApiProperty({ description: 'Education organization ID', example: 123456 })
  educationOrganizationId: number;

  @ApiProperty({
    description: 'Link to the education organization',
    example: {
      rel: 'EducationOrganization',
      href: '/ed-fi/education-organizations/123456'
    }
  })
  link: {
    rel: string;
    href: string;
  };
}

export class AcademicSubjectDTO {
  @ApiProperty({ description: 'Academic subject descriptor', example: 'Mathematics' })
  academicSubjectDescriptor: string;
}

export class CompetencyLevelDTO {
  @ApiProperty({ description: 'Competency level descriptor', example: 'Advanced' })
  competencyLevelDescriptor: string;
}

export class LearningStandardReferenceDTO {
  @ApiProperty({ description: 'Learning standard ID', example: 'CCSS.Math.Content.HSA.CED.A.1' })
  learningStandardId: string;

  @ApiProperty({
    description: 'Link to the learning standard',
    example: {
      rel: 'LearningStandard',
      href: '/ed-fi/learning-standards/CCSS.Math.Content.HSA.CED.A.1'
    }
  })
  link: {
    rel: string;
    href: string;
  };
}

export class LearningStandardDTO {
  @ApiProperty({ type: LearningStandardReferenceDTO })
  learningStandardReference: LearningStandardReferenceDTO;
}

export class LevelCharacteristicDTO {
  @ApiProperty({ description: 'Course level characteristic descriptor', example: 'Advanced Placement' })
  courseLevelCharacteristicDescriptor: string;
}

export class OfferedGradeLevelDTO {
  @ApiProperty({ description: 'Grade level descriptor', example: 'Ninth grade' })
  gradeLevelDescriptor: string;
}

export class CourseDTO {
  @ApiProperty({ description: 'Course unique identifier', example: '12345678-1234-1234-1234-123456789012' })
  id: string;

  @ApiProperty({ description: 'Course code', example: 'ALG-1' })
  courseCode: string;

  @ApiProperty({ type: [CourseIdentificationCodeDTO] })
  identificationCodes: CourseIdentificationCodeDTO[];

  @ApiProperty({ type: EducationOrganizationReferenceDTO })
  educationOrganizationReference: EducationOrganizationReferenceDTO;

  @ApiProperty({ type: [AcademicSubjectDTO] })
  academicSubjects: AcademicSubjectDTO[];

  @ApiPropertyOptional({ description: 'Career pathway descriptor', example: 'Science and Technology' })
  careerPathwayDescriptor?: string;

  @ApiProperty({ type: [CompetencyLevelDTO] })
  competencyLevels: CompetencyLevelDTO[];

  @ApiPropertyOptional({ description: 'Course defined by descriptor', example: 'State' })
  courseDefinedByDescriptor?: string;

  @ApiPropertyOptional({ description: 'Course description', example: 'Introduction to Algebra concepts' })
  courseDescription?: string;

  @ApiPropertyOptional({ description: 'Course GPA applicability descriptor', example: 'Applicable' })
  courseGPAApplicabilityDescriptor?: string;

  @ApiProperty({ description: 'Course title', example: 'Algebra I' })
  courseTitle: string;

  @ApiPropertyOptional({ description: 'Date course was adopted', example: '2025-05-30' })
  dateCourseAdopted?: Date;

  @ApiPropertyOptional({ description: 'High school course requirement', example: true })
  highSchoolCourseRequirement?: boolean;

  @ApiProperty({ type: [LearningStandardDTO] })
  learningStandards: LearningStandardDTO[];

  @ApiProperty({ type: [LevelCharacteristicDTO] })
  levelCharacteristics: LevelCharacteristicDTO[];

  @ApiPropertyOptional({ description: 'Maximum completions for credit', example: 1 })
  maxCompletionsForCredit?: number;

  @ApiPropertyOptional({ description: 'Maximum available credit conversion', example: 1.0 })
  maximumAvailableCreditConversion?: number;

  @ApiPropertyOptional({ description: 'Maximum available credits', example: 1.0 })
  maximumAvailableCredits?: number;

  @ApiPropertyOptional({ description: 'Maximum available credit type descriptor', example: 'Carnegie Unit' })
  maximumAvailableCreditTypeDescriptor?: string;

  @ApiPropertyOptional({ description: 'Minimum available credit conversion', example: 1.0 })
  minimumAvailableCreditConversion?: number;

  @ApiPropertyOptional({ description: 'Minimum available credits', example: 1.0 })
  minimumAvailableCredits?: number;

  @ApiPropertyOptional({ description: 'Minimum available credit type descriptor', example: 'Carnegie Unit' })
  minimumAvailableCreditTypeDescriptor?: string;

  @ApiProperty({ description: 'Number of parts', example: 8 })
  numberOfParts: number;

  @ApiProperty({ type: [OfferedGradeLevelDTO] })
  offeredGradeLevels: OfferedGradeLevelDTO[];

  @ApiPropertyOptional({ description: 'Time required for completion', example: 120 })
  timeRequiredForCompletion?: number;

  @ApiProperty({ description: 'ETag for concurrency control', example: '"2025-05-29T07:53:44.000Z"' })
  _etag: string;

  @ApiProperty({ description: 'Last modified date', example: '2025-05-29T07:53:44.000Z' })
  _lastModifiedDate: string;

  constructor(course: Course) {
    this.id = course.id;
    this.courseCode = course.courseCode;
    this.courseTitle = course.courseTitle;
    this.courseDescription = course.courseDescription;
    this.numberOfParts = course.numberOfParts;
    this.timeRequiredForCompletion = course.timeRequiredForCompletion;
    this.dateCourseAdopted = course.dateCourseAdopted;
    this.highSchoolCourseRequirement = course.highSchoolCourseRequirement;
    this.maxCompletionsForCredit = course.maxCompletionsForCredit;
    this.minimumAvailableCredits = course.minimumAvailableCredits;
    this.minimumAvailableCreditConversion = course.minimumAvailableCreditConversion;
    this.maximumAvailableCredits = course.maximumAvailableCredits;
    this.maximumAvailableCreditConversion = course.maximumAvailableCreditConversion;

    // Generate Ed-Fi ETag and lastModifiedDate
    const lastModified = course.lastmodifieddate || course.createdate;
    this._etag = `"${lastModified.toISOString()}"`;
    this._lastModifiedDate = lastModified.toISOString();

    // References and descriptors
    if (course.educationOrganization) {
      this.educationOrganizationReference = {
        educationOrganizationId: course.educationOrganizationId,
        link: {
          rel: 'EducationOrganization',
          href: `/ed-fi/education-organizations/${course.educationOrganizationId}`
        }
      };
    }

    if (course.academicSubjectDescriptor) {
      this.academicSubjects = [{
        academicSubjectDescriptor: course.academicSubjectDescriptor.description
      }];
    }

    if (course.careerPathwayDescriptor) {
      this.careerPathwayDescriptor = course.careerPathwayDescriptor.description;
    }

    if (course.courseDefinedByDescriptor) {
      this.courseDefinedByDescriptor = course.courseDefinedByDescriptor.description;
    }

    if (course.courseGPAApplicabilityDescriptor) {
      this.courseGPAApplicabilityDescriptor = course.courseGPAApplicabilityDescriptor.description;
    }

    if (course.minimumAvailableCreditTypeDescriptor) {
      this.minimumAvailableCreditTypeDescriptor = course.minimumAvailableCreditTypeDescriptor.description;
    }

    if (course.maximumAvailableCreditTypeDescriptor) {
      this.maximumAvailableCreditTypeDescriptor = course.maximumAvailableCreditTypeDescriptor.description;
    }

    // Initialize arrays
    this.identificationCodes = [];
    this.competencyLevels = [];
    this.learningStandards = [];
    this.levelCharacteristics = [];
    this.offeredGradeLevels = [];
  }
} 