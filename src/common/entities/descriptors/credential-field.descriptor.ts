import { Entity, PrimaryColumn } from 'typeorm';
import { Descriptor } from './descriptor.entity';

@Entity('credentialfielddescriptor')
export class CredentialFieldDescriptor extends Descriptor {
    @PrimaryColumn({ name: 'credentialfielddescriptorid', type: 'int' })
    credentialFieldDescriptorId: number;
} 