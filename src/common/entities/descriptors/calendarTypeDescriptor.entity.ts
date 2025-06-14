import { Entity, PrimaryColumn } from 'typeorm';
import { Descriptor } from './descriptor.entity';
 
@Entity('calendartypedescriptor')
export class CalendarTypeDescriptor extends Descriptor {
    @PrimaryColumn({ name: 'calendartypedescriptorid', type: 'int' })
    calendarTypeDescriptorId: number;
} 