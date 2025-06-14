import { Entity, PrimaryColumn } from 'typeorm';
import { Descriptor } from './descriptor.entity';

@Entity('stateabbreviationdescriptor')
export class StateAbbreviationDescriptor extends Descriptor {
    @PrimaryColumn({ name: 'stateabbreviationdescriptorid', type: 'int' })
    stateAbbreviationDescriptorId: number;
} 