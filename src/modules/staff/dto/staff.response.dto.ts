import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'crypto';
import { Staff } from 'src/common/entities/staff.entity';

class LinkDTO {
    @ApiProperty({ description: 'Relation type' })
    rel: string;

    @ApiProperty({ description: 'Link URL' })
    href: string;
}

class PersonReferenceDTO {
    @ApiProperty({ description: 'Person identifier' })
    personId: string;

    @ApiProperty({ description: 'Source system descriptor' })
    sourceSystemDescriptor: string;

    @ApiProperty({ description: 'Navigation links' })
    link: LinkDTO;
}

class AddressPeriodDTO {
    @ApiProperty({ description: 'Begin date', type: Date })
    beginDate: Date;

    @ApiProperty({ description: 'End date', type: Date })
    endDate: Date;
}

class AddressDTO {
    @ApiProperty({ description: 'Address type descriptor' })
    addressTypeDescriptor: string;

    @ApiProperty({ description: 'State abbreviation descriptor' })
    stateAbbreviationDescriptor: string;

    @ApiProperty({ description: 'City name' })
    city: string;

    @ApiProperty({ description: 'Postal code' })
    postalCode: string;

    @ApiProperty({ description: 'Street number and name' })
    streetNumberName: string;

    @ApiProperty({ description: 'Locale descriptor', required: false })
    localeDescriptor?: string;

    @ApiProperty({ description: 'Apartment, room, or suite number', required: false })
    apartmentRoomSuiteNumber?: string;

    @ApiProperty({ description: 'Building site number', required: false })
    buildingSiteNumber?: string;

    @ApiProperty({ description: 'Congressional district', required: false })
    congressionalDistrict?: string;

    @ApiProperty({ description: 'County FIPS code', required: false })
    countyFIPSCode?: string;

    @ApiProperty({ description: 'Do not publish indicator', required: false })
    doNotPublishIndicator?: boolean;

    @ApiProperty({ description: 'Latitude', required: false })
    latitude?: string;

    @ApiProperty({ description: 'Longitude', required: false })
    longitude?: string;

    @ApiProperty({ description: 'Name of county', required: false })
    nameOfCounty?: string;

    @ApiProperty({ description: 'Address periods', type: [AddressPeriodDTO], required: false })
    periods?: AddressPeriodDTO[];
}

class AncestryEthnicOriginDTO {
    @ApiProperty({ description: 'Ancestry ethnic origin descriptor' })
    ancestryEthnicOriginDescriptor: string;
}

class CredentialReferenceDTO {
    @ApiProperty({ description: 'Credential identifier' })
    credentialIdentifier: string;

    @ApiProperty({ description: 'State of issue abbreviation descriptor' })
    stateOfIssueStateAbbreviationDescriptor: string;

    @ApiProperty({ description: 'Navigation links' })
    link: LinkDTO;
}

class CredentialDTO {
    @ApiProperty({ description: 'Credential reference' })
    credentialReference: CredentialReferenceDTO;
}

class ElectronicMailDTO {
    @ApiProperty({ description: 'Electronic mail type descriptor' })
    electronicMailTypeDescriptor: string;

    @ApiProperty({ description: 'Electronic mail address' })
    electronicMailAddress: string;

    @ApiProperty({ description: 'Do not publish indicator', required: false })
    doNotPublishIndicator?: boolean;

    @ApiProperty({ description: 'Primary email address indicator', required: false })
    primaryEmailAddressIndicator?: boolean;
}

class IdentificationCodeDTO {
    @ApiProperty({ description: 'Staff identification system descriptor' })
    staffIdentificationSystemDescriptor: string;

    @ApiProperty({ description: 'Assigning organization identification code' })
    assigningOrganizationIdentificationCode: string;

    @ApiProperty({ description: 'Identification code' })
    identificationCode: string;
}

class IdentificationDocumentDTO {
    @ApiProperty({ description: 'Identification document use descriptor' })
    identificationDocumentUseDescriptor: string;

