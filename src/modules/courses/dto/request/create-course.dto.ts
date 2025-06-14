import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsISO8601,
  IsArray,
  ValidateNested,
  IsInt,
  Min,
  Max,
  IsPositive,
  IsUrl,
  MaxLength,
  MinLength,
  Matches,
  ArrayMinSize,
  IsUUID,
  ValidateIf
} from 'class-validator';

export class CourseIdentificationCodeDTO {
  @ApiProperty({ description: 'Course identification system descriptor', example: 'State Course Code' })
  @IsNotEmpty({ message: 'Course identification system descriptor is required' })
  @IsString({ message: 'Course identification system descriptor must be a string' })
  @MaxLength(50, { message: 'Course identification system descriptor cannot exceed 50 characters' })
  courseIdentificationSystemDescriptor: string;

  @ApiProperty({ description: 'Assigning organization identification code', example: 'ABC123' })
  @IsNotEmpty({ message: 'Assigning organization identification code is required' })
  @IsString({ message: 'Assigning organization identification code must be a string' })
  @MaxLength(60, { message: 'Assigning organization identification code cannot exceed 60 characters' })
  assigningOrganizationIdentificationCode: string;

  @ApiPropertyOptional({ description: 'Course catalog URL', example: 'http://example.com/course' })
  @IsOptional()
  @IsUrl({}, { message: 'Course catalog URL must be a valid URL' })
  @MaxLength(255, { message: 'Course catalog URL cannot exceed 255 characters' })
  courseCatalogURL?: string;

  @ApiProperty({ description: 'Identification code', example: 'MATH101' })
  @IsNotEmpty({ message: 'Identification code is required' })
  @IsString({ message: 'Identification code must be a string' })
  @MaxLength(60, { message: 'Identification code cannot exceed 60 characters' })
  identificationCode: string;
}

export class EducationOrganizationReferenceDTO {
  @ApiProperty({ description: 'Education organization ID', example: 123456 })
  @IsNotEmpty({ message: 'Education organization ID is required' })
  @IsNumber({}, { message: 'Education organization ID must be a number' })
  @IsPositive({ message: 'Education organization ID must be a positive number' })
  educationOrganizationId: number;
}

export class AcademicSubjectDTO {
  @ApiProperty({ description: 'Academic subject descriptor', example: 'Mathematics' })
  @IsNotEmpty({ message: 'Academic subject descriptor is required' })
  @IsString({ message: 'Academic subject descriptor must be a string' })
  @MaxLength(50, { message: 'Academic subject descriptor cannot exceed 50 characters' })
  academicSubjectDescriptor: string;
}

export class CompetencyLevelDTO {
  @ApiProperty({ description: 'Competency level descriptor', example: 'Advanced' })
  @IsNotEmpty({ message: 'Competency level descriptor is required' })
  @IsString({ message: 'Competency level descriptor must be a string' })
  @MaxLength(50, { message: 'Competency level descriptor cannot exceed 50 characters' })
  competencyLevelDescriptor: string;
}

export class LearningStandardReferenceDTO {
  @ApiProperty({ description: 'Learning standard ID', example: 'CCSS.Math.Content.HSA.CED.A.1' })
  @IsNotEmpty({ message: 'Learning standard ID is required' })
  @IsString({ message: 'Learning standard ID must be a string' })
  @MaxLength(60, { message: 'Learning standard ID cannot exceed 60 characters' })
  learningStandardId: string;
}

export class LearningStandardDTO {
  @ApiProperty({ type: LearningStandardReferenceDTO })
  @ValidateNested()
  @Type(() => LearningStandardReferenceDTO)
  learningStandardReference: LearningStandardReferenceDTO;
}

export class LevelCharacteristicDTO {
  @ApiProperty({ description: 'Course level characteristic descriptor', example: 'Advanced Placement' })
  @IsNotEmpty({ message: 'Course level characteristic descriptor is required' })
  @IsString({ message: 'Course level characteristic descriptor must be a string' })
  @MaxLength(50, { message: 'Course level characteristic descriptor cannot exceed 50 characters' })
  courseLevelCharacteristicDescriptor: string;
}

