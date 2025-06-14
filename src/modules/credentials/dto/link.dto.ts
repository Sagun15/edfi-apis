import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class LinkDTO {
    @ApiProperty({ description: 'The relationship type', example: 'related' })
    @IsNotEmpty({ message: 'Relationship type is required' })
    @IsString({ message: 'Relationship type must be a string' })
    rel: string;

    @ApiProperty({ description: 'The hyperlink reference', example: 'https://api.ed-fi.org/v7.1/credentials/123' })
    @IsNotEmpty({ message: 'Href is required' })
    @IsString({ message: 'Href must be a string' })
    @IsUrl({}, { message: 'Href must be a valid URL' })
    href: string;
} 