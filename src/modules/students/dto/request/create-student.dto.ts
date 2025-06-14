import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
    IsNotEmpty, 
    IsString, 
    MaxLength, 
    MinLength,
    IsOptional, 
    IsISO8601, 
    IsBoolean,
    IsArray,
    ValidateNested 
} from 'class-validator';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { PersonReferenceDTO } from '../nested/person-reference.dto';
import { IdentificationDocumentDTO } from '../nested/identification-document.dto';
import { OtherNameDTO } from '../nested/other-name.dto';
import { VisaDTO } from '../nested/visa.dto';

export class CreateStudentDTO {
    // Optional ID field that can be sent in requests
    @ApiPropertyOptional({ 
        description: 'Primary identifier - UUID that can be provided in request',
        example: 'uuid-1234-5678-9abc-def0'
    })
    @IsOptional()
    @IsString({ message: 'ID must be a string' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    id?: string;

    // Required fields from schema.required array
    @ApiProperty({ 
        description: 'A unique alphanumeric code assigned to a student.',
        maxLength: 32,
        example: 'STU123456'
    })
    @IsNotEmpty({ message: 'Student unique ID is required' })
    @IsString({ message: 'Student unique ID must be a string' })
    @MaxLength(32, { message: 'Student unique ID cannot exceed 32 characters' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    studentUniqueId: string;

    @ApiProperty({ 
        description: 'The month, day, and year on which an individual was born.',
        example: '2010-05-15'
    })
    @IsNotEmpty({ message: 'Birth date is required' })
    @IsISO8601({ strict: true }, { message: 'Birth date must be a valid ISO 8601 date' })
    @Transform(({ value }: TransformFnParams) => {
        if (!value) return value;
        const date = new Date(value);
        const now = new Date();
        if (date > now) {
            throw new Error('Birth date cannot be in the future');
        }
        return value;
    })
    birthDate: string;

    @ApiProperty({ 
        description: 'A name given to an individual at birth, baptism, or during another naming ceremony, or through legal change.',
        maxLength: 75,
        example: 'John'
    })
    @IsNotEmpty({ message: 'First name is required' })
    @IsString({ message: 'First name must be a string' })
    @MaxLength(75, { message: 'First name cannot exceed 75 characters' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    firstName: string;

    @ApiProperty({ 
        description: 'The name borne in common by members of a family.',
        maxLength: 75,
        example: 'Doe'
    })
    @IsNotEmpty({ message: 'Last surname is required' })
    @IsString({ message: 'Last surname must be a string' })
    @MaxLength(75, { message: 'Last surname cannot exceed 75 characters' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    lastSurname: string;

    // Optional fields with x-nullable: true or not in required array
    // NOTE: _etag and _lastModifiedDate are EXCLUDED from request DTOs as per Ed-Fi standards
    @ApiPropertyOptional({ 
        description: 'Person reference information',
        type: PersonReferenceDTO
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => PersonReferenceDTO)
    personReference?: PersonReferenceDTO;

    @ApiPropertyOptional({ 
        description: 'The city the student was born in.',
        maxLength: 30,
        minLength: 2,
        example: 'New York'
    })
    @IsOptional()
    @IsString({ message: 'Birth city must be a string' })
    @MinLength(2, { message: 'Birth city must be at least 2 characters long' })
    @MaxLength(30, { message: 'Birth city cannot exceed 30 characters' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    birthCity?: string;

    @ApiPropertyOptional({ 
        description: 'The country in which an individual is born. It is strongly recommended that entries use only ISO 3166 2-letter country codes.',
        maxLength: 306,
        example: 'uri://ed-fi.org/CountryDescriptor#US'
    })
    @IsOptional()
    @IsString({ message: 'Birth country descriptor must be a string' })
    @MaxLength(306, { message: 'Birth country descriptor cannot exceed 306 characters' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    birthCountryDescriptor?: string;

    @ApiPropertyOptional({ 
        description: 'For students born outside of the U.S., the Province or jurisdiction in which an individual is born.',
        maxLength: 150,
        example: 'Ontario'
    })
    @IsOptional()
    @IsString({ message: 'Birth international province must be a string' })
    @MaxLength(150, { message: 'Birth international province cannot exceed 150 characters' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    birthInternationalProvince?: string;

    @ApiPropertyOptional({ 
        description: 'A person\'s sex at birth.',
        maxLength: 306,
        example: 'uri://ed-fi.org/SexDescriptor#Male'
    })
    @IsOptional()
    @IsString({ message: 'Birth sex descriptor must be a string' })
    @MaxLength(306, { message: 'Birth sex descriptor cannot exceed 306 characters' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    birthSexDescriptor?: string;

    @ApiPropertyOptional({ 
        description: 'The abbreviation for the name of the state (within the United States) or extra-state jurisdiction in which an individual was born.',
        maxLength: 306,
        example: 'uri://ed-fi.org/StateAbbreviationDescriptor#NY'
    })
    @IsOptional()
    @IsString({ message: 'Birth state abbreviation descriptor must be a string' })
    @MaxLength(306, { message: 'Birth state abbreviation descriptor cannot exceed 306 characters' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    birthStateAbbreviationDescriptor?: string;

    @ApiPropertyOptional({ 
        description: 'An indicator of whether or not the person is a U.S. citizen.',
        maxLength: 306,
        example: 'uri://ed-fi.org/CitizenshipStatusDescriptor#Citizen'
    })
    @IsOptional()
    @IsString({ message: 'Citizenship status descriptor must be a string' })
    @MaxLength(306, { message: 'Citizenship status descriptor cannot exceed 306 characters' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    citizenshipStatusDescriptor?: string;

    @ApiPropertyOptional({ 
        description: 'For students born outside of the U.S., the date the student entered the U.S.',
        example: '2015-08-20'
    })
    @IsOptional()
    @IsISO8601({ strict: true }, { message: 'Date entered US must be a valid ISO 8601 date' })
    @Transform(({ value }: TransformFnParams) => {
        if (!value) return value;
        const date = new Date(value);
        const now = new Date();
        if (date > now) {
            throw new Error('Date entered US cannot be in the future');
        }
        return value;
    })
    dateEnteredUS?: string;

    @ApiPropertyOptional({ 
        description: 'An appendage, if any, used to denote an individual\'s generation in his family (e.g., Jr., Sr., III).',
        maxLength: 10,
        example: 'Jr.'
    })
    @IsOptional()
    @IsString({ message: 'Generation code suffix must be a string' })
    @MaxLength(10, { message: 'Generation code suffix cannot exceed 10 characters' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    generationCodeSuffix?: string;

    @ApiPropertyOptional({ 
        description: 'The individual\'s maiden name.',
        maxLength: 75,
        example: 'Smith'
    })
    @IsOptional()
    @IsString({ message: 'Maiden name must be a string' })
    @MaxLength(75, { message: 'Maiden name cannot exceed 75 characters' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    maidenName?: string;

    @ApiPropertyOptional({ 
        description: 'A secondary name given to an individual at birth, baptism, or during another naming ceremony.',
        maxLength: 75,
        example: 'Michael'
    })
    @IsOptional()
    @IsString({ message: 'Middle name must be a string' })
    @MaxLength(75, { message: 'Middle name cannot exceed 75 characters' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    middleName?: string;

    @ApiPropertyOptional({ 
        description: 'Indicator of whether the student was born with other siblings (i.e., twins, triplets, etc.)',
        example: false
    })
    @IsOptional()
    @IsBoolean({ message: 'Multiple birth status must be a boolean' })
    multipleBirthStatus?: boolean;

    @ApiPropertyOptional({ 
        description: 'A prefix used to denote the title, degree, position, or seniority of the individual.',
        maxLength: 30,
        example: 'Mr.'
    })
    @IsOptional()
    @IsString({ message: 'Personal title prefix must be a string' })
    @MaxLength(30, { message: 'Personal title prefix cannot exceed 30 characters' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    personalTitlePrefix?: string;

    @ApiPropertyOptional({ 
        description: 'The first name the individual prefers, if different from their legal first name',
        maxLength: 75,
        example: 'Johnny'
    })
    @IsOptional()
    @IsString({ message: 'Preferred first name must be a string' })
    @MaxLength(75, { message: 'Preferred first name cannot exceed 75 characters' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    preferredFirstName?: string;

    @ApiPropertyOptional({ 
        description: 'The last name the individual prefers, if different from their legal last name',
        maxLength: 75,
        example: 'Johnson'
    })
    @IsOptional()
    @IsString({ message: 'Preferred last surname must be a string' })
    @MaxLength(75, { message: 'Preferred last surname cannot exceed 75 characters' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    preferredLastSurname?: string;

    // Array fields with nested validation
    @ApiPropertyOptional({ 
        description: 'An unordered collection of studentIdentificationDocuments. Describe the documentation of citizenship.',
        type: [IdentificationDocumentDTO]
    })
    @IsOptional()
    @IsArray({ message: 'Identification documents must be an array' })
    @ValidateNested({ each: true })
    @Type(() => IdentificationDocumentDTO)
    identificationDocuments?: IdentificationDocumentDTO[];

    @ApiPropertyOptional({ 
        description: 'An unordered collection of studentOtherNames. Other names (e.g., alias, nickname, previous legal name) associated with a person.',
        type: [OtherNameDTO]
    })
    @IsOptional()
    @IsArray({ message: 'Other names must be an array' })
    @ValidateNested({ each: true })
    @Type(() => OtherNameDTO)
    otherNames?: OtherNameDTO[];

    @ApiPropertyOptional({ 
        description: 'An unordered collection of studentPersonalIdentificationDocuments. The documents presented as evident to verify one\'s personal identity; for example: drivers license, passport, birth certificate, etc.',
        type: [IdentificationDocumentDTO]
    })
    @IsOptional()
    @IsArray({ message: 'Personal identification documents must be an array' })
    @ValidateNested({ each: true })
    @Type(() => IdentificationDocumentDTO)
    personalIdentificationDocuments?: IdentificationDocumentDTO[];

    @ApiPropertyOptional({ 
        description: 'An unordered collection of studentVisas. An indicator of a non-US citizen\'s Visa type.',
        type: [VisaDTO]
    })
    @IsOptional()
    @IsArray({ message: 'Visas must be an array' })
    @ValidateNested({ each: true })
    @Type(() => VisaDTO)
    visas?: VisaDTO[];
} 