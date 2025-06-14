import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Base } from './base.entity';
import { CredentialFieldDescriptor } from './descriptors/credential-field.descriptor';
import { CredentialTypeDescriptor } from './descriptors/credential-type.descriptor';
import { StateAbbreviationDescriptor } from './descriptors/state-abbreviation.descriptor';
import { TeachingCredentialDescriptor } from './descriptors/teaching-credential.descriptor';
import { TeachingCredentialBasisDescriptor } from './descriptors/teaching-credential-basis.descriptor';

@Entity('credential')
@Index('credential_pk', ['credentialIdentifier', 'stateOfIssueStateAbbreviationDescriptorId'], { unique: true })
@Index('fk_b1c42b_credentialfielddescriptor', ['credentialFieldDescriptorId'])
@Index('fk_b1c42b_credentialtypedescriptor', ['credentialTypeDescriptorId'])
@Index('fk_b1c42b_stateabbreviationdescriptor', ['stateOfIssueStateAbbreviationDescriptorId'])
@Index('fk_b1c42b_teachingcredentialdescriptor', ['teachingCredentialDescriptorId'])
@Index('fk_b1c42b_teachingcredentialbasisdescriptor', ['teachingCredentialBasisDescriptorId'])
export class Credential extends Base {
    @PrimaryColumn({ name: 'credentialidentifier', type: 'varchar', length: 60 })
    credentialIdentifier: string;

    @PrimaryColumn({ name: 'stateofissuestateabbreviationdescriptorid', type: 'int' })
    stateOfIssueStateAbbreviationDescriptorId: number;

    @Column({ name: 'effectivedate', type: 'date', nullable: true })
    effectiveDate?: Date;

    @Column({ name: 'expirationdate', type: 'date', nullable: true })
    expirationDate?: Date;

    @Column({ name: 'credentialfielddescriptorid', type: 'int', nullable: true })
    credentialFieldDescriptorId?: number;

    @Column({ name: 'issuancedate', type: 'date', nullable: false })
    issuanceDate: Date;

    @Column({ name: 'credentialtypedescriptorid', type: 'int', nullable: false })
    credentialTypeDescriptorId: number;

    @Column({ name: 'teachingcredentialdescriptorid', type: 'int', nullable: true })
    teachingCredentialDescriptorId?: number;

    @Column({ name: 'teachingcredentialbasisdescriptorid', type: 'int', nullable: true })
    teachingCredentialBasisDescriptorId?: number;

    @Column({ name: 'namespace', type: 'varchar', length: 255, nullable: false })
    namespace: string;

    // Lazy-loaded relationships
    @ManyToOne(() => CredentialFieldDescriptor, { lazy: true })
    @JoinColumn({ name: 'credentialfielddescriptorid' })
    credentialFieldDescriptor: CredentialFieldDescriptor;

    @ManyToOne(() => CredentialTypeDescriptor, { lazy: true })
    @JoinColumn({ name: 'credentialtypedescriptorid' })
    credentialTypeDescriptor: CredentialTypeDescriptor;

    @ManyToOne(() => StateAbbreviationDescriptor, { lazy: true })
    @JoinColumn({ name: 'stateofissuestateabbreviationdescriptorid' })
    stateOfIssueStateAbbreviationDescriptor: StateAbbreviationDescriptor;

    @ManyToOne(() => TeachingCredentialDescriptor, { lazy: true })
    @JoinColumn({ name: 'teachingcredentialdescriptorid' })
    teachingCredentialDescriptor: TeachingCredentialDescriptor;

    @ManyToOne(() => TeachingCredentialBasisDescriptor, { lazy: true })
    @JoinColumn({ name: 'teachingcredentialbasisdescriptorid' })
    teachingCredentialBasisDescriptor: TeachingCredentialBasisDescriptor;
} 