import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { Student } from 'src/common/entities/student.entity';
import { PersonReferenceDTO } from './nested/person-reference.dto';
import { IdentificationDocumentDTO } from './nested/identification-document.dto';
import { OtherNameDTO } from './nested/other-name.dto';
import { VisaDTO } from './nested/visa.dto';

export class StudentDTO {
    @ApiProperty({ description: 'Primary identifier', example: 'uuid-1234' })
    id: string;

    @ApiProperty({ 
        description: 'A unique alphanumeric code assigned to a student.',
        example: 'STU123456'
    })
    studentUniqueId: string;

    @ApiProperty({ 
        description: 'The month, day, and year on which an individual was born.',
        example: '2010-05-15'
    })
    birthDate: string;

    @ApiProperty({ 
        description: 'A name given to an individual at birth, baptism, or during another naming ceremony, or through legal change.',
        example: 'John'
    })
    firstName: string;

    @ApiProperty({ 
        description: 'The name borne in common by members of a family.',
        example: 'Doe'
    })
    lastSurname: string;

    @ApiPropertyOptional({ 
        description: 'Person reference information',
        type: PersonReferenceDTO
    })
    @ValidateNested()
    @Type(() => PersonReferenceDTO)
    personReference?: PersonReferenceDTO;

    @ApiPropertyOptional({ 
        description: 'The city the student was born in.',
        example: 'New York'
    })
    birthCity?: string;

    @ApiPropertyOptional({ 
        description: 'The country in which an individual is born.',
        example: 'uri://ed-fi.org/CountryDescriptor#US'
    })
    birthCountryDescriptor?: string;

    @ApiPropertyOptional({ 
        description: 'For students born outside of the U.S., the Province or jurisdiction in which an individual is born.',
        example: 'Ontario'
    })
    birthInternationalProvince?: string;

    @ApiPropertyOptional({ 
        description: 'A person\'s sex at birth.',
        example: 'uri://ed-fi.org/SexDescriptor#Male'
    })
    birthSexDescriptor?: string;

    @ApiPropertyOptional({ 
        description: 'The abbreviation for the name of the state (within the United States) or extra-state jurisdiction in which an individual was born.',
        example: 'uri://ed-fi.org/StateAbbreviationDescriptor#NY'
    })
    birthStateAbbreviationDescriptor?: string;

    @ApiPropertyOptional({ 
        description: 'An indicator of whether or not the person is a U.S. citizen.',
        example: 'uri://ed-fi.org/CitizenshipStatusDescriptor#Citizen'
    })
    citizenshipStatusDescriptor?: string;

    @ApiPropertyOptional({ 
        description: 'For students born outside of the U.S., the date the student entered the U.S.',
        example: '2015-08-20'
    })
    dateEnteredUS?: string;

    @ApiPropertyOptional({ 
        description: 'An appendage, if any, used to denote an individual\'s generation in his family (e.g., Jr., Sr., III).',
        example: 'Jr.'
    })
    generationCodeSuffix?: string;

    @ApiPropertyOptional({ 
        description: 'The individual\'s maiden name.',
        example: 'Smith'
    })
    maidenName?: string;

    @ApiPropertyOptional({ 
        description: 'A secondary name given to an individual at birth, baptism, or during another naming ceremony.',
        example: 'Michael'
    })
    middleName?: string;

    @ApiPropertyOptional({ 
        description: 'Indicator of whether the student was born with other siblings (i.e., twins, triplets, etc.)',
        example: false
    })
    multipleBirthStatus?: boolean;

    @ApiPropertyOptional({ 
        description: 'A prefix used to denote the title, degree, position, or seniority of the individual.',
        example: 'Mr.'
    })
    personalTitlePrefix?: string;

    @ApiPropertyOptional({ 
        description: 'The first name the individual prefers, if different from their legal first name',
        example: 'Johnny'
    })
    preferredFirstName?: string;

    @ApiPropertyOptional({ 
        description: 'The last name the individual prefers, if different from their legal last name',
        example: 'Johnson'
    })
    preferredLastSurname?: string;

    @ApiPropertyOptional({ 
        description: 'An unordered collection of studentIdentificationDocuments. Describe the documentation of citizenship.',
        type: [IdentificationDocumentDTO]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => IdentificationDocumentDTO)
    identificationDocuments?: IdentificationDocumentDTO[];

    @ApiPropertyOptional({ 
        description: 'An unordered collection of studentOtherNames. Other names (e.g., alias, nickname, previous legal name) associated with a person.',
        type: [OtherNameDTO]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OtherNameDTO)
    otherNames?: OtherNameDTO[];

    @ApiPropertyOptional({ 
        description: 'An unordered collection of studentPersonalIdentificationDocuments. The documents presented as evident to verify one\'s personal identity; for example: drivers license, passport, birth certificate, etc.',
        type: [IdentificationDocumentDTO]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => IdentificationDocumentDTO)
    personalIdentificationDocuments?: IdentificationDocumentDTO[];

    @ApiPropertyOptional({ 
        description: 'An unordered collection of studentVisas. An indicator of a non-US citizen\'s Visa type.',
        type: [VisaDTO]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => VisaDTO)
    visas?: VisaDTO[];

    // Standard Ed-Fi fields
    @ApiProperty({ 
        description: 'ETag for concurrency control', 
        example: '"2025-05-29T07:53:44.000Z"' 
    })
    _etag: string;

    @ApiProperty({ 
        description: 'Last modified date', 
        example: '2025-05-29T07:53:44.000Z' 
    })
    _lastModifiedDate: string;

    constructor(student: Student) {
        this.id = student.id;
        this.studentUniqueId = student.studentUniqueId;
        this.birthDate = student.birthDate?.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        this.firstName = student.firstName;
        this.lastSurname = student.lastSurname;
        
        // Optional fields
        this.birthCity = student.birthCity;
        this.birthInternationalProvince = student.birthInternationalProvince;
        this.dateEnteredUS = student.dateEnteredUS?.toISOString().split('T')[0];
        this.generationCodeSuffix = student.generationCodeSuffix;
        this.maidenName = student.maidenName;
        this.middleName = student.middleName;
        this.multipleBirthStatus = student.multipleBirthStatus;
        this.personalTitlePrefix = student.personalTitlePrefix;
        this.preferredFirstName = student.preferredFirstName;
        this.preferredLastSurname = student.preferredLastSurname;

        // Handle person reference (populated by service layer if needed)
        if (student.personId && student.sourceSystemDescriptorId) {
            this.personReference = {
                personId: student.personId,
                sourceSystemDescriptor: student.sourceSystemDescriptorId.toString(), // Convert to string for descriptor
            };
        }

        // Handle descriptor relationships (populated by service layer after entity resolution)
        // These will be populated with actual descriptor values, not IDs
        this.birthCountryDescriptor = undefined; // Will be set by service layer
        this.birthSexDescriptor = undefined; // Will be set by service layer
        this.birthStateAbbreviationDescriptor = undefined; // Will be set by service layer
        this.citizenshipStatusDescriptor = undefined; // Will be set by service layer

        // Initialize arrays (will be populated by service layer)
        this.identificationDocuments = [];
        this.otherNames = [];
        this.personalIdentificationDocuments = [];
        this.visas = [];

        // Generate Ed-Fi ETag and lastModifiedDate
        const lastModified = student.lastmodifieddate || student.createdate;
        this._etag = `"${lastModified.toISOString()}"`;
        this._lastModifiedDate = lastModified.toISOString();
    }
} 