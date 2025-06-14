import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GradeLevelDTO {
    @ApiProperty({ description: 'The grade level descriptor', example: 'Ninth grade' })
    @IsNotEmpty({ message: 'Grade level descriptor is required' })
    @IsString({ message: 'Grade level descriptor must be a string' })
    gradeLevelDescriptor: string;
} 