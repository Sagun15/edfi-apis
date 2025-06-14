import { Entity, PrimaryColumn } from 'typeorm';
import { Descriptor } from './descriptor.entity';

@Entity('teachingcredentialbasisdescriptor')
export class TeachingCredentialBasisDescriptor extends Descriptor {
    @PrimaryColumn({ name: 'teachingcredentialbasisdescriptorid', type: 'int' })
    teachingCredentialBasisDescriptorId: number;
} 