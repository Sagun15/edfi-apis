import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class LanguageUseDTO {
    @ApiProperty({ description: 'The type of use for this language', example: 'Spoken' })
    @IsString({ message: 'Language use descriptor must be a string' })
    @IsNotEmpty({ message: 'Language use descriptor is required' })
    languageUseDescriptor: string;
}

export class LanguageDTO {
    @ApiProperty({ description: 'The language descriptor', example: 'English' })
    @IsString({ message: 'Language descriptor must be a string' })
    @IsNotEmpty({ message: 'Language descriptor is required' })
    languageDescriptor: string;

    @ApiProperty({ description: 'The uses of this language', type: [LanguageUseDTO] })
    @ValidateNested({ each: true })
    @Type(() => LanguageUseDTO)
    uses: LanguageUseDTO[];
} 