import { Entity, PrimaryColumn } from 'typeorm';
import { Descriptor } from './descriptor.entity';

@Entity('citizenshipstatusdescriptor')
export class CitizenshipStatusDescriptor extends Descriptor {
    @PrimaryColumn({ name: 'citizenshipstatusdescriptorid', type: 'integer' })
    citizenshipStatusDescriptorId: number;
} 