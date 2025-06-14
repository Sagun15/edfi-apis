import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class TelephoneDTO {
    @ApiProperty({ description: 'The type of telephone number', example: 'Home' })
    @IsString({ message: 'Telephone number type descriptor must be a string' })
    @IsNotEmpty({ message: 'Telephone number type descriptor is required' })
    telephoneNumberTypeDescriptor: string;

    @ApiProperty({ description: 'The telephone number', example: '512-555-0100' })
    @IsString({ message: 'Telephone number must be a string' })
    @IsNotEmpty({ message: 'Telephone number is required' })
    telephoneNumber: string;

    @ApiPropertyOptional({ description: 'Do not publish indicator', example: false })
    @IsOptional()
    @IsBoolean({ message: 'Do not publish indicator must be a boolean' })
    doNotPublishIndicator?: boolean;

    @ApiPropertyOptional({ description: 'Order of priority', example: 1 })
    @IsOptional()
    @IsNumber({}, { message: 'Order of priority must be a number' })
    @Min(1, { message: 'Order of priority must be at least 1' })
    @Max(9, { message: 'Order of priority cannot exceed 9' })
    orderOfPriority?: number;

    @ApiPropertyOptional({ description: 'Text message capability indicator', example: true })
    @IsOptional()
    @IsBoolean({ message: 'Text message capability indicator must be a boolean' })
    textMessageCapabilityIndicator?: boolean;
} 