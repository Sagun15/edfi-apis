import { Entity, PrimaryColumn } from 'typeorm';
import { Descriptor } from './descriptor.entity';

@Entity('credentialtypedescriptor')
export class CredentialTypeDescriptor extends Descriptor {
    @PrimaryColumn({ name: 'credentialtypedescriptorid', type: 'int' })
    credentialTypeDescriptorId: number;
} 