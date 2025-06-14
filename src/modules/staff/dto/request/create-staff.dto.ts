import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Matches, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { AddressDTO } from '../nested/address.dto';
import { PersonReferenceDTO } from '../nested/person-reference.dto';
import { CredentialReferenceDTO } from '../nested/credential-reference.dto';
import { ElectronicMailDTO } from '../nested/electronic-mail.dto';
import { IdentificationDocumentDTO } from '../nested/identification-document.dto';
import { LanguageDTO } from '../nested/language.dto';
import { OtherNameDTO } from '../nested/other-name.dto';
import { RecognitionDTO } from '../nested/recognition.dto';
import { TelephoneDTO } from '../nested/telephone.dto';
import { AncestryEthnicOriginDTO } from '../nested/ancestry-ethnic-origin.dto';
import { IdentificationCodeDTO } from '../nested/identification-code.dto';
import { InternationalAddressDTO } from '../nested/international-address.dto';
import { RaceDTO } from '../nested/race.dto';
import { TribalAffiliationDTO } from '../nested/tribal-affiliation.dto';
import { VisaDTO } from '../nested/visa.dto';
import { PersonalIdentificationDocumentDTO } from '../nested/personal-identification-document.dto';
import { UUID } from 'crypto';

export class CreateStaffDTO {
    @ApiProperty({ description: 'Staff unique identifier (UUID)', example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsNotEmpty({ message: 'ID is required' })
    @IsUUID('4', { message: 'ID must be a valid UUID v4' })
    id: UUID;

    @ApiProperty({ description: 'Staff unique ID', example: 'STAFF123' })
    @IsString({ message: 'Staff unique ID must be a string' })
    @IsNotEmpty({ message: 'Staff unique ID is required' })
    @MinLength(8, { message: 'Staff unique ID must be at least 8 characters long' })
    @MaxLength(32, { message: 'Staff unique ID cannot exceed 32 characters' })
    @Matches(/^[A-Z0-9]+$/, { message: 'Staff unique ID can only contain uppercase letters and numbers' })
    staffUniqueId: string;

    @ApiProperty({ description: 'Person reference', type: PersonReferenceDTO })
    @ValidateNested()
    @Type(() => PersonReferenceDTO)
    personReference: PersonReferenceDTO;

    @ApiPropertyOptional({ description: 'Staff addresses', type: [AddressDTO] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AddressDTO)
    addresses?: AddressDTO[];

    @ApiPropertyOptional({ description: 'Ancestry ethnic origins', type: [AncestryEthnicOriginDTO] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AncestryEthnicOriginDTO)
    ancestryEthnicOrigins?: AncestryEthnicOriginDTO[];

    @ApiPropertyOptional({ description: 'Birth date', example: '2025-05-31' })
    @IsOptional()
    @IsDateString({}, { message: 'Birth date must be a valid date' })
    birthDate?: string;

    @ApiPropertyOptional({ description: 'Citizenship status descriptor', example: 'US Citizen' })
    @IsOptional()
    @IsString()
    citizenshipStatusDescriptor?: string;

    @ApiPropertyOptional({ description: 'Staff credentials', type: [CredentialReferenceDTO] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CredentialReferenceDTO)
    credentials?: CredentialReferenceDTO[];

    @ApiPropertyOptional({ description: 'Electronic mail addresses', type: [ElectronicMailDTO] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ElectronicMailDTO)
    electronicMails?: ElectronicMailDTO[];

    @ApiProperty({ description: 'First name', example: 'John' })
    @IsString({ message: 'First name must be a string' })
    @IsNotEmpty({ message: 'First name is required' })
    @MinLength(2, { message: 'First name must be at least 2 characters long' })
    @MaxLength(75, { message: 'First name cannot exceed 75 characters' })
    @Matches(/^[A-Za-z\s\-']+$/, { message: 'First name can only contain letters, spaces, hyphens, and apostrophes' })
    firstName: string;

    @ApiPropertyOptional({ description: 'Gender identity', example: 'Male' })
    @IsOptional()
    @IsString()
    genderIdentity?: string;

    @ApiPropertyOptional({ description: 'Generation code suffix', example: 'Jr.' })
    @IsOptional()
    @IsString()
    @MaxLength(10, { message: 'Generation code suffix cannot exceed 10 characters' })
    generationCodeSuffix?: string;

    @ApiPropertyOptional({ description: 'Highest completed level of education descriptor', example: 'Bachelor\'s Degree' })
    @IsOptional()
    @IsString()
    highestCompletedLevelOfEducationDescriptor?: string;

    @ApiPropertyOptional({ description: 'Highly qualified teacher', example: true })
    @IsOptional()
    @IsBoolean()
    highlyQualifiedTeacher?: boolean;

    @ApiPropertyOptional({ description: 'Hispanic/Latino ethnicity', example: false })
    @IsOptional()
    @IsBoolean()
    hispanicLatinoEthnicity?: boolean;

    @ApiPropertyOptional({ description: 'Identification codes', type: [IdentificationCodeDTO] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => IdentificationCodeDTO)
    identificationCodes?: IdentificationCodeDTO[];

    @ApiPropertyOptional({ description: 'Identification documents', type: [IdentificationDocumentDTO] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => IdentificationDocumentDTO)
    identificationDocuments?: IdentificationDocumentDTO[];

    @ApiPropertyOptional({ description: 'International addresses', type: [InternationalAddressDTO] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => InternationalAddressDTO)
    internationalAddresses?: InternationalAddressDTO[];

    @ApiPropertyOptional({ description: 'Languages', type: [LanguageDTO] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => LanguageDTO)
    languages?: LanguageDTO[];

    @ApiProperty({ description: 'Last surname', example: 'Smith' })
    @IsString({ message: 'Last surname must be a string' })
    @IsNotEmpty({ message: 'Last surname is required' })
    @MinLength(2, { message: 'Last surname must be at least 2 characters long' })
    @MaxLength(75, { message: 'Last surname cannot exceed 75 characters' })
    @Matches(/^[A-Za-z\s\-']+$/, { message: 'Last surname can only contain letters, spaces, hyphens, and apostrophes' })
    lastSurname: string;

    @ApiPropertyOptional({ description: 'Login ID', example: 'jsmith' })
    @IsOptional()
    @IsString()
    @MaxLength(60, { message: 'Login ID cannot exceed 60 characters' })
    loginId?: string;

    @ApiPropertyOptional({ description: 'Maiden name', example: 'Johnson' })
    @IsOptional()
    @IsString()
    @MaxLength(75, { message: 'Maiden name cannot exceed 75 characters' })
    @Matches(/^[A-Za-z\s\-']+$/, { message: 'Maiden name can only contain letters, spaces, hyphens, and apostrophes' })
    maidenName?: string;

    @ApiPropertyOptional({ description: 'Middle name', example: 'Michael' })
    @IsOptional()
    @IsString()
    @MaxLength(75, { message: 'Middle name cannot exceed 75 characters' })
    @Matches(/^[A-Za-z\s\-']+$/, { message: 'Middle name can only contain letters, spaces, hyphens, and apostrophes' })
    middleName?: string;

    @ApiPropertyOptional({ description: 'Other names', type: [OtherNameDTO] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OtherNameDTO)
    otherNames?: OtherNameDTO[];

    @ApiPropertyOptional({ description: 'Personal title prefix', example: 'Mr.' })
    @IsOptional()
    @IsString()
    @MaxLength(30, { message: 'Personal title prefix cannot exceed 30 characters' })
    personalTitlePrefix?: string;

    @ApiPropertyOptional({ description: 'Preferred first name', example: 'Johnny' })
    @IsOptional()
    @IsString()
    @MaxLength(75, { message: 'Preferred first name cannot exceed 75 characters' })
    @Matches(/^[A-Za-z\s\-']+$/, { message: 'Preferred first name can only contain letters, spaces, hyphens, and apostrophes' })
    preferredFirstName?: string;

    @ApiPropertyOptional({ description: 'Preferred last surname', example: 'Smith-Jones' })
    @IsOptional()
    @IsString()
    @MaxLength(75, { message: 'Preferred last surname cannot exceed 75 characters' })
    @Matches(/^[A-Za-z\s\-']+$/, { message: 'Preferred last surname can only contain letters, spaces, hyphens, and apostrophes' })
    preferredLastSurname?: string;

    @ApiPropertyOptional({ description: 'Races', type: [RaceDTO] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RaceDTO)
    races?: RaceDTO[];

    @ApiPropertyOptional({ description: 'Recognitions', type: [RecognitionDTO] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RecognitionDTO)
    recognitions?: RecognitionDTO[];

    @ApiPropertyOptional({ description: 'Sex descriptor', example: 'Male' })
    @IsOptional()
    @IsString()
    sexDescriptor?: string;

    @ApiPropertyOptional({ description: 'Telephone numbers', type: [TelephoneDTO] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TelephoneDTO)
    telephones?: TelephoneDTO[];

    @ApiPropertyOptional({ description: 'Tribal affiliations', type: [TribalAffiliationDTO] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TribalAffiliationDTO)
    tribalAffiliations?: TribalAffiliationDTO[];

    @ApiPropertyOptional({ description: 'Visas', type: [VisaDTO] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => VisaDTO)
    visas?: VisaDTO[];

    @ApiPropertyOptional({ description: 'Years of prior professional experience', example: 5.5 })
    @IsOptional()
    @IsNumber({}, { message: 'Years of prior professional experience must be a number' })
    yearsOfPriorProfessionalExperience?: number;

    @ApiPropertyOptional({ description: 'Years of prior teaching experience', example: 3.5 })
    @IsOptional()
    @IsNumber({}, { message: 'Years of prior teaching experience must be a number' })
    yearsOfPriorTeachingExperience?: number;

    @ApiPropertyOptional({ description: 'Personal identification documents', type: [PersonalIdentificationDocumentDTO] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PersonalIdentificationDocumentDTO)
    personalIdentificationDocuments?: PersonalIdentificationDocumentDTO[];

    @ApiPropertyOptional({ description: 'Old ethnicity descriptor identifier', example: '1' })
    @IsOptional()
    @IsString({ message: 'Old ethnicity descriptor must be a string' })
    oldEthnicityDescriptor?: string;
} 