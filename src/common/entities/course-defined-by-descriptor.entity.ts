import { Entity, PrimaryColumn } from 'typeorm';
import { Descriptor } from './descriptors/descriptor.entity';

@Entity('coursedefinedbydescriptor')
export class CourseDefinedByDescriptor extends Descriptor {
  @PrimaryColumn({ name: 'coursedefinedbydescriptorid', type: 'integer' })
  courseDefinedByDescriptorId: number;
} 