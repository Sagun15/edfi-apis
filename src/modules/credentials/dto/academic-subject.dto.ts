import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AcademicSubjectDTO {
    @ApiProperty({ description: 'The academic subject descriptor', example: 'Mathematics' })
    @IsNotEmpty({ message: 'Academic subject descriptor is required' })
    @IsString({ message: 'Academic subject descriptor must be a string' })
    academicSubjectDescriptor: string;
} 