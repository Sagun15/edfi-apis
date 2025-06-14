import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class InternationalAddressDTO {
    @ApiProperty({ description: 'The type of address', example: 'Physical' })
    @IsString({ message: 'Address type descriptor must be a string' })
    @IsNotEmpty({ message: 'Address type descriptor is required' })
    addressTypeDescriptor: string;

    @ApiProperty({ description: 'The country descriptor', example: 'France' })
    @IsString({ message: 'Country descriptor must be a string' })
    @IsNotEmpty({ message: 'Country descriptor is required' })
    countryDescriptor: string;

    @ApiProperty({ description: 'Address line 1', example: '123 Rue de Paris' })
    @IsString({ message: 'Address line 1 must be a string' })
    @IsNotEmpty({ message: 'Address line 1 is required' })
    @MaxLength(150, { message: 'Address line 1 cannot exceed 150 characters' })
    addressLine1: string;

    @ApiPropertyOptional({ description: 'Address line 2' })
    @IsOptional()
    @IsString({ message: 'Address line 2 must be a string' })
    @MaxLength(150, { message: 'Address line 2 cannot exceed 150 characters' })
    addressLine2?: string;

    @ApiPropertyOptional({ description: 'Address line 3' })
    @IsOptional()
    @IsString({ message: 'Address line 3 must be a string' })
    @MaxLength(150, { message: 'Address line 3 cannot exceed 150 characters' })
    addressLine3?: string;

    @ApiPropertyOptional({ description: 'Address line 4' })
    @IsOptional()
    @IsString({ message: 'Address line 4 must be a string' })
    @MaxLength(150, { message: 'Address line 4 cannot exceed 150 characters' })
    addressLine4?: string;

    @ApiProperty({ description: 'Begin date', example: '2025-05-31' })
    @IsDateString({}, { message: 'Begin date must be a valid date' })
    beginDate: string;

    @ApiProperty({ description: 'End date', example: '2025-05-31' })
    @IsDateString({}, { message: 'End date must be a valid date' })
    endDate: string;

    @ApiPropertyOptional({ description: 'Latitude', example: '48.8566' })
    @IsOptional()
    @IsString({ message: 'Latitude must be a string' })
    @MaxLength(20, { message: 'Latitude cannot exceed 20 characters' })
    latitude?: string;

    @ApiPropertyOptional({ description: 'Longitude', example: '2.3522' })
    @IsOptional()
    @IsString({ message: 'Longitude must be a string' })
    @MaxLength(20, { message: 'Longitude cannot exceed 20 characters' })
    longitude?: string;
} 