    @ApiProperty({ description: 'Personal information verification descriptor' })
    personalInformationVerificationDescriptor: string;

    @ApiProperty({ description: 'Issuer country descriptor' })
    issuerCountryDescriptor: string;

    @ApiProperty({ description: 'Document expiration date', type: Date })
    documentExpirationDate: Date;

    @ApiProperty({ description: 'Document title' })
    documentTitle: string;

    @ApiProperty({ description: 'Issuer document identification code' })
    issuerDocumentIdentificationCode: string;

    @ApiProperty({ description: 'Issuer name' })
    issuerName: string;
}

class InternationalAddressDTO {
    @ApiProperty({ description: 'Address type descriptor' })
    addressTypeDescriptor: string;

    @ApiProperty({ description: 'Country descriptor' })
    countryDescriptor: string;

    @ApiProperty({ description: 'Address line 1' })
    addressLine1: string;

    @ApiProperty({ description: 'Address line 2', required: false })
    addressLine2?: string;

    @ApiProperty({ description: 'Address line 3', required: false })
    addressLine3?: string;

    @ApiProperty({ description: 'Address line 4', required: false })
    addressLine4?: string;

    @ApiProperty({ description: 'Begin date', type: Date })
    beginDate: Date;

    @ApiProperty({ description: 'End date', type: Date, required: false })
    endDate?: Date;

    @ApiProperty({ description: 'Latitude', required: false })
    latitude?: string;

    @ApiProperty({ description: 'Longitude', required: false })
    longitude?: string;
}

class LanguageUseDTO {
    @ApiProperty({ description: 'Language use descriptor' })
    languageUseDescriptor: string;
}

class LanguageDTO {
    @ApiProperty({ description: 'Language descriptor' })
    languageDescriptor: string;

    @ApiProperty({ description: 'Language uses', type: [LanguageUseDTO] })
    uses: LanguageUseDTO[];
}

class OtherNameDTO {
    @ApiProperty({ description: 'Other name type descriptor' })
    otherNameTypeDescriptor: string;

    @ApiProperty({ description: 'First name', required: false })
    firstName?: string;

    @ApiProperty({ description: 'Generation code suffix', required: false })
    generationCodeSuffix?: string;

    @ApiProperty({ description: 'Last surname', required: false })
    lastSurname?: string;

    @ApiProperty({ description: 'Middle name', required: false })
    middleName?: string;

    @ApiProperty({ description: 'Personal title prefix', required: false })
    personalTitlePrefix?: string;
}

class RaceDTO {
    @ApiProperty({ description: 'Race descriptor' })
    raceDescriptor: string;
}

class RecognitionDTO {
    @ApiProperty({ description: 'Recognition type descriptor' })
    recognitionTypeDescriptor: string;

    @ApiProperty({ description: 'Achievement category descriptor', required: false })
    achievementCategoryDescriptor?: string;

    @ApiProperty({ description: 'Achievement category system', required: false })
    achievementCategorySystem?: string;

    @ApiProperty({ description: 'Achievement title', required: false })
    achievementTitle?: string;

    @ApiProperty({ description: 'Criteria', required: false })
    criteria?: string;

    @ApiProperty({ description: 'Criteria URL', required: false })
    criteriaURL?: string;

    @ApiProperty({ description: 'Evidence statement', required: false })
    evidenceStatement?: string;

    @ApiProperty({ description: 'Image URL', required: false })
    imageURL?: string;

    @ApiProperty({ description: 'Issuer name', required: false })
    issuerName?: string;

    @ApiProperty({ description: 'Issuer origin URL', required: false })
    issuerOriginURL?: string;

    @ApiProperty({ description: 'Recognition award date', type: Date, required: false })
    recognitionAwardDate?: Date;

    @ApiProperty({ description: 'Recognition award expires date', type: Date, required: false })
    recognitionAwardExpiresDate?: Date;

