import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { LinkDTO } from './link.dto';

export class PersonReferenceDTO {
    @ApiProperty({ description: 'The identifier for the person', example: 'PERSON123' })
    @IsString({ message: 'Person ID must be a string' })
    @IsNotEmpty({ message: 'Person ID is required' })
    @MaxLength(32, { message: 'Person ID cannot exceed 32 characters' })
    personId: string;

    @ApiProperty({ description: 'The source system descriptor', example: 'SIS' })
    @IsString({ message: 'Source system descriptor must be a string' })
    @IsNotEmpty({ message: 'Source system descriptor is required' })
    @MaxLength(50, { message: 'Source system descriptor cannot exceed 50 characters' })
    sourceSystemDescriptor: string;

    @ApiProperty({ description: 'The link to the person resource', type: LinkDTO })
    @ValidateNested({ message: 'Link must be a valid link object' })
    @Type(() => LinkDTO)
    @IsNotEmpty({ message: 'Link is required' })
    link: LinkDTO;
} 