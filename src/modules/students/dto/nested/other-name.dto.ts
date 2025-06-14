import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class OtherNameDTO {
    @ApiProperty({ 
        description: 'The types of alternate names for an individual.',
        maxLength: 306,
        example: 'uri://ed-fi.org/OtherNameTypeDescriptor#Nickname'
    })
    @IsNotEmpty({ message: 'Other name type descriptor is required' })
    @IsString({ message: 'Other name type descriptor must be a string' })
    @MaxLength(306, { message: 'Other name type descriptor cannot exceed 306 characters' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    otherNameTypeDescriptor: string;

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
        description: 'A prefix used to denote the title, degree, position, or seniority of the individual.',
        maxLength: 30,
        example: 'Mr.'
    })
    @IsOptional()
    @IsString({ message: 'Personal title prefix must be a string' })
    @MaxLength(30, { message: 'Personal title prefix cannot exceed 30 characters' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    personalTitlePrefix?: string;
} 