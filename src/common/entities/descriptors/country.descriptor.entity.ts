import { Entity, PrimaryColumn } from 'typeorm';
import { Descriptor } from './descriptor.entity';

@Entity('countrydescriptor')
export class CountryDescriptor extends Descriptor {
    @PrimaryColumn({ name: 'countrydescriptorid', type: 'integer' })
    countryDescriptorId: number;
} 