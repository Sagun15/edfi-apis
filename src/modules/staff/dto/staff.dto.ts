import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Staff } from 'src/common/entities/staff.entity';
import { AddressDTO } from './nested/address.dto';
import { PersonReferenceDTO } from './nested/person-reference.dto';
import { CredentialReferenceDTO } from './nested/credential-reference.dto';
import { ElectronicMailDTO } from './nested/electronic-mail.dto';
import { IdentificationDocumentDTO } from './nested/identification-document.dto';
import { LanguageDTO } from './nested/language.dto';
import { OtherNameDTO } from './nested/other-name.dto';
import { RecognitionDTO } from './nested/recognition.dto';
import { TelephoneDTO } from './nested/telephone.dto';
import { AncestryEthnicOriginDTO } from './nested/ancestry-ethnic-origin.dto';
import { IdentificationCodeDTO } from './nested/identification-code.dto';
import { InternationalAddressDTO } from './nested/international-address.dto';
import { RaceDTO } from './nested/race.dto';
import { TribalAffiliationDTO } from './nested/tribal-affiliation.dto';
import { VisaDTO } from './nested/visa.dto';
import { PersonalIdentificationDocumentDTO } from './nested/personal-identification-document.dto';
import { UUID } from 'crypto';

export class StaffDTO {
    @ApiProperty({ description: 'Staff identifier', example: '123e4567-e89b-12d3-a456-426614174000' })
    id: UUID;

    @ApiProperty({ description: 'Staff unique ID', example: 'STAFF123' })
    staffUniqueId: string;

    @ApiProperty({ description: 'Person reference', type: PersonReferenceDTO })
    @Type(() => PersonReferenceDTO)
    personReference: PersonReferenceDTO;

    @ApiPropertyOptional({ description: 'Staff addresses', type: [AddressDTO] })
    @Type(() => AddressDTO)
    addresses?: AddressDTO[];

    @ApiPropertyOptional({ description: 'Ancestry ethnic origins', type: [AncestryEthnicOriginDTO] })
    @Type(() => AncestryEthnicOriginDTO)
    ancestryEthnicOrigins?: AncestryEthnicOriginDTO[];

    @ApiPropertyOptional({ description: 'Birth date', example: '2025-05-31' })
    birthDate?: string;

    @ApiPropertyOptional({ description: 'Citizenship status descriptor', example: 'US Citizen' })
    citizenshipStatusDescriptor?: string;

    @ApiPropertyOptional({ description: 'Staff credentials', type: [CredentialReferenceDTO] })
    @Type(() => CredentialReferenceDTO)
    credentials?: CredentialReferenceDTO[];

    @ApiPropertyOptional({ description: 'Electronic mail addresses', type: [ElectronicMailDTO] })
    @Type(() => ElectronicMailDTO)
    electronicMails?: ElectronicMailDTO[];

    @ApiProperty({ description: 'First name', example: 'John' })
    firstName: string;

    @ApiPropertyOptional({ description: 'Gender identity', example: 'Male' })
    genderIdentity?: string;

    @ApiPropertyOptional({ description: 'Generation code suffix', example: 'Jr.' })
    generationCodeSuffix?: string;

    @ApiPropertyOptional({ description: 'Highest completed level of education descriptor', example: 'Bachelor\'s Degree' })
    highestCompletedLevelOfEducationDescriptor?: string;

    @ApiPropertyOptional({ description: 'Highly qualified teacher', example: true })
    highlyQualifiedTeacher?: boolean;

    @ApiPropertyOptional({ description: 'Hispanic/Latino ethnicity', example: false })
    hispanicLatinoEthnicity?: boolean;

    @ApiPropertyOptional({ description: 'Identification codes', type: [IdentificationCodeDTO] })
    @Type(() => IdentificationCodeDTO)
    identificationCodes?: IdentificationCodeDTO[];

    @ApiPropertyOptional({ description: 'Identification documents', type: [IdentificationDocumentDTO] })
    @Type(() => IdentificationDocumentDTO)
    identificationDocuments?: IdentificationDocumentDTO[];

    @ApiPropertyOptional({ description: 'International addresses', type: [InternationalAddressDTO] })
    @Type(() => InternationalAddressDTO)
    internationalAddresses?: InternationalAddressDTO[];

    @ApiPropertyOptional({ description: 'Languages', type: [LanguageDTO] })
    @Type(() => LanguageDTO)
    languages?: LanguageDTO[];

    @ApiProperty({ description: 'Last surname', example: 'Smith' })
    lastSurname: string;

    @ApiPropertyOptional({ description: 'Login ID', example: 'jsmith' })
    loginId?: string;

