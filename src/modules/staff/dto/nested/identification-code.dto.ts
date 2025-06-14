import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class IdentificationCodeDTO {
    @ApiProperty({ description: 'The staff identification system descriptor', example: 'State ID' })
    @IsString({ message: 'Staff identification system descriptor must be a string' })
    @IsNotEmpty({ message: 'Staff identification system descriptor is required' })
    staffIdentificationSystemDescriptor: string;

    @ApiProperty({ description: 'The organization identification code', example: 'ORG123' })
    @IsString({ message: 'Assigning organization identification code must be a string' })
    @IsNotEmpty({ message: 'Assigning organization identification code is required' })
    @MaxLength(60, { message: 'Assigning organization identification code cannot exceed 60 characters' })
    assigningOrganizationIdentificationCode: string;

    @ApiProperty({ description: 'The actual identification code', example: 'STAFF123' })
    @IsString({ message: 'Identification code must be a string' })
    @IsNotEmpty({ message: 'Identification code is required' })
    @MaxLength(60, { message: 'Identification code cannot exceed 60 characters' })
    identificationCode: string;
} 