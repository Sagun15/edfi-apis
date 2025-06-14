import { Entity, Column, ManyToOne, JoinColumn, Index, PrimaryColumn } from 'typeorm';
import { Base } from './base.entity';
import { School } from './school.entity';
import { CalendarTypeDescriptor } from './descriptors/calendarTypeDescriptor.entity';

@Entity('calendar')
@Index('fk_d5d0a3_calendartypedescriptor', ['calendarTypeDescriptorId'])
@Index('fk_d5d0a3_school', ['schoolId'])
@Index('fk_d5d0a3_schoolyeartype', ['schoolYear'])
@Index('ux_d5d0a3_id', ['id'], { unique: true })
@Index('calendar_pk', ['calendarCode', 'schoolId', 'schoolYear'], { unique: true })
export class Calendar extends Base {
    @PrimaryColumn({ name: 'calendarcode', type: 'varchar', length: 60 })
    calendarCode: string;

    @PrimaryColumn({ name: 'schoolid', type: 'int' })
    schoolId: number;

    @PrimaryColumn({ name: 'schoolyear', type: 'smallint' })
    schoolYear: number;

    @Column({ name: 'calendartypedescriptorid', type: 'int' })
    calendarTypeDescriptorId: number;

    @ManyToOne(() => School, { lazy: true })
    @JoinColumn({ name: 'schoolid' })
    school: School;

    @ManyToOne(() => CalendarTypeDescriptor, { lazy: true })
    @JoinColumn({ name: 'calendartypedescriptorid' })
    calendarTypeDescriptor: CalendarTypeDescriptor;
} 