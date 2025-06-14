import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsArray, ValidateNested, IsInt, Min, MaxLength, Matches } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { TransformFnParams } from 'class-transformer';

class CourseLevelCharacteristicRequest {
    @ApiProperty({ description: 'Course level characteristic descriptor', example: 'Advanced Placement' })
    @IsNotEmpty({ message: 'Course level characteristic descriptor is required' })
    @IsString({ message: 'Course level characteristic descriptor must be a string' })
    @MaxLength(50, { message: 'Course level characteristic descriptor cannot exceed 50 characters' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    courseLevelCharacteristicDescriptor: string;
}

class CurriculumUsedRequest {
    @ApiProperty({ description: 'Curriculum used descriptor', example: 'State Curriculum' })
    @IsNotEmpty({ message: 'Curriculum used descriptor is required' })
    @IsString({ message: 'Curriculum used descriptor must be a string' })
    @MaxLength(50, { message: 'Curriculum used descriptor cannot exceed 50 characters' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    curriculumUsedDescriptor: string;
}

export class CreateCourseOfferingDTO {
    @ApiProperty({ description: 'Local course code', example: 'ALG-1' })
    @IsNotEmpty({ message: 'Local course code is required' })
    @IsString({ message: 'Local course code must be a string' })
    @MaxLength(60, { message: 'Local course code cannot exceed 60 characters' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @Matches(/^[A-Za-z0-9\-]+$/, { message: 'Local course code can only contain letters, numbers, and hyphens' })
    localCourseCode: string;

    @ApiProperty({ description: 'Course code', example: 'ALG-1' })
    @IsNotEmpty({ message: 'Course code is required' })
    @IsString({ message: 'Course code must be a string' })
    @MaxLength(60, { message: 'Course code cannot exceed 60 characters' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @Matches(/^[A-Za-z0-9\-]+$/, { message: 'Course code can only contain letters, numbers, and hyphens' })
    courseCode: string;

    @ApiProperty({ description: 'Education organization ID', example: 255901 })
    @IsNotEmpty({ message: 'Education organization ID is required' })
    @IsInt({ message: 'Education organization ID must be an integer' })
    @Min(1, { message: 'Education organization ID must be positive' })
    @Transform(({ value }: TransformFnParams) => parseInt(value))
    educationOrganizationId: number;

    @ApiProperty({ description: 'School ID', example: 255901 })
    @IsNotEmpty({ message: 'School ID is required' })
    @IsInt({ message: 'School ID must be an integer' })
    @Min(1, { message: 'School ID must be positive' })
    @Transform(({ value }: TransformFnParams) => parseInt(value))
    schoolId: number;

    @ApiProperty({ description: 'School year', example: 2020 })
    @IsNotEmpty({ message: 'School year is required' })
    @IsInt({ message: 'School year must be an integer' })
    @Min(1900, { message: 'School year must be after 1900' })
    @Transform(({ value }: TransformFnParams) => parseInt(value))
    schoolYear: number;

    @ApiProperty({ description: 'Session name', example: 'Fall Semester' })
    @IsNotEmpty({ message: 'Session name is required' })
    @IsString({ message: 'Session name must be a string' })
    @MaxLength(60, { message: 'Session name cannot exceed 60 characters' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    sessionName: string;

    @ApiPropertyOptional({ description: 'Local course title', example: 'Algebra I' })
    @IsOptional()
    @IsString({ message: 'Local course title must be a string' })
    @MaxLength(60, { message: 'Local course title cannot exceed 60 characters' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    localCourseTitle?: string;

    @ApiPropertyOptional({ description: 'Instructional time planned', example: 120 })
    @IsOptional()
    @IsInt({ message: 'Instructional time planned must be an integer' })
    @Min(0, { message: 'Instructional time planned must be non-negative' })
    @Transform(({ value }: TransformFnParams) => value ? parseInt(value) : undefined)
    instructionalTimePlanned?: number;

    @ApiPropertyOptional({ description: 'Course level characteristics', type: [CourseLevelCharacteristicRequest] })
    @IsOptional()
    @IsArray({ message: 'Course level characteristics must be an array' })
    @ValidateNested({ each: true })
    @Type(() => CourseLevelCharacteristicRequest)
    courseLevelCharacteristics?: CourseLevelCharacteristicRequest[];

    @ApiPropertyOptional({ description: 'Curriculum used', type: [CurriculumUsedRequest] })
    @IsOptional()
    @IsArray({ message: 'Curriculum used must be an array' })
    @ValidateNested({ each: true })
    @Type(() => CurriculumUsedRequest)
    curriculumUseds?: CurriculumUsedRequest[];
} 