import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsString,
    IsInt,
    Min,
    IsDate,
    IsPositive,
    ValidateNested,
    IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class LinkDTO {
    @ApiProperty({ description: 'Link relation', example: 'self' })
    @IsString()
    @IsNotEmpty()
    rel: string;

    @ApiProperty({ description: 'Link URL', example: 'https://api.example.com/schools/123' })
    @IsString()
    @IsNotEmpty()
    href: string;
}

class SchoolReferenceDTO {
    @ApiProperty({ description: 'School ID', example: 123456 })
    @IsNotEmpty({ message: 'School ID is required' })
    @IsInt({ message: 'School ID must be an integer' })
    @IsPositive({ message: 'School ID must be positive' })
    schoolId: number;

    @ApiProperty({ description: 'School reference link' })
    @ValidateNested()
    @Type(() => LinkDTO)
    @IsOptional()
    link?: LinkDTO;
}

class SchoolYearReferenceDTO {
    @ApiProperty({ description: 'School year', example: 2024 })
    @IsNotEmpty({ message: 'School year is required' })
    @IsInt({ message: 'School year must be an integer' })
    @Min(1900, { message: 'School year must be after 1900' })
    schoolYear: number;

    @ApiProperty({ description: 'School year reference link' })
    @ValidateNested()
    @Type(() => LinkDTO)
    @IsOptional()
    link?: LinkDTO;
}

export class CreateGradingPeriodDTO {
    @ApiProperty({ description: 'Unique identifier', example: 'uuid-1234' })
    @IsOptional()
    @IsString()
    id?: string;

    @ApiProperty({ description: 'Grading period descriptor', example: 'uri://ed-fi.org/GradingPeriodDescriptor#First Six Weeks' })
    @IsNotEmpty({ message: 'Grading period descriptor is required' })
    @IsString({ message: 'Grading period descriptor must be a string' })
    gradingPeriodDescriptor: string;

    @ApiProperty({ description: 'Grading period name', example: 'First Six Weeks' })
    @IsNotEmpty({ message: 'Grading period name is required' })
    @IsString({ message: 'Grading period name must be a string' })
    gradingPeriodName: string;

    @ApiProperty({ description: 'School reference' })
    @ValidateNested()
    @Type(() => SchoolReferenceDTO)
    @IsNotEmpty({ message: 'School reference is required' })
    schoolReference: SchoolReferenceDTO;

    @ApiProperty({ description: 'School year reference' })
    @ValidateNested()
    @Type(() => SchoolYearReferenceDTO)
    @IsNotEmpty({ message: 'School year reference is required' })
    schoolYearTypeReference: SchoolYearReferenceDTO;

    @ApiProperty({ description: 'Period sequence', example: 1 })
    @IsNotEmpty({ message: 'Period sequence is required' })
    @IsInt({ message: 'Period sequence must be an integer' })
    @IsPositive({ message: 'Period sequence must be positive' })
    periodSequence: number;

    @ApiProperty({ description: 'Begin date', example: '2024-08-01' })
    @IsNotEmpty({ message: 'Begin date is required' })
    @Type(() => Date)
    @IsDate({ message: 'Begin date must be a valid date' })
    beginDate: Date;

    @ApiProperty({ description: 'End date', example: '2024-12-20' })
    @IsNotEmpty({ message: 'End date is required' })
    @Type(() => Date)
    @IsDate({ message: 'End date must be a valid date' })
    endDate: Date;

    @ApiProperty({ description: 'Total instructional days', example: 90 })
    @IsNotEmpty({ message: 'Total instructional days is required' })
    @IsInt({ message: 'Total instructional days must be an integer' })
    @IsPositive({ message: 'Total instructional days must be positive' })
    totalInstructionalDays: number;
} 