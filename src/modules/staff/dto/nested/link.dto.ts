import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class LinkDTO {
    @ApiProperty({ description: 'The relationship type', example: 'related' })
    @IsString({ message: 'Relationship type must be a string' })
    @IsNotEmpty({ message: 'Relationship type is required' })
    rel: string;

    @ApiProperty({ description: 'The hyperlink reference', example: 'https://api.ed-fi.org/v7.1/api/data/v3/staff/123' })
    @IsString({ message: 'Href must be a string' })
    @IsNotEmpty({ message: 'Href is required' })
    @IsUrl({}, { message: 'Href must be a valid URL' })
    href: string;
} 