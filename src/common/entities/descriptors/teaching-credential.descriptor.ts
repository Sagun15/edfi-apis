import { Entity, PrimaryColumn } from 'typeorm';
import { Descriptor } from './descriptor.entity';

@Entity('teachingcredentialdescriptor')
export class TeachingCredentialDescriptor extends Descriptor {
    @PrimaryColumn({ name: 'teachingcredentialdescriptorid', type: 'int' })
    teachingCredentialDescriptorId: number;
} 