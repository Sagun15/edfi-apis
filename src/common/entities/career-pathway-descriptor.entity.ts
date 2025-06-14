import { Entity, PrimaryColumn } from 'typeorm';
import { Descriptor } from './descriptors/descriptor.entity';

@Entity('careerpathwaydescriptor')
export class CareerPathwayDescriptor extends Descriptor {
  @PrimaryColumn({ name: 'careerpathwaydescriptorid', type: 'integer' })
  careerPathwayDescriptorId: number;
} 