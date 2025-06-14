import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { LinkDTO } from './link.dto';

export class CredentialReferenceDTO {
    @ApiProperty({ description: 'The identifier for the credential', example: 'CRED123' })
    @IsString({ message: 'Credential identifier must be a string' })
    @IsNotEmpty({ message: 'Credential identifier is required' })
    credentialIdentifier: string;

    @ApiProperty({ description: 'The state abbreviation where credential was issued', example: 'TX' })
    @IsString({ message: 'State abbreviation must be a string' })
    @IsNotEmpty({ message: 'State abbreviation is required' })
    stateOfIssueStateAbbreviationDescriptor: string;

    @ApiProperty({ description: 'The link to the credential resource', type: LinkDTO })
    @ValidateNested({ message: 'Link must be a valid link object' })
    @Type(() => LinkDTO)
    @IsNotEmpty({ message: 'Link is required' })
    link: LinkDTO;
} 