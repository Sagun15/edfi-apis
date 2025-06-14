import { SetMetadata } from '@nestjs/common';

export const hasRole = (hasRole: string) => SetMetadata('role', hasRole);
