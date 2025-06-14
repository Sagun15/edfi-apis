import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ElectronicMailDTO {
    @ApiProperty({ description: 'The type of electronic mail address', example: 'Work' })
    @IsString({ message: 'Electronic mail type descriptor must be a string' })
    @IsNotEmpty({ message: 'Electronic mail type descriptor is required' })
    electronicMailTypeDescriptor: string;

    @ApiProperty({ description: 'The electronic mail address', example: 'staff@school.edu' })
    @IsString({ message: 'Electronic mail address must be a string' })
    @IsNotEmpty({ message: 'Electronic mail address is required' })
    @IsEmail({}, { message: 'Electronic mail address must be a valid email' })
    electronicMailAddress: string;

    @ApiPropertyOptional({ description: 'Do not publish indicator', example: false })
    @IsOptional()
    @IsBoolean({ message: 'Do not publish indicator must be a boolean' })
    doNotPublishIndicator?: boolean;

    @ApiPropertyOptional({ description: 'Primary email address indicator', example: true })
    @IsOptional()
    @IsBoolean({ message: 'Primary email address indicator must be a boolean' })
    primaryEmailAddressIndicator?: boolean;
} 