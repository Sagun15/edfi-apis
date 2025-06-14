import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class IdentificationDocumentDTO {
    @ApiProperty({ description: 'The type of use for this identification document', example: 'License' })
    @IsString({ message: 'Identification document use descriptor must be a string' })
    @IsNotEmpty({ message: 'Identification document use descriptor is required' })
    identificationDocumentUseDescriptor: string;

    @ApiProperty({ description: 'Personal information verification descriptor', example: 'State Issued ID' })
    @IsString({ message: 'Personal information verification descriptor must be a string' })
    @IsNotEmpty({ message: 'Personal information verification descriptor is required' })
    personalInformationVerificationDescriptor: string;

    @ApiProperty({ description: 'Country that issued the document', example: 'US' })
    @IsString({ message: 'Issuer country descriptor must be a string' })
    @IsNotEmpty({ message: 'Issuer country descriptor is required' })
    issuerCountryDescriptor: string;

    @ApiPropertyOptional({ description: 'Document expiration date', example: '2025-05-31' })
    @IsOptional()
    @IsDateString({}, { message: 'Document expiration date must be a valid date' })
    documentExpirationDate?: string;

    @ApiPropertyOptional({ description: 'Document title', example: 'Driver License' })
    @IsOptional()
    @IsString({ message: 'Document title must be a string' })
    @MaxLength(60, { message: 'Document title cannot exceed 60 characters' })
    documentTitle?: string;

    @ApiPropertyOptional({ description: 'Issuer document identification code', example: 'DL12345' })
    @IsOptional()
    @IsString({ message: 'Issuer document identification code must be a string' })
    @MaxLength(60, { message: 'Issuer document identification code cannot exceed 60 characters' })
    issuerDocumentIdentificationCode?: string;

    @ApiPropertyOptional({ description: 'Issuer name', example: 'Texas DPS' })
    @IsOptional()
    @IsString({ message: 'Issuer name must be a string' })
    @MaxLength(150, { message: 'Issuer name cannot exceed 150 characters' })
    issuerName?: string;
} 