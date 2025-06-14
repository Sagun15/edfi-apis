import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsInt, IsArray, ValidateNested, IsOptional, MaxLength, Min, Max, IsUUID } from 'class-validator';

class SchoolReferenceDTO {
    @ApiProperty({ description: 'The identifier for the school', example: 123 })
    @IsNotEmpty({ message: 'School ID is required' })
    @IsInt({ message: 'School ID must be an integer' })
    schoolId: number;
}

class SchoolYearReferenceDTO {
    @ApiProperty({ description: 'The identifier for the school year', example: 2024 })
    @IsNotEmpty({ message: 'School year is required' })
    @IsInt({ message: 'School year must be an integer' })
    @Min(1900, { message: 'School year must be after 1900' })
    @Max(2100, { message: 'School year must be before 2100' })
    schoolYear: number;
}

class GradeLevelDTO {
    @ApiProperty({ description: 'The grade level descriptor', example: 'Ninth grade' })
    @IsNotEmpty({ message: 'Grade level descriptor is required' })
    @IsString({ message: 'Grade level descriptor must be a string' })
    @MaxLength(50, { message: 'Grade level descriptor cannot exceed 50 characters' })
    gradeLevelDescriptor: string;
}

export class CreateCalendarDTO {
    @ApiProperty({ description: 'The unique identifier for the calendar', example: 'uuid-1234' })
    @IsOptional()
    @IsString({ message: 'ID must be a string' })
    @IsUUID('4', { message: 'ID must be a valid UUID' })
    id?: string;

    @ApiProperty({ description: 'Calendar code', example: 'CAL-2024' })
    @IsNotEmpty({ message: 'Calendar code is required' })
    @IsString({ message: 'Calendar code must be a string' })
    @MaxLength(60, { message: 'Calendar code cannot exceed 60 characters' })
    calendarCode: string;

    @ApiProperty({ description: 'School reference' })
    @IsNotEmpty({ message: 'School reference is required' })
    @ValidateNested()
    @Type(() => SchoolReferenceDTO)
    schoolReference: SchoolReferenceDTO;

    @ApiProperty({ description: 'School year reference' })
    @IsNotEmpty({ message: 'School year reference is required' })
    @ValidateNested()
    @Type(() => SchoolYearReferenceDTO)
    schoolYearTypeReference: SchoolYearReferenceDTO;

    @ApiProperty({ description: 'Calendar type descriptor', example: 'Regular school calendar' })
    @IsNotEmpty({ message: 'Calendar type descriptor is required' })
    @IsString({ message: 'Calendar type descriptor must be a string' })
    @MaxLength(50, { message: 'Calendar type descriptor cannot exceed 50 characters' })
    calendarTypeDescriptor: string;

    @ApiPropertyOptional({ description: 'Grade levels', type: [GradeLevelDTO] })
    @IsOptional()
    @IsArray({ message: 'Grade levels must be an array' })
    @ValidateNested({ each: true })
    @Type(() => GradeLevelDTO)
    gradeLevels?: GradeLevelDTO[];
} 