export class OfferedGradeLevelDTO {
  @ApiProperty({ description: 'Grade level descriptor', example: 'Ninth grade' })
  @IsNotEmpty({ message: 'Grade level descriptor is required' })
  @IsString({ message: 'Grade level descriptor must be a string' })
  @MaxLength(50, { message: 'Grade level descriptor cannot exceed 50 characters' })
  gradeLevelDescriptor: string;
}

export class CreateCourseDTO {
  @ApiProperty({ description: 'The unique identifier for the course', example: 'uuid-1234' })
  @IsOptional()
  @IsString({ message: 'ID must be a string' })
  @IsUUID('4', { message: 'ID must be a valid UUID' })
  id?: string;

  @ApiProperty({ description: 'Course code', example: 'ALG-1' })
  @IsNotEmpty({ message: 'Course code is required' })
  @IsString({ message: 'Course code must be a string' })
  @MaxLength(60, { message: 'Course code cannot exceed 60 characters' })
  @Matches(/^[A-Za-z0-9\-]+$/, { message: 'Course code can only contain letters, numbers, and hyphens' })
  courseCode: string;

  @ApiProperty({ type: [CourseIdentificationCodeDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CourseIdentificationCodeDTO)
  @ArrayMinSize(1, { message: 'At least one identification code is required' })
  identificationCodes: CourseIdentificationCodeDTO[];

  @ApiProperty({ type: EducationOrganizationReferenceDTO })
  @ValidateNested()
  @Type(() => EducationOrganizationReferenceDTO)
  educationOrganizationReference: EducationOrganizationReferenceDTO;

  @ApiProperty({ type: [AcademicSubjectDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AcademicSubjectDTO)
  @ArrayMinSize(1, { message: 'At least one academic subject is required' })
  academicSubjects: AcademicSubjectDTO[];

  @ApiPropertyOptional({ description: 'Career pathway descriptor', example: 'Science and Technology' })
  @IsOptional()
  @IsString({ message: 'Career pathway descriptor must be a string' })
  @MaxLength(50, { message: 'Career pathway descriptor cannot exceed 50 characters' })
  careerPathwayDescriptor?: string;

  @ApiProperty({ type: [CompetencyLevelDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CompetencyLevelDTO)
  competencyLevels: CompetencyLevelDTO[];

  @ApiPropertyOptional({ description: 'Course defined by descriptor', example: 'State' })
  @IsOptional()
  @IsString({ message: 'Course defined by descriptor must be a string' })
  @MaxLength(50, { message: 'Course defined by descriptor cannot exceed 50 characters' })
  courseDefinedByDescriptor?: string;

  @ApiPropertyOptional({ description: 'Course description', example: 'Introduction to Algebra concepts' })
  @IsOptional()
  @IsString({ message: 'Course description must be a string' })
  @MaxLength(1024, { message: 'Course description cannot exceed 1024 characters' })
  courseDescription?: string;

  @ApiPropertyOptional({ description: 'Course GPA applicability descriptor', example: 'Applicable' })
  @IsOptional()
  @IsString({ message: 'Course GPA applicability descriptor must be a string' })
  @MaxLength(50, { message: 'Course GPA applicability descriptor cannot exceed 50 characters' })
  courseGPAApplicabilityDescriptor?: string;

  @ApiProperty({ description: 'Course title', example: 'Algebra I' })
  @IsNotEmpty({ message: 'Course title is required' })
  @IsString({ message: 'Course title must be a string' })
  @MinLength(3, { message: 'Course title must be at least 3 characters long' })
  @MaxLength(60, { message: 'Course title cannot exceed 60 characters' })
  courseTitle: string;

  @ApiPropertyOptional({ description: 'Date course was adopted', example: '2025-05-30' })
  @IsOptional()
  @IsISO8601({ strict: true }, { message: 'Date course adopted must be a valid ISO 8601 date' })
  dateCourseAdopted?: string;

  @ApiPropertyOptional({ description: 'High school course requirement', example: true })
  @IsOptional()
  @IsBoolean({ message: 'High school course requirement must be a boolean' })
  highSchoolCourseRequirement?: boolean;

  @ApiProperty({ type: [LearningStandardDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LearningStandardDTO)
  learningStandards: LearningStandardDTO[];

  @ApiProperty({ type: [LevelCharacteristicDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LevelCharacteristicDTO)
  levelCharacteristics: LevelCharacteristicDTO[];

  @ApiPropertyOptional({ description: 'Maximum completions for credit', example: 1 })
  @IsOptional()
  @IsInt({ message: 'Maximum completions for credit must be an integer' })
  @Min(1, { message: 'Maximum completions for credit must be at least 1' })
  maxCompletionsForCredit?: number;

  @ApiPropertyOptional({ description: 'Maximum available credit conversion', example: 1.0 })
  @IsOptional()
  @IsNumber({}, { message: 'Maximum available credit conversion must be a number' })
  @Min(0, { message: 'Maximum available credit conversion must be non-negative' })
  @Max(9999999.99, { message: 'Maximum available credit conversion cannot exceed 9999999.99' })
  maximumAvailableCreditConversion?: number;

  @ApiPropertyOptional({ description: 'Maximum available credits', example: 1.0 })
  @IsOptional()
  @IsNumber({}, { message: 'Maximum available credits must be a number' })
  @Min(0, { message: 'Maximum available credits must be non-negative' })
  @Max(999999.999, { message: 'Maximum available credits cannot exceed 999999.999' })
  maximumAvailableCredits?: number;

  @ApiPropertyOptional({ description: 'Maximum available credit type descriptor', example: 'Carnegie Unit' })
  @IsOptional()
  @IsString({ message: 'Maximum available credit type descriptor must be a string' })
  @MaxLength(50, { message: 'Maximum available credit type descriptor cannot exceed 50 characters' })
  maximumAvailableCreditTypeDescriptor?: string;

  @ApiPropertyOptional({ description: 'Minimum available credit conversion', example: 1.0 })
  @IsOptional()
  @IsNumber({}, { message: 'Minimum available credit conversion must be a number' })
  @Min(0, { message: 'Minimum available credit conversion must be non-negative' })
  @Max(9999999.99, { message: 'Minimum available credit conversion cannot exceed 9999999.99' })
  minimumAvailableCreditConversion?: number;

  @ApiPropertyOptional({ description: 'Minimum available credits', example: 1.0 })
  @IsOptional()
  @IsNumber({}, { message: 'Minimum available credits must be a number' })
  @Min(0, { message: 'Minimum available credits must be non-negative' })
  @Max(999999.999, { message: 'Minimum available credits cannot exceed 999999.999' })
  minimumAvailableCredits?: number;

  @ApiPropertyOptional({ description: 'Minimum available credit type descriptor', example: 'Carnegie Unit' })
  @IsOptional()
  @IsString({ message: 'Minimum available credit type descriptor must be a string' })
  @MaxLength(50, { message: 'Minimum available credit type descriptor cannot exceed 50 characters' })
  minimumAvailableCreditTypeDescriptor?: string;

  @ApiProperty({ description: 'Number of parts', example: 8 })
  @IsNotEmpty({ message: 'Number of parts is required' })
  @IsInt({ message: 'Number of parts must be an integer' })
  @Min(1, { message: 'Number of parts must be at least 1' })
  numberOfParts: number;

  @ApiProperty({ type: [OfferedGradeLevelDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OfferedGradeLevelDTO)
  @ArrayMinSize(1, { message: 'At least one offered grade level is required' })
  offeredGradeLevels: OfferedGradeLevelDTO[];

  @ApiPropertyOptional({ description: 'Time required for completion', example: 120 })
  @IsOptional()
  @IsInt({ message: 'Time required for completion must be an integer' })
  @Min(1, { message: 'Time required for completion must be at least 1' })
  timeRequiredForCompletion?: number;
} 