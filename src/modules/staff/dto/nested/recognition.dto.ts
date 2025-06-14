import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class RecognitionDTO {
    @ApiProperty({ description: 'Recognition type descriptor', example: 'Award' })
    @IsString({ message: 'Recognition type descriptor must be a string' })
    @IsNotEmpty({ message: 'Recognition type descriptor is required' })
    recognitionTypeDescriptor: string;

    @ApiPropertyOptional({ description: 'Achievement category descriptor', example: 'Academic' })
    @IsOptional()
    @IsString({ message: 'Achievement category descriptor must be a string' })
    achievementCategoryDescriptor?: string;

    @ApiPropertyOptional({ description: 'Achievement category system', example: 'Local' })
    @IsOptional()
    @IsString({ message: 'Achievement category system must be a string' })
    @MaxLength(60, { message: 'Achievement category system cannot exceed 60 characters' })
    achievementCategorySystem?: string;

    @ApiPropertyOptional({ description: 'Achievement title', example: 'Teacher of the Year' })
    @IsOptional()
    @IsString({ message: 'Achievement title must be a string' })
    @MaxLength(60, { message: 'Achievement title cannot exceed 60 characters' })
    achievementTitle?: string;

    @ApiPropertyOptional({ description: 'Criteria', example: 'Outstanding performance' })
    @IsOptional()
    @IsString({ message: 'Criteria must be a string' })
    @MaxLength(150, { message: 'Criteria cannot exceed 150 characters' })
    criteria?: string;

    @ApiPropertyOptional({ description: 'Criteria URL', example: 'https://example.com/criteria' })
    @IsOptional()
    @IsString({ message: 'Criteria URL must be a string' })
    @IsUrl({}, { message: 'Criteria URL must be a valid URL' })
    criteriaURL?: string;

    @ApiPropertyOptional({ description: 'Evidence statement', example: 'Demonstrated excellence' })
    @IsOptional()
    @IsString({ message: 'Evidence statement must be a string' })
    @MaxLength(150, { message: 'Evidence statement cannot exceed 150 characters' })
    evidenceStatement?: string;

    @ApiPropertyOptional({ description: 'Image URL', example: 'https://example.com/image.jpg' })
    @IsOptional()
    @IsString({ message: 'Image URL must be a string' })
    @IsUrl({}, { message: 'Image URL must be a valid URL' })
    imageURL?: string;

    @ApiPropertyOptional({ description: 'Issuer name', example: 'School District' })
    @IsOptional()
    @IsString({ message: 'Issuer name must be a string' })
    @MaxLength(150, { message: 'Issuer name cannot exceed 150 characters' })
    issuerName?: string;

    @ApiPropertyOptional({ description: 'Issuer origin URL', example: 'https://district.edu' })
    @IsOptional()
    @IsString({ message: 'Issuer origin URL must be a string' })
    @IsUrl({}, { message: 'Issuer origin URL must be a valid URL' })
    issuerOriginURL?: string;

    @ApiPropertyOptional({ description: 'Recognition award date', example: '2025-05-31' })
    @IsOptional()
    @IsDateString({}, { message: 'Recognition award date must be a valid date' })
    recognitionAwardDate?: string;

    @ApiPropertyOptional({ description: 'Recognition award expires date', example: '2025-05-31' })
    @IsOptional()
    @IsDateString({}, { message: 'Recognition award expires date must be a valid date' })
    recognitionAwardExpiresDate?: string;

    @ApiPropertyOptional({ description: 'Recognition description', example: 'Annual teaching excellence award' })
    @IsOptional()
    @IsString({ message: 'Recognition description must be a string' })
    @MaxLength(150, { message: 'Recognition description cannot exceed 150 characters' })
    recognitionDescription?: string;
} 