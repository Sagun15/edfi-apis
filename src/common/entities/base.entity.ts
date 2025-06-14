import { UUID } from 'crypto';
import { BaseEntity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import { Status } from '../constants/enums';

export class Base extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({ 
    name: 'status',
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE
  })
  status: Status;

  @Column({ 
    name: 'createdate',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  createdate: Date;

  @Column({ 
    name: 'lastmodifieddate',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  lastmodifieddate: Date;

  @Column({ 
    name: 'deletedate',
    type: 'timestamp',
    nullable: true
  })
  deletedate: Date;

  /**
   * Automatically sets status to ACTIVE before entity insertion
   */
  @BeforeInsert()
  setDefaultStatus() {
    this.status = Status.ACTIVE;
  }
}
