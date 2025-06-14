import { Column, Index } from 'typeorm';
import { Base } from '../base.entity';

@Index('descriptor_ak', ['codeValue', 'namespace'], { unique: true })
export abstract class Descriptor extends Base {
    @Column({ name: 'namespace', type: 'varchar', length: 255, nullable: false })
    namespace: string;

    @Column({ name: 'codevalue', type: 'varchar', length: 50, nullable: false })
    codeValue: string;

    @Column({ name: 'shortdescription', type: 'varchar', length: 75, nullable: false })
    shortDescription: string;

    @Column({ name: 'description', type: 'varchar', length: 1024, nullable: true })
    description?: string;

    @Column({ name: 'priordescriptorid', type: 'int', nullable: true })
    priorDescriptorId?: number;

    @Column({ name: 'effectivebegindate', type: 'date', nullable: true })
    effectiveBeginDate?: Date;

    @Column({ name: 'effectiveenddate', type: 'date', nullable: true })
    effectiveEndDate?: Date;
}