import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TribalAffiliationDTO {
    @ApiProperty({ description: 'The tribal affiliation descriptor', example: 'Cherokee' })
    @IsString({ message: 'Tribal affiliation descriptor must be a string' })
    @IsNotEmpty({ message: 'Tribal affiliation descriptor is required' })
    tribalAffiliationDescriptor: string;
} 