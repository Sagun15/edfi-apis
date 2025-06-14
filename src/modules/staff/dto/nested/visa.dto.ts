import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VisaDTO {
    @ApiProperty({ description: 'The visa descriptor', example: 'H1B' })
    @IsString({ message: 'Visa descriptor must be a string' })
    @IsNotEmpty({ message: 'Visa descriptor is required' })
    visaDescriptor: string;
} 