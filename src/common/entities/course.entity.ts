import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Base } from './base.entity';
import { AcademicSubjectDescriptor } from './academic-subject-descriptor.entity';
import { CareerPathwayDescriptor } from './career-pathway-descriptor.entity';
import { CourseDefinedByDescriptor } from './course-defined-by-descriptor.entity';
import { CourseGPAApplicabilityDescriptor } from './course-gpa-applicability-descriptor.entity';
import { CreditTypeDescriptor } from './credit-type-descriptor.entity';
import { EducationOrganization } from './education-organization.entity';

@Index('fk_2096ce_academicsubjectdescriptor', ['academicSubjectDescriptorId'])
@Index('fk_2096ce_careerpathwaydescriptor', ['careerPathwayDescriptorId'])
@Index('fk_2096ce_coursedefinedbydescriptor', ['courseDefinedByDescriptorId'])
@Index('fk_2096ce_coursegpaapplicabilitydescriptor', ['courseGPAApplicabilityDescriptorId'])
@Index('fk_2096ce_credittypedescriptor', ['minimumAvailableCreditTypeDescriptorId'])
@Index('fk_2096ce_credittypedescriptor1', ['maximumAvailableCreditTypeDescriptorId'])
@Index('fk_2096ce_educationorganization', ['educationOrganizationId'])
@Index('ux_2096ce_id', ['id'], { unique: true })
@Entity('course')
export class Course extends Base {
    @PrimaryColumn({ name: 'coursecode', type: 'varchar', length: 60 })
    courseCode: string;

    @PrimaryColumn({ name: 'educationorganizationid', type: 'integer' })
    educationOrganizationId: number;

    @Column({ name: 'coursetitle', type: 'varchar', length: 60 })
    courseTitle: string;

    @Column({ name: 'numberofparts', type: 'integer' })
    numberOfParts: number;

    @Column({ name: 'coursedescription', type: 'varchar', length: 1024, nullable: true })
    courseDescription: string;

    @Column({ name: 'timerequiredforcompletion', type: 'integer', nullable: true })
    timeRequiredForCompletion: number;

    @Column({ name: 'datecourseadopted', type: 'date', nullable: true })
    dateCourseAdopted: Date;

    @Column({ name: 'highschoolcourserequirement', type: 'boolean', nullable: true })
    highSchoolCourseRequirement: boolean;

    @Column({ name: 'minimumavailablecredits', type: 'numeric', precision: 9, scale: 3, nullable: true })
    minimumAvailableCredits: number;

    @Column({ name: 'minimumavailablecreditconversion', type: 'numeric', precision: 9, scale: 2, nullable: true })
    minimumAvailableCreditConversion: number;

    @Column({ name: 'maximumavailablecredits', type: 'numeric', precision: 9, scale: 3, nullable: true })
    maximumAvailableCredits: number;

    @Column({ name: 'maximumavailablecreditconversion', type: 'numeric', precision: 9, scale: 2, nullable: true })
    maximumAvailableCreditConversion: number;

    @Column({ name: 'maxcompletionsforcredit', type: 'integer', nullable: true })
    maxCompletionsForCredit: number;

    // Foreign Key Columns
    @Column({ name: 'academicsubjectdescriptorid', type: 'integer', nullable: true })
    academicSubjectDescriptorId: number;

    @Column({ name: 'careerpathwaydescriptorid', type: 'integer', nullable: true })
    careerPathwayDescriptorId: number;

    @Column({ name: 'coursedefinedbydescriptorid', type: 'integer', nullable: true })
    courseDefinedByDescriptorId: number;

    @Column({ name: 'coursegpaapplicabilitydescriptorid', type: 'integer', nullable: true })
    courseGPAApplicabilityDescriptorId: number;

    @Column({ name: 'minimumavailablecredittypedescriptorid', type: 'integer', nullable: true })
    minimumAvailableCreditTypeDescriptorId: number;

    @Column({ name: 'maximumavailablecredittypedescriptorid', type: 'integer', nullable: true })
    maximumAvailableCreditTypeDescriptorId: number;

    // Relationships
    @ManyToOne(() => AcademicSubjectDescriptor)
    @JoinColumn({ name: 'academicsubjectdescriptorid' })
    academicSubjectDescriptor: AcademicSubjectDescriptor;

    @ManyToOne(() => CareerPathwayDescriptor)
    @JoinColumn({ name: 'careerpathwaydescriptorid' })
    careerPathwayDescriptor: CareerPathwayDescriptor;

    @ManyToOne(() => CourseDefinedByDescriptor)
    @JoinColumn({ name: 'coursedefinedbydescriptorid' })
    courseDefinedByDescriptor: CourseDefinedByDescriptor;

    @ManyToOne(() => CourseGPAApplicabilityDescriptor)
    @JoinColumn({ name: 'coursegpaapplicabilitydescriptorid' })
    courseGPAApplicabilityDescriptor: CourseGPAApplicabilityDescriptor;

    @ManyToOne(() => CreditTypeDescriptor)
    @JoinColumn({ name: 'minimumavailablecredittypedescriptorid' })
    minimumAvailableCreditTypeDescriptor: CreditTypeDescriptor;

    @ManyToOne(() => CreditTypeDescriptor)
    @JoinColumn({ name: 'maximumavailablecredittypedescriptorid' })
    maximumAvailableCreditTypeDescriptor: CreditTypeDescriptor;

    @ManyToOne(() => EducationOrganization)
    @JoinColumn({ name: 'educationorganizationid' })
    educationOrganization: EducationOrganization;
} 