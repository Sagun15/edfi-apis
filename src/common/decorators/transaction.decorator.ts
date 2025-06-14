import { SetMetadata } from '@nestjs/common';

export const TRANSACTION_KEY = 'TRANSACTIONAL';
export const Transactional = () => SetMetadata(TRANSACTION_KEY, true); 