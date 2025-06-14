import { Entity, PrimaryColumn } from 'typeorm';
import { Descriptor } from './descriptor.entity';

@Entity('oldethnicitydescriptor')
export class OldEthnicityDescriptor extends Descriptor {
    @PrimaryColumn({ name: 'oldethnicitydescriptorid', type: 'integer' })
    oldEthnicityDescriptorId: number;
} 