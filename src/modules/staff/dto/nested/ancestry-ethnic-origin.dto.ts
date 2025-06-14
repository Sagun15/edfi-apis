import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AncestryEthnicOriginDTO {
    @ApiProperty({ description: 'The ancestry ethnic origin descriptor', example: 'European' })
    @IsString({ message: 'Ancestry ethnic origin descriptor must be a string' })
    @IsNotEmpty({ message: 'Ancestry ethnic origin descriptor is required' })
    ancestryEthnicOriginDescriptor: string;
} 