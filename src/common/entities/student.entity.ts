import { Entity, Column, Index, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './base.entity';
import { CitizenshipStatusDescriptor } from './descriptors/citizenship-status.descriptor.entity';
import { CountryDescriptor } from './descriptors/country.descriptor.entity';
import { SexDescriptor } from './descriptors/sex.descriptor.entity';
import { StateAbbreviationDescriptor } from './descriptors/state-abbreviation.descriptor';

@Index('fk_2a164d_citizenshipstatusdescriptor', ['citizenshipStatusDescriptorId'])
@Index('fk_2a164d_countrydescriptor', ['birthCountryDescriptorId'])
@Index('fk_2a164d_person', ['personId', 'sourceSystemDescriptorId'])
@Index('fk_2a164d_sexdescriptor', ['birthSexDescriptorId'])
@Index('fk_2a164d_stateabbreviationdescriptor', ['birthStateAbbreviationDescriptorId'])
@Index('student_ui_studentuniqueid', ['studentUniqueId'], { unique: true })
@Index('ux_2a164d_id', ['id'], { unique: true })
@Entity('student')
export class Student extends Base {
    @PrimaryGeneratedColumn({ name: 'studentusi', type: 'integer' })
    studentUsi: number;

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

    @Column({ name: 'birthdate', type: 'date' })
    birthDate: Date;

    @Column({ name: 'birthcity', type: 'varchar', length: 30, nullable: true })
    birthCity: string;

    @Column({ name: 'birthstateabbreviationdescriptorid', type: 'integer', nullable: true })
    birthStateAbbreviationDescriptorId: number;

    @Column({ name: 'birthinternationalprovince', type: 'varchar', length: 150, nullable: true })
    birthInternationalProvince: string;

    @Column({ name: 'birthcountrydescriptorid', type: 'integer', nullable: true })
    birthCountryDescriptorId: number;

    @Column({ name: 'dateenteredus', type: 'date', nullable: true })
    dateEnteredUS: Date;

    @Column({ name: 'multiplebirthstatus', type: 'boolean', nullable: true })
    multipleBirthStatus: boolean;

    @Column({ name: 'birthsexdescriptorid', type: 'integer', nullable: true })
    birthSexDescriptorId: number;

    @Column({ name: 'citizenshipstatusdescriptorid', type: 'integer', nullable: true })
    citizenshipStatusDescriptorId: number;

    @Column({ name: 'personid', type: 'varchar', length: 32, nullable: true })
    personId: string;

    @Column({ name: 'sourcesystemdescriptorid', type: 'integer', nullable: true })
    sourceSystemDescriptorId: number;

    @Column({ name: 'studentuniqueid', type: 'varchar', length: 32 })
    studentUniqueId: string;

    // Foreign Key Relationships - All use lazy loading
    @ManyToOne(() => CitizenshipStatusDescriptor, { lazy: true })
    @JoinColumn({ name: 'citizenshipstatusdescriptorid' })
    citizenshipStatusDescriptor: CitizenshipStatusDescriptor;

    @ManyToOne(() => CountryDescriptor, { lazy: true })
    @JoinColumn({ name: 'birthcountrydescriptorid' })
    birthCountryDescriptor: CountryDescriptor;

    @ManyToOne(() => SexDescriptor, { lazy: true })
    @JoinColumn({ name: 'birthsexdescriptorid' })
    birthSexDescriptor: SexDescriptor;

    @ManyToOne(() => StateAbbreviationDescriptor, { lazy: true })
    @JoinColumn({ name: 'birthstateabbreviationdescriptorid' })
    birthStateAbbreviationDescriptor: StateAbbreviationDescriptor;
} 