import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RaceDTO {
    @ApiProperty({ description: 'The race descriptor', example: 'Asian' })
    @IsString({ message: 'Race descriptor must be a string' })
    @IsNotEmpty({ message: 'Race descriptor is required' })
    raceDescriptor: string;
} 