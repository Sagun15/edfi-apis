import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { AcademicSubjectDTO } from './academic-subject.dto';
import { CredentialEndorsementDTO } from './credential-endorsement.dto';
import { GradeLevelDTO } from './grade-level.dto';
import { Credential } from '../../../common/entities/credential.entity';

export class CredentialResponseDTO {
    @ApiProperty({ description: 'The unique identifier (UUID) for this record', example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsNotEmpty()
    @IsUUID('4')
    id: string;

    @ApiProperty({ description: 'The unique identifier for the credential', example: 'CRED123' })
    @IsNotEmpty()
    @IsString()
    credentialIdentifier: string;

    @ApiProperty({ description: 'The state that issued the credential', example: 'TX' })
    @IsNotEmpty()
    @IsString()
    stateOfIssueStateAbbreviationDescriptor: string;

    @ApiProperty({ description: 'The academic subjects associated with the credential', type: [AcademicSubjectDTO] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AcademicSubjectDTO)
    academicSubjects: AcademicSubjectDTO[];

    @ApiPropertyOptional({ description: 'The credential field descriptor', example: 'Elementary Education' })
    @IsOptional()
    @IsString()
    credentialFieldDescriptor?: string;

    @ApiProperty({ description: 'The type of credential', example: 'Teaching Certificate' })
    @IsNotEmpty()
    @IsString()
    credentialTypeDescriptor: string;

    @ApiPropertyOptional({ description: 'The date the credential becomes effective' })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    effectiveDate?: Date;

    @ApiProperty({ description: 'The endorsements associated with the credential', type: [CredentialEndorsementDTO] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CredentialEndorsementDTO)
    endorsements: CredentialEndorsementDTO[];

    @ApiPropertyOptional({ description: 'The date the credential expires' })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    expirationDate?: Date;

    @ApiProperty({ description: 'The grade levels associated with the credential', type: [GradeLevelDTO] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => GradeLevelDTO)
    gradeLevels: GradeLevelDTO[];

    @ApiProperty({ description: 'The date the credential was issued' })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    issuanceDate: Date;

    @ApiProperty({ description: 'The namespace for the credential', example: 'uri://ed-fi.org/Credential' })
    @IsNotEmpty()
    @IsString()
    namespace: string;

    @ApiPropertyOptional({ description: 'The basis for the teaching credential', example: 'Traditional' })
    @IsOptional()
    @IsString()
    teachingCredentialBasisDescriptor?: string;

    @ApiPropertyOptional({ description: 'The teaching credential descriptor', example: 'Initial' })
    @IsOptional()
    @IsString()
    teachingCredentialDescriptor?: string;

    @ApiProperty({ description: 'The ETag for the resource', example: '"2025-06-01T02:38:27.320Z"' })
    @IsNotEmpty()
    @IsString()
    _etag: string;

    @ApiProperty({ description: 'The date this resource was last modified', example: '2025-06-01T02:38:27.320Z' })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    _lastModifiedDate: Date;

    constructor(credential: Credential) {
        this.id = credential.id;
        this._etag = `"${credential.lastmodifieddate.toISOString()}"`;
        this._lastModifiedDate = credential.lastmodifieddate;

        // Primary fields
        this.credentialIdentifier = credential.credentialIdentifier;
        this.effectiveDate = credential.effectiveDate;
        this.expirationDate = credential.expirationDate;
        this.issuanceDate = credential.issuanceDate;
        this.namespace = credential.namespace;

        // Initialize arrays
        this.academicSubjects = [];
        this.endorsements = [];
        this.gradeLevels = [];
        
        this.credentialFieldDescriptor = credential.credentialFieldDescriptor?.credentialFieldDescriptorId.toString();
        this.credentialTypeDescriptor = credential.credentialTypeDescriptor.credentialTypeDescriptorId.toString();
        this.stateOfIssueStateAbbreviationDescriptor = credential.stateOfIssueStateAbbreviationDescriptor.stateAbbreviationDescriptorId.toString();
        this.teachingCredentialDescriptor = credential.teachingCredentialDescriptor?.teachingCredentialDescriptorId.toString();
        this.teachingCredentialBasisDescriptor = credential.teachingCredentialBasisDescriptor?.teachingCredentialBasisDescriptorId.toString();

        // Note: academicSubjects, endorsements, and gradeLevels would be mapped from their respective collections
        // These would typically come from separate repository methods or joined queries
        // For now they are initialized as empty arrays
    }
} 