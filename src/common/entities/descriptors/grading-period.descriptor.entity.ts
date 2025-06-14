import { Entity, PrimaryColumn } from 'typeorm';
import { Descriptor } from './descriptor.entity';
 
@Entity('gradingperioddescriptor')
export class GradingPeriodDescriptor extends Descriptor {
    @PrimaryColumn({ name: 'gradingperioddescriptorid', type: 'integer' })
    gradingPeriodDescriptorId: number;
} 