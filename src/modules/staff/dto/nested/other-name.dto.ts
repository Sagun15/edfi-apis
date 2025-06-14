import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength, Matches } from 'class-validator';

export class OtherNameDTO {
    @ApiProperty({ description: 'The type of name', example: 'Alias' })
    @IsString({ message: 'Other name type descriptor must be a string' })
    @IsNotEmpty({ message: 'Other name type descriptor is required' })
    otherNameTypeDescriptor: string;

    @ApiProperty({ description: 'First name', example: 'John' })
    @IsString({ message: 'First name must be a string' })
    @IsNotEmpty({ message: 'First name is required' })
    @MaxLength(75, { message: 'First name cannot exceed 75 characters' })
    @Matches(/^[A-Za-z\s\-']+$/, { message: 'First name can only contain letters, spaces, hyphens, and apostrophes' })
    firstName: string;

    @ApiPropertyOptional({ description: 'Generation code suffix', example: 'Jr.' })
    @IsOptional()
    @IsString({ message: 'Generation code suffix must be a string' })
    @MaxLength(10, { message: 'Generation code suffix cannot exceed 10 characters' })
    generationCodeSuffix?: string;

    @ApiProperty({ description: 'Last surname', example: 'Smith' })
    @IsString({ message: 'Last surname must be a string' })
    @IsNotEmpty({ message: 'Last surname is required' })
    @MaxLength(75, { message: 'Last surname cannot exceed 75 characters' })
    @Matches(/^[A-Za-z\s\-']+$/, { message: 'Last surname can only contain letters, spaces, hyphens, and apostrophes' })
    lastSurname: string;

    @ApiPropertyOptional({ description: 'Middle name', example: 'Michael' })
    @IsOptional()
    @IsString({ message: 'Middle name must be a string' })
    @MaxLength(75, { message: 'Middle name cannot exceed 75 characters' })
    @Matches(/^[A-Za-z\s\-']+$/, { message: 'Middle name can only contain letters, spaces, hyphens, and apostrophes' })
    middleName?: string;

    @ApiPropertyOptional({ description: 'Personal title prefix', example: 'Mr.' })
    @IsOptional()
    @IsString({ message: 'Personal title prefix must be a string' })
    @MaxLength(30, { message: 'Personal title prefix cannot exceed 30 characters' })
    personalTitlePrefix?: string;
} 