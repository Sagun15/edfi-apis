import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PeriodDTO {
    @ApiProperty({ description: 'Begin date', example: '2025-05-31' })
    @IsDateString({}, { message: 'Begin date must be a valid date' })
    beginDate: string;

    @ApiProperty({ description: 'End date', example: '2025-05-31' })
    @IsDateString({}, { message: 'End date must be a valid date' })
    endDate: string;
}

export class AddressDTO {
    @ApiProperty({ description: 'The type of address', example: 'Physical' })
    @IsString({ message: 'Address type descriptor must be a string' })
    @IsNotEmpty({ message: 'Address type descriptor is required' })
    addressTypeDescriptor: string;

    @ApiProperty({ description: 'The state abbreviation', example: 'TX' })
    @IsString({ message: 'State abbreviation descriptor must be a string' })
    @IsNotEmpty({ message: 'State abbreviation descriptor is required' })
    stateAbbreviationDescriptor: string;

    @ApiProperty({ description: 'The city name', example: 'Austin' })
    @IsString({ message: 'City must be a string' })
    @IsNotEmpty({ message: 'City is required' })
    @MaxLength(30, { message: 'City cannot exceed 30 characters' })
    city: string;

    @ApiProperty({ description: 'The postal code', example: '78701' })
    @IsString({ message: 'Postal code must be a string' })
    @MaxLength(17, { message: 'Postal code cannot exceed 17 characters' })
    postalCode: string;

    @ApiProperty({ description: 'The street number and name', example: '123 Main St' })
    @IsString({ message: 'Street number and name must be a string' })
    @IsNotEmpty({ message: 'Street number and name is required' })
    @MaxLength(150, { message: 'Street number and name cannot exceed 150 characters' })
    streetNumberName: string;

    @ApiPropertyOptional({ description: 'The locale descriptor', example: 'Urban' })
    @IsOptional()
    @IsString({ message: 'Locale descriptor must be a string' })
    localeDescriptor?: string;

    @ApiPropertyOptional({ description: 'Apartment/room/suite number', example: 'Apt 4B' })
    @IsOptional()
    @IsString({ message: 'Apartment/room/suite number must be a string' })
    @MaxLength(50, { message: 'Apartment/room/suite number cannot exceed 50 characters' })
    apartmentRoomSuiteNumber?: string;

    @ApiPropertyOptional({ description: 'Building site number', example: 'Building 5' })
    @IsOptional()
    @IsString({ message: 'Building site number must be a string' })
    @MaxLength(20, { message: 'Building site number cannot exceed 20 characters' })
    buildingSiteNumber?: string;

    @ApiPropertyOptional({ description: 'Congressional district', example: 'TX-25' })
    @IsOptional()
    @IsString({ message: 'Congressional district must be a string' })
    @MaxLength(30, { message: 'Congressional district cannot exceed 30 characters' })
    congressionalDistrict?: string;

    @ApiPropertyOptional({ description: 'County FIPS code', example: '48453' })
    @IsOptional()
    @IsString({ message: 'County FIPS code must be a string' })
    @MaxLength(5, { message: 'County FIPS code cannot exceed 5 characters' })
    countyFIPSCode?: string;

    @ApiPropertyOptional({ description: 'Do not publish indicator', example: true })
    @IsOptional()
    @IsBoolean({ message: 'Do not publish indicator must be a boolean' })
    doNotPublishIndicator?: boolean;

    @ApiPropertyOptional({ description: 'Latitude', example: '30.2672' })
    @IsOptional()
    @IsString({ message: 'Latitude must be a string' })
    @MaxLength(20, { message: 'Latitude cannot exceed 20 characters' })
    latitude?: string;

    @ApiPropertyOptional({ description: 'Longitude', example: '-97.7431' })
    @IsOptional()
    @IsString({ message: 'Longitude must be a string' })
    @MaxLength(20, { message: 'Longitude cannot exceed 20 characters' })
    longitude?: string;

    @ApiPropertyOptional({ description: 'Name of county', example: 'Travis' })
    @IsOptional()
    @IsString({ message: 'Name of county must be a string' })
    @MaxLength(30, { message: 'Name of county cannot exceed 30 characters' })
    nameOfCounty?: string;

    @ApiPropertyOptional({ description: 'Address periods', type: [PeriodDTO] })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => PeriodDTO)
    periods?: PeriodDTO[];
} 