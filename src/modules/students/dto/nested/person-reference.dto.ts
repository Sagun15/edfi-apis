import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsOptional, ValidateNested } from 'class-validator';
import { Type, Transform, TransformFnParams } from 'class-transformer';

export class LinkDTO {
    @ApiPropertyOptional({ description: 'Describes the nature of the relationship to the referenced resource.' })
    @IsOptional()
    @IsString({ message: 'Rel must be a string' })
    rel?: string;

    @ApiPropertyOptional({ description: 'The URL to the related resource.' })
    @IsOptional()
    @IsString({ message: 'Href must be a string' })
    href?: string;
}

export class PersonReferenceDTO {
    @ApiProperty({ 
        description: 'A unique alphanumeric code assigned to a person.',
        maxLength: 32,
        example: 'PERSON123'
    })
    @IsNotEmpty({ message: 'Person ID is required' })
    @IsString({ message: 'Person ID must be a string' })
    @MaxLength(32, { message: 'Person ID cannot exceed 32 characters' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    personId: string;

    @ApiProperty({ 
        description: 'This descriptor defines the originating record source system for the person.',
        maxLength: 306,
        example: 'uri://ed-fi.org/SourceSystemDescriptor#Student Information System'
    })
    @IsNotEmpty({ message: 'Source system descriptor is required' })
    @IsString({ message: 'Source system descriptor must be a string' })
    @MaxLength(306, { message: 'Source system descriptor cannot exceed 306 characters' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    sourceSystemDescriptor: string;

    @ApiPropertyOptional({ 
        description: 'Link to the related resource',
        type: LinkDTO
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => LinkDTO)
    link?: LinkDTO;
} 