    @ApiPropertyOptional({ description: 'Maiden name', example: 'Johnson' })
    maidenName?: string;

    @ApiPropertyOptional({ description: 'Middle name', example: 'Michael' })
    middleName?: string;

    @ApiPropertyOptional({ description: 'Other names', type: [OtherNameDTO] })
    @Type(() => OtherNameDTO)
    otherNames?: OtherNameDTO[];

    @ApiPropertyOptional({ description: 'Personal title prefix', example: 'Mr.' })
    personalTitlePrefix?: string;

    @ApiPropertyOptional({ description: 'Preferred first name', example: 'Johnny' })
    preferredFirstName?: string;

    @ApiPropertyOptional({ description: 'Preferred last surname', example: 'Smith-Jones' })
    preferredLastSurname?: string;

    @ApiPropertyOptional({ description: 'Races', type: [RaceDTO] })
    @Type(() => RaceDTO)
    races?: RaceDTO[];

    @ApiPropertyOptional({ description: 'Recognitions', type: [RecognitionDTO] })
    @Type(() => RecognitionDTO)
    recognitions?: RecognitionDTO[];

    @ApiPropertyOptional({ description: 'Sex descriptor', example: 'Male' })
    sexDescriptor?: string;

    @ApiPropertyOptional({ description: 'Telephone numbers', type: [TelephoneDTO] })
    @Type(() => TelephoneDTO)
    telephones?: TelephoneDTO[];

    @ApiPropertyOptional({ description: 'Tribal affiliations', type: [TribalAffiliationDTO] })
    @Type(() => TribalAffiliationDTO)
    tribalAffiliations?: TribalAffiliationDTO[];

    @ApiPropertyOptional({ description: 'Visas', type: [VisaDTO] })
    @Type(() => VisaDTO)
    visas?: VisaDTO[];

    @ApiPropertyOptional({ description: 'Years of prior professional experience', example: 5.5 })
    yearsOfPriorProfessionalExperience?: number;

    @ApiPropertyOptional({ description: 'Years of prior teaching experience', example: 3.5 })
    yearsOfPriorTeachingExperience?: number;

    @ApiPropertyOptional({ description: 'Personal identification documents', type: [PersonalIdentificationDocumentDTO] })
    @Type(() => PersonalIdentificationDocumentDTO)
    personalIdentificationDocuments?: PersonalIdentificationDocumentDTO[];

    @ApiProperty({ description: 'ETag for concurrency control', example: '"2025-05-29T07:53:44.000Z"' })
    _etag: string;

    @ApiProperty({ description: 'Last modified date', example: '2025-05-29T07:53:44.000Z' })
    _lastModifiedDate: string;

    constructor(staff: Staff) {
        this.id = staff.id;
        this.staffUniqueId = staff.staffUniqueId;
        this.firstName = staff.firstName;
        this.middleName = staff.middleName;
        this.lastSurname = staff.lastSurname;
        this.preferredFirstName = staff.preferredFirstName;
        this.preferredLastSurname = staff.preferredLastSurname;
        this.personalTitlePrefix = staff.personalTitlePrefix;
        this.generationCodeSuffix = staff.generationCodeSuffix;
        this.maidenName = staff.maidenName;
        this.birthDate = staff.birthDate ? new Date(staff.birthDate).toISOString().split('T')[0] : null;

        this.hispanicLatinoEthnicity = staff.hispanicLatinoEthnicity;
        this.citizenshipStatusDescriptor = staff.citizenshipStatusDescriptorId?.toString();
        this.highlyQualifiedTeacher = staff.highlyQualifiedTeacher;
        this.loginId = staff.loginId;
        this.yearsOfPriorProfessionalExperience = staff.yearsOfPriorProfessionalExperience;
        this.yearsOfPriorTeachingExperience = staff.yearsOfPriorTeachingExperience;

        // Initialize arrays as empty by default
        this.addresses = [];
        this.ancestryEthnicOrigins = [];
        this.credentials = [];
        this.electronicMails = [];
        this.identificationCodes = [];
        this.identificationDocuments = [];
        this.internationalAddresses = [];
        this.languages = [];
        this.otherNames = [];
        this.personalIdentificationDocuments = [];
        this.races = [];
        this.recognitions = [];
        this.telephones = [];
        this.tribalAffiliations = [];
        this.visas = [];

        // Generate Ed-Fi ETag and lastModifiedDate
        const lastModified = staff.lastmodifieddate || staff.createdate;
        this._etag = `"${lastModified.toISOString()}"`;
        this._lastModifiedDate = lastModified.toISOString();
    }
} 