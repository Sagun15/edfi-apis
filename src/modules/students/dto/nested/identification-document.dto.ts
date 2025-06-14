import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsOptional, IsISO8601 } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class IdentificationDocumentDTO {
    @ApiProperty({ 
        description: 'The primary function of the document used for establishing identity.',
        maxLength: 306,
        example: 'uri://ed-fi.org/IdentificationDocumentUseDescriptor#Birth certificate'
    })
    @IsNotEmpty({ message: 'Identification document use descriptor is required' })
    @IsString({ message: 'Identification document use descriptor must be a string' })
    @MaxLength(306, { message: 'Identification document use descriptor cannot exceed 306 characters' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    identificationDocumentUseDescriptor: string;

    @ApiProperty({ 
        description: 'The category of the document relative to its purpose.',
        maxLength: 306,
        example: 'uri://ed-fi.org/PersonalInformationVerificationDescriptor#Official document'
    })
    @IsNotEmpty({ message: 'Personal information verification descriptor is required' })
    @IsString({ message: 'Personal information verification descriptor must be a string' })
    @MaxLength(306, { message: 'Personal information verification descriptor cannot exceed 306 characters' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    personalInformationVerificationDescriptor: string;

    @ApiPropertyOptional({ 
        description: 'Country of origin of the document. It is strongly recommended that entries use only ISO 3166 2-letter country codes.',
        maxLength: 306,
        example: 'uri://ed-fi.org/CountryDescriptor#US'
    })
    @IsOptional()
    @IsString({ message: 'Issuer country descriptor must be a string' })
    @MaxLength(306, { message: 'Issuer country descriptor cannot exceed 306 characters' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    issuerCountryDescriptor?: string;

    @ApiPropertyOptional({ 
        description: 'The day when the document expires, if null then never expires.',
        example: '2030-12-31'
    })
    @IsOptional()
    @IsISO8601({ strict: true }, { message: 'Document expiration date must be a valid ISO 8601 date' })
    @Transform(({ value }: TransformFnParams) => {
        if (!value) return value;
        const date = new Date(value);
        const now = new Date();
        if (date <= now) {
            throw new Error('Document expiration date must be in the future');
        }
        return value;
    })
    documentExpirationDate?: string;

    @ApiPropertyOptional({ 
        description: 'The title of the document given by the issuer.',
        maxLength: 60,
        example: 'Birth Certificate'
    })
    @IsOptional()
    @IsString({ message: 'Document title must be a string' })
    @MaxLength(60, { message: 'Document title cannot exceed 60 characters' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    documentTitle?: string;

    @ApiPropertyOptional({ 
        description: 'The unique identifier on the issuer\'s identification system.',
        maxLength: 60,
        example: 'BC123456789'
    })
    @IsOptional()
    @IsString({ message: 'Issuer document identification code must be a string' })
    @MaxLength(60, { message: 'Issuer document identification code cannot exceed 60 characters' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    issuerDocumentIdentificationCode?: string;

    @ApiPropertyOptional({ 
        description: 'Name of the entity or institution that issued the document.',
        maxLength: 150,
        example: 'Department of Health'
    })
    @IsOptional()
    @IsString({ message: 'Issuer name must be a string' })
    @MaxLength(150, { message: 'Issuer name cannot exceed 150 characters' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    issuerName?: string;
} 