    @ApiProperty({ description: 'Recognition description', required: false })
    recognitionDescription?: string;
}

class TelephoneDTO {
    @ApiProperty({ description: 'Telephone number type descriptor' })
    telephoneNumberTypeDescriptor: string;

    @ApiProperty({ description: 'Telephone number' })
    telephoneNumber: string;

    @ApiProperty({ description: 'Do not publish indicator', required: false })
    doNotPublishIndicator?: boolean;

    @ApiProperty({ description: 'Order of priority', required: false })
    orderOfPriority?: number;

    @ApiProperty({ description: 'Text message capability indicator', required: false })
    textMessageCapabilityIndicator?: boolean;
}

class TribalAffiliationDTO {
    @ApiProperty({ description: 'Tribal affiliation descriptor' })
    tribalAffiliationDescriptor: string;
}

class VisaDTO {
    @ApiProperty({ description: 'Visa descriptor' })
    visaDescriptor: string;
}

export class StaffResponseDTO {
    @ApiProperty({ description: 'The unique identifier for the staff member' })
    id: string;

    @ApiProperty({ description: 'Staff unique identifier' })
    staffUniqueId: string;

    @ApiProperty({ description: 'Person reference information' })
    personReference: PersonReferenceDTO;

    @ApiProperty({ description: 'List of addresses', type: [AddressDTO], required: false })
    addresses?: AddressDTO[];

    @ApiProperty({ description: 'List of ancestry ethnic origins', type: [AncestryEthnicOriginDTO], required: false })
    ancestryEthnicOrigins?: AncestryEthnicOriginDTO[];

    @ApiProperty({ description: 'Birth date', type: Date, required: false })
    birthDate?: Date;

    @ApiProperty({ description: 'Citizenship status descriptor' })
    citizenshipStatusDescriptor: string;

    @ApiProperty({ description: 'List of credentials', type: [CredentialDTO], required: false })
    credentials?: CredentialDTO[];

    @ApiProperty({ description: 'List of electronic mails', type: [ElectronicMailDTO], required: false })
    electronicMails?: ElectronicMailDTO[];

    @ApiProperty({ description: 'First name' })
    firstName: string;

    @ApiProperty({ description: 'Gender identity', required: false })
    genderIdentity?: string;

    @ApiProperty({ description: 'Generation code suffix', required: false })
    generationCodeSuffix?: string;

    @ApiProperty({ description: 'Highest completed level of education descriptor' })
    highestCompletedLevelOfEducationDescriptor: string;

    @ApiProperty({ description: 'Highly qualified teacher indicator', required: false })
    highlyQualifiedTeacher?: boolean;

    @ApiProperty({ description: 'Hispanic/Latino ethnicity indicator', required: false })
    hispanicLatinoEthnicity?: boolean;

    @ApiProperty({ description: 'List of identification codes', type: [IdentificationCodeDTO], required: false })
    identificationCodes?: IdentificationCodeDTO[];

    @ApiProperty({ description: 'List of identification documents', type: [IdentificationDocumentDTO], required: false })
    identificationDocuments?: IdentificationDocumentDTO[];

    @ApiProperty({ description: 'List of international addresses', type: [InternationalAddressDTO], required: false })
    internationalAddresses?: InternationalAddressDTO[];

    @ApiProperty({ description: 'List of languages', type: [LanguageDTO], required: false })
    languages?: LanguageDTO[];

    @ApiProperty({ description: 'Last surname' })
    lastSurname: string;

    @ApiProperty({ description: 'Login ID', required: false })
    loginId?: string;

    @ApiProperty({ description: 'Maiden name', required: false })
    maidenName?: string;

    @ApiProperty({ description: 'Middle name', required: false })
    middleName?: string;

    @ApiProperty({ description: 'List of other names', type: [OtherNameDTO], required: false })
    otherNames?: OtherNameDTO[];

