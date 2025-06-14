import { Entity, Column, PrimaryColumn, Index } from 'typeorm';
import { Base } from './base.entity';

@Index('fk_4525e6_operationalstatusdescriptor', ['operationalStatusDescriptorId'])
@Index('ux_4525e6_id', ['id'], { unique: true })
@Entity('educationorganization')
export class EducationOrganization extends Base {
    @PrimaryColumn({ name: 'educationorganizationid', type: 'integer' })
    educationOrganizationId: number;

    @Column({ name: 'nameofinstitution', type: 'varchar', length: 75 })
    nameOfInstitution: string;

    @Column({ name: 'shortnameofinstitution', type: 'varchar', length: 75, nullable: true })
    shortNameOfInstitution: string;

    @Column({ name: 'website', type: 'varchar', length: 255, nullable: true })
    website: string;

    @Column({ name: 'operationalstatusdescriptorid', type: 'integer', nullable: true })
    operationalStatusDescriptorId: number;
} 