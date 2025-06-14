/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'crypto';

export default class BaseResponseDTO {
  identifier?: UUID;

  @ApiProperty()
  sourcedId?: UUID;

  @ApiProperty({ required: false })
  metadata?: Record<string, unknown> | null;

  createdAt?: Date | null;

  @ApiProperty()
  dateLastModified?: Date | null;

  deletedAt?: Date | null;

  constructor(
    sourcedId: UUID,
    metadata: Record<string, unknown> | null,
    modifiedAt: Date | null,
  ) {
    this.sourcedId = sourcedId;
    this.metadata = metadata;
    this.dateLastModified = modifiedAt;
  }
}
