import { Entity, Column, PrimaryColumn, Index } from 'typeorm';
import { EducationOrganization } from './education-organization.entity';

@Index('fk_6cd2e3_administrativefundingcontroldescriptor', ['administrativeFundingControlDescriptorId'])
@Index('fk_6cd2e3_charterapprovalagencytypedescriptor', ['charterApprovalAgencyTypeDescriptorId'])
@Index('fk_6cd2e3_charterstatusdescriptor', ['charterStatusDescriptorId'])
@Index('fk_6cd2e3_internetaccessdescriptor', ['internetAccessDescriptorId'])
@Index('fk_6cd2e3_magnetspecialprogramemphasisschooldescriptor', ['magnetSpecialProgramEmphasisSchoolDescriptorId'])
@Index('fk_6cd2e3_schooltypedescriptor', ['schoolTypeDescriptorId'])
@Index('fk_6cd2e3_schoolyeartype', ['charterApprovalSchoolYear'])
@Index('fk_6cd2e3_titleipartaschooldesignationdescriptor', ['titleIPartASchoolDesignationDescriptorId'])
@Entity('school')
export class School extends EducationOrganization {
    @PrimaryColumn({ name: 'schoolid', type: 'integer' })
    schoolId: number;

    @Column({ name: 'schooltypedescriptorid', type: 'integer', nullable: true })
    schoolTypeDescriptorId: number;

    @Column({ name: 'charterstatusdescriptorid', type: 'integer', nullable: true })
    charterStatusDescriptorId: number;

    @Column({ name: 'titleipartaschooldesignationdescriptorid', type: 'integer', nullable: true })
    titleIPartASchoolDesignationDescriptorId: number;

    @Column({ name: 'magnetspecialprogramemphasisschooldescriptorid', type: 'integer', nullable: true })
    magnetSpecialProgramEmphasisSchoolDescriptorId: number;

    @Column({ name: 'administrativefundingcontroldescriptorid', type: 'integer', nullable: true })
    administrativeFundingControlDescriptorId: number;

    @Column({ name: 'internetaccessdescriptorid', type: 'integer', nullable: true })
    internetAccessDescriptorId: number;

    @Column({ name: 'localeducationagencyid', type: 'integer', nullable: true })
    localEducationAgencyId: number;

    @Column({ name: 'charterapprovalagencytypedescriptorid', type: 'integer', nullable: true })
    charterApprovalAgencyTypeDescriptorId: number;

    @Column({ name: 'charterapprovalschoolyear', type: 'smallint', nullable: true })
    charterApprovalSchoolYear: number;
} 