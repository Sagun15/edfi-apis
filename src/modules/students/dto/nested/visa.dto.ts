import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class VisaDTO {
    @ApiProperty({ 
        description: 'An indicator of a non-US citizen\'s Visa type.',
        maxLength: 306,
        example: 'uri://ed-fi.org/VisaDescriptor#Student Visa'
    })
    @IsNotEmpty({ message: 'Visa descriptor is required' })
    @IsString({ message: 'Visa descriptor must be a string' })
    @MaxLength(306, { message: 'Visa descriptor cannot exceed 306 characters' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    visaDescriptor: string;
} 