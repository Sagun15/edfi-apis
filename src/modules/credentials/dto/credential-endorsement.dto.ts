import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CredentialEndorsementDTO {
    @ApiProperty({ description: 'The credential endorsement', example: 'Special Education' })
    @IsNotEmpty({ message: 'Credential endorsement is required' })
    @IsString({ message: 'Credential endorsement must be a string' })
    credentialEndorsement: string;
} 