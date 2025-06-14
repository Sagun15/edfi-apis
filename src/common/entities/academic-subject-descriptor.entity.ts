import { Entity, PrimaryColumn } from 'typeorm';
import { Descriptor } from './descriptors/descriptor.entity';

@Entity('academicsubjectdescriptor')
export class AcademicSubjectDescriptor extends Descriptor {
  @PrimaryColumn({ name: 'academicsubjectdescriptorid', type: 'integer' })
  academicSubjectDescriptorId: number;
} 