import { Entity, PrimaryColumn } from 'typeorm';
import { Descriptor } from './descriptor.entity';

@Entity('sexdescriptor')
export class SexDescriptor extends Descriptor {
    @PrimaryColumn({ name: 'sexdescriptorid', type: 'integer' })
    sexDescriptorId: number;
} 