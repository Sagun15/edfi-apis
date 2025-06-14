import { Entity, PrimaryColumn } from 'typeorm';
import { Descriptor } from './descriptor.entity';

@Entity('levelofeducationdescriptor')
export class LevelOfEducationDescriptor extends Descriptor {
    @PrimaryColumn({ name: 'levelofeducationdescriptorid', type: 'integer' })
    levelOfEducationDescriptorId: number;
} 