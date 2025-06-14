import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, Index, OneToMany } from 'typeorm';
import { Base } from './base.entity';
import { Course } from './course.entity';
import { School } from './school.entity';
import { Session } from './session.entity';
import { CourseLevelCharacteristicDescriptor } from './course-level-characteristic.descriptor';
import { CurriculumUsedDescriptor } from './curriculum-used.descriptor';
import { GradeLevelDescriptor } from './grade-level.descriptor';

@Index('fk_0325c5_course', ['courseCode', 'educationOrganizationId'])
@Index('fk_0325c5_school', ['schoolId'])
@Index('fk_0325c5_session', ['schoolId', 'schoolYear', 'sessionName'])
@Index('ux_0325c5_id', ['id'], { unique: true })
@Entity('courseoffering')
export class CourseOffering extends Base {
    @PrimaryColumn({ name: 'localcoursecode', type: 'varchar', length: 60 })
    localCourseCode: string;

    @PrimaryColumn({ name: 'schoolid', type: 'integer' })
    schoolId: number;

    @PrimaryColumn({ name: 'schoolyear', type: 'smallint' })
    schoolYear: number;

    @PrimaryColumn({ name: 'sessionname', type: 'varchar', length: 60 })
    sessionName: string;

    @Column({ name: 'localcoursetitle', type: 'varchar', length: 60, nullable: true })
    localCourseTitle: string;

    @Column({ name: 'instructionaltimeplanned', type: 'integer', nullable: true })
    instructionalTimePlanned: number;

    @Column({ name: 'coursecode', type: 'varchar', length: 60 })
    courseCode: string;

    @Column({ name: 'educationorganizationid', type: 'integer' })
    educationOrganizationId: number;

    @ManyToOne(() => Course)
    @JoinColumn([
        { name: 'coursecode', referencedColumnName: 'courseCode' },
        { name: 'educationorganizationid', referencedColumnName: 'educationOrganizationId' }
    ])
    course: Course;

    @ManyToOne(() => School)
    @JoinColumn({ name: 'schoolid', referencedColumnName: 'schoolId' })
    school: School;

    @ManyToOne(() => Session)
    @JoinColumn([
        { name: 'schoolid', referencedColumnName: 'schoolId' },
        { name: 'schoolyear', referencedColumnName: 'schoolYear' },
        { name: 'sessionname', referencedColumnName: 'sessionName' }
    ])
    session: Session;

    @OneToMany(() => CourseLevelCharacteristicDescriptor, (clc) => clc.courseOffering, {
        lazy: true
    })
    courseLevelCharacteristics: Promise<CourseLevelCharacteristicDescriptor[]>;

    @OneToMany(() => CurriculumUsedDescriptor, (cu) => cu.courseOffering, {
        lazy: true
    })
    curriculumUseds: Promise<CurriculumUsedDescriptor[]>;

    @OneToMany(() => GradeLevelDescriptor, (gl) => gl.courseOffering, {
        lazy: true
    })
    offeredGradeLevels: Promise<GradeLevelDescriptor[]>;
} 