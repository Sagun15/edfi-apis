import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsISO8601, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, ValidateNested } from 'class-validator';
import { AcademicSubjectDTO } from './academic-subject.dto';
import { CredentialEndorsementDTO } from './credential-endorsement.dto';
import { GradeLevelDTO } from './grade-level.dto';

export class UpdateCredentialDTO {
    @ApiProperty({ description: 'The unique identifier (UUID) for this record', example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsNotEmpty({ message: 'Id is required' })
    @IsUUID('4', { message: 'Id must be a valid UUID' })
    id: string;

    @ApiProperty({ description: 'The unique identifier for the credential', example: 'CRED123' })
    @IsNotEmpty({ message: 'Credential identifier is required' })
    @IsString({ message: 'Credential identifier must be a string' })
    @MaxLength(60, { message: 'Credential identifier cannot exceed 60 characters' })
    credentialIdentifier: string;

    @ApiProperty({ description: 'The state that issued the credential', example: 'TX' })
    @IsNotEmpty({ message: 'State abbreviation descriptor is required' })
    @IsString({ message: 'State abbreviation descriptor must be a string' })
    stateOfIssueStateAbbreviationDescriptor: string;

    @ApiProperty({ description: 'The academic subjects associated with the credential', type: [AcademicSubjectDTO] })
    @IsOptional()
    @IsArray({ message: 'Academic subjects must be an array' })
    @ValidateNested({ each: true, message: 'Each academic subject must be valid' })
    @Type(() => AcademicSubjectDTO)
    academicSubjects?: AcademicSubjectDTO[];

    @ApiPropertyOptional({ description: 'The credential field descriptor', example: 'Elementary Education' })
    @IsOptional()
    @IsString({ message: 'Credential field descriptor must be a string' })
    credentialFieldDescriptor?: string;

    @ApiProperty({ description: 'The type of credential', example: 'Teaching Certificate' })
    @IsNotEmpty({ message: 'Credential type descriptor is required' })
    @IsString({ message: 'Credential type descriptor must be a string' })
    credentialTypeDescriptor: string;

    @ApiPropertyOptional({ description: 'The date the credential becomes effective', example: '2025-06-01' })
    @IsOptional()
    @IsISO8601({ strict: true }, { message: 'Effective date must be a valid ISO 8601 date' })
    effectiveDate?: string;

    @ApiProperty({ description: 'The endorsements associated with the credential', type: [CredentialEndorsementDTO] })
    @IsOptional()
    @IsArray({ message: 'Endorsements must be an array' })
    @ValidateNested({ each: true, message: 'Each endorsement must be valid' })
    @Type(() => CredentialEndorsementDTO)
    endorsements?: CredentialEndorsementDTO[];

    @ApiPropertyOptional({ description: 'The date the credential expires', example: '2025-06-01' })
    @IsOptional()
    @IsISO8601({ strict: true }, { message: 'Expiration date must be a valid ISO 8601 date' })
    expirationDate?: string;

    @ApiProperty({ description: 'The grade levels associated with the credential', type: [GradeLevelDTO] })
    @IsOptional()
    @IsArray({ message: 'Grade levels must be an array' })
    @ValidateNested({ each: true, message: 'Each grade level must be valid' })
    @Type(() => GradeLevelDTO)
    gradeLevels?: GradeLevelDTO[];

    @ApiProperty({ description: 'The date the credential was issued', example: '2025-06-01' })
    @IsNotEmpty({ message: 'Issuance date is required' })
    @IsISO8601({ strict: true }, { message: 'Issuance date must be a valid ISO 8601 date' })
    issuanceDate: string;

    @ApiProperty({ description: 'The namespace for the credential', example: 'uri://ed-fi.org/Credential' })
    @IsNotEmpty({ message: 'Namespace is required' })
    @IsString({ message: 'Namespace must be a string' })
    @MaxLength(255, { message: 'Namespace cannot exceed 255 characters' })
    namespace: string;

    @ApiPropertyOptional({ description: 'The basis for the teaching credential', example: 'Traditional' })
    @IsOptional()
    @IsString({ message: 'Teaching credential basis descriptor must be a string' })
    teachingCredentialBasisDescriptor?: string;

    @ApiPropertyOptional({ description: 'The teaching credential descriptor', example: 'Initial' })
    @IsOptional()
    @IsString({ message: 'Teaching credential descriptor must be a string' })
    teachingCredentialDescriptor?: string;
} 