import { Entity, PrimaryColumn } from 'typeorm';
import { Descriptor } from './descriptors/descriptor.entity';

@Entity('credittypedescriptor')
export class CreditTypeDescriptor extends Descriptor {
  @PrimaryColumn({ name: 'credittypedescriptorid', type: 'integer' })
  creditTypeDescriptorId: number;
} 