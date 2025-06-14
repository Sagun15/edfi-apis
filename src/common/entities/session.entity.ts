import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Base } from './base.entity';
import { School } from './school.entity';

@Index('fk_6959b4_school', ['schoolId'])
@Index('fk_6959b4_schoolyeartype', ['schoolYear'])
@Index('fk_6959b4_termdescriptor', ['termDescriptorId'])
@Index('ux_6959b4_id', ['id'], { unique: true })
@Entity('session')
export class Session extends Base {
    @PrimaryColumn({ name: 'schoolid', type: 'integer' })
    schoolId: number;

    @PrimaryColumn({ name: 'schoolyear', type: 'smallint' })
    schoolYear: number;

    @PrimaryColumn({ name: 'sessionname', type: 'varchar', length: 60 })
    sessionName: string;

    @Column({ name: 'begindate', type: 'date' })
    beginDate: Date;

    @Column({ name: 'enddate', type: 'date' })
    endDate: Date;

    @Column({ name: 'termdescriptorid', type: 'integer' })
    termDescriptorId: number;

    @Column({ name: 'totalinstructionaldays', type: 'integer' })
    totalInstructionalDays: number;

    @ManyToOne(() => School)
    @JoinColumn({ name: 'schoolid', referencedColumnName: 'schoolId' })
    school: School;
} 