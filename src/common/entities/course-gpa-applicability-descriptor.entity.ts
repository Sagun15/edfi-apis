import { Entity, PrimaryColumn } from 'typeorm';
import { Descriptor } from './descriptors/descriptor.entity';

@Entity('coursegpaapplicabilitydescriptor')
export class CourseGPAApplicabilityDescriptor extends Descriptor {
  @PrimaryColumn({ name: 'coursegpaapplicabilitydescriptorid', type: 'integer' })
  courseGPAApplicabilityDescriptorId: number;
} 