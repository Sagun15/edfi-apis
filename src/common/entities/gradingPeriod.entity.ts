import { Column, Entity, Index } from 'typeorm';
import { Base } from './base.entity';

@Entity('gradingperiod')
@Index('fk_5a18f9_gradingperioddescriptor', ['gradingPeriodDescriptorId'])
@Index('fk_5a18f9_school', ['schoolId'])
@Index('fk_5a18f9_schoolyeartype', ['schoolYear'])
@Index('gradingperiod_pk', ['gradingPeriodDescriptorId', 'periodSequence', 'schoolId', 'schoolYear'], { unique: true })
export class GradingPeriod extends Base {
  @Column({ name: 'gradingperioddescriptorid', type: 'integer' })
  gradingPeriodDescriptorId: number;

  @Column({ name: 'gradingperiodname', type: 'varchar', length: 60 })
  gradingPeriodName: string;

  @Column({ name: 'periodsequence', type: 'integer' })
  periodSequence: number;

  @Column({ name: 'schoolid', type: 'integer' })
  schoolId: number;

  @Column({ name: 'schoolyear', type: 'smallint' })
  schoolYear: number;

  @Column({ name: 'begindate', type: 'date' })
  beginDate: Date;

  @Column({ name: 'enddate', type: 'date' })
  endDate: Date;

  @Column({ name: 'totalinstructionaldays', type: 'integer' })
  totalInstructionalDays: number;
} 