    @ApiProperty({ description: 'List of personal identification documents', type: [IdentificationDocumentDTO], required: false })
    personalIdentificationDocuments?: IdentificationDocumentDTO[];

    @ApiProperty({ description: 'Personal title prefix', required: false })
    personalTitlePrefix?: string;

    @ApiProperty({ description: 'Preferred first name', required: false })
    preferredFirstName?: string;

    @ApiProperty({ description: 'Preferred last surname', required: false })
    preferredLastSurname?: string;

    @ApiProperty({ description: 'List of races', type: [RaceDTO], required: false })
    races?: RaceDTO[];

    @ApiProperty({ description: 'List of recognitions', type: [RecognitionDTO], required: false })
    recognitions?: RecognitionDTO[];

    @ApiProperty({ description: 'Sex descriptor' })
    sexDescriptor: string;

    @ApiProperty({ description: 'List of telephones', type: [TelephoneDTO], required: false })
    telephones?: TelephoneDTO[];

    @ApiProperty({ description: 'List of tribal affiliations', type: [TribalAffiliationDTO], required: false })
    tribalAffiliations?: TribalAffiliationDTO[];

    @ApiProperty({ description: 'List of visas', type: [VisaDTO], required: false })
    visas?: VisaDTO[];

    @ApiProperty({ description: 'Years of prior professional experience', type: Number, required: false })
    yearsOfPriorProfessionalExperience?: number;

    @ApiProperty({ description: 'Years of prior teaching experience', type: Number, required: false })
    yearsOfPriorTeachingExperience?: number;

    @ApiProperty({ description: 'ETag for concurrency control' })
    _etag: string;

    @ApiProperty({ description: 'Last modified date' })
    _lastModifiedDate: string;

    constructor(staff: Staff) {
        this.id = staff.id;
        this.staffUniqueId = staff.staffUniqueId;
        
        // Person reference
        this.personReference = {
            personId: staff.personId,
            sourceSystemDescriptor: staff.sourceSystemDescriptorId?.toString(),
            link: {
                rel: 'Person',
                href: `/ed-fi/people/${staff.personId}`
            }
        };

        // Basic information
        this.personalTitlePrefix = staff.personalTitlePrefix;
        this.firstName = staff.firstName;
        this.middleName = staff.middleName;
        this.lastSurname = staff.lastSurname;
        this.preferredFirstName = staff.preferredFirstName;
        this.preferredLastSurname = staff.preferredLastSurname;
        this.generationCodeSuffix = staff.generationCodeSuffix;
        this.maidenName = staff.maidenName;
        
        // Map descriptor information
        if (staff.sexDescriptor) {
            this.sexDescriptor = staff.sexDescriptor.codeValue;
        }

        this.birthDate = staff.birthDate;
        this.hispanicLatinoEthnicity = staff.hispanicLatinoEthnicity;

        if (staff.citizenshipStatusDescriptor) {
            this.citizenshipStatusDescriptor = staff.citizenshipStatusDescriptor.codeValue;
        }

        if (staff.highestCompletedLevelOfEducationDescriptor) {
            this.highestCompletedLevelOfEducationDescriptor = staff.highestCompletedLevelOfEducationDescriptor.codeValue;
        }

        this.yearsOfPriorProfessionalExperience = staff.yearsOfPriorProfessionalExperience;
        this.yearsOfPriorTeachingExperience = staff.yearsOfPriorTeachingExperience;
        this.loginId = staff.loginId;
        this.highlyQualifiedTeacher = staff.highlyQualifiedTeacher;

        // Note: Collection properties (addresses, electronicMails, etc.) are not mapped
        // because they are not yet defined in the Staff entity
        // These will need to be added when the entity is updated with these relationships

        // Set ETag and last modified date
        const lastModified = staff.lastmodifieddate || staff.createdate;
        this._etag = `"${lastModified.toISOString()}"`;
        this._lastModifiedDate = lastModified.toISOString();
    }
} 