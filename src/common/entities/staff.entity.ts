import { Entity, Column, Index, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './base.entity';
import { CitizenshipStatusDescriptor } from './descriptors/citizenship-status.descriptor.entity';
import { LevelOfEducationDescriptor } from './descriptors/level-of-education.descriptor.entity';
import { OldEthnicityDescriptor } from './descriptors/old-ethnicity.descriptor.entity';
import { SexDescriptor } from './descriptors/sex.descriptor.entity';

@Index('fk_681927_citizenshipstatusdescriptor', ['citizenshipStatusDescriptorId'])
@Index('fk_681927_levelofeducationdescriptor', ['highestCompletedLevelOfEducationDescriptorId'])
@Index('fk_681927_oldethnicitydescriptor', ['oldEthnicityDescriptorId'])
@Index('fk_681927_person', ['personId', 'sourceSystemDescriptorId'])
@Index('fk_681927_sexdescriptor', ['sexDescriptorId'])
@Index('staff_ui_staffuniqueid', ['staffUniqueId'], { unique: true })
@Entity('staff')
export class Staff extends Base {
    @PrimaryGeneratedColumn({ name: 'staffusi', type: 'integer' })
    staffUsi: number;

    @Column({ name: 'personaltitleprefix', type: 'varchar', length: 30, nullable: true })
    personalTitlePrefix: string;

    @Column({ name: 'firstname', type: 'varchar', length: 75 })
    firstName: string;

    @Column({ name: 'middlename', type: 'varchar', length: 75, nullable: true })
    middleName: string;

    @Column({ name: 'lastsurname', type: 'varchar', length: 75 })
    lastSurname: string;

    @Column({ name: 'preferredfirstname', type: 'varchar', length: 75, nullable: true })
    preferredFirstName: string;

    @Column({ name: 'preferredlastsurname', type: 'varchar', length: 75, nullable: true })
    preferredLastSurname: string;

    @Column({ name: 'generationcodesuffix', type: 'varchar', length: 10, nullable: true })
    generationCodeSuffix: string;

    @Column({ name: 'maidenname', type: 'varchar', length: 75, nullable: true })
    maidenName: string;

    @Column({ name: 'sexdescriptorid', type: 'integer', nullable: true })
    sexDescriptorId: number;

    @ManyToOne(() => SexDescriptor, { lazy: true })
    @JoinColumn({ name: 'sexdescriptorid' })
    sexDescriptor: SexDescriptor;

    @Column({ name: 'birthdate', type: 'date', nullable: true })
    birthDate: Date;

    @Column({ name: 'hispaniclatinoethnicity', type: 'boolean', nullable: true })
    hispanicLatinoEthnicity: boolean;

    @Column({ name: 'oldethnicitydescriptorid', type: 'integer', nullable: true })
    oldEthnicityDescriptorId: number;

    @ManyToOne(() => OldEthnicityDescriptor, { lazy: true })
    @JoinColumn({ name: 'oldethnicitydescriptorid' })
    oldEthnicityDescriptor: OldEthnicityDescriptor;

    @Column({ name: 'citizenshipstatusdescriptorid', type: 'integer', nullable: true })
    citizenshipStatusDescriptorId: number;

    @ManyToOne(() => CitizenshipStatusDescriptor, { lazy: true })
    @JoinColumn({ name: 'citizenshipstatusdescriptorid' })
    citizenshipStatusDescriptor: CitizenshipStatusDescriptor;

    @Column({ name: 'highestcompletedlevelofeducationdescriptorid', type: 'integer', nullable: true })
    highestCompletedLevelOfEducationDescriptorId: number;

    @ManyToOne(() => LevelOfEducationDescriptor, { lazy: true })
    @JoinColumn({ name: 'highestcompletedlevelofeducationdescriptorid' })
    highestCompletedLevelOfEducationDescriptor: LevelOfEducationDescriptor;

    @Column({ name: 'yearsofpriorprofessionalexperience', type: 'numeric', precision: 5, scale: 2, nullable: true })
    yearsOfPriorProfessionalExperience: number;

    @Column({ name: 'yearsofpriorteachingexperience', type: 'numeric', precision: 5, scale: 2, nullable: true })
    yearsOfPriorTeachingExperience: number;

    @Column({ name: 'loginid', type: 'varchar', length: 60, nullable: true })
    loginId: string;

    @Column({ name: 'highlyqualifiedteacher', type: 'boolean', nullable: true })
    highlyQualifiedTeacher: boolean;

    @Column({ name: 'personid', type: 'varchar', length: 32, nullable: true })
    personId: string;

    @Column({ name: 'sourcesystemdescriptorid', type: 'integer', nullable: true })
    sourceSystemDescriptorId: number;

    @Column({ name: 'staffuniqueid', type: 'varchar', length: 32 })
    staffUniqueId: string;
} 