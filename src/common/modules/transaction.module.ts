import { Global, Module } from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';

@Global()
@Module({
    providers: [TransactionService],
    exports: [TransactionService],
})
export class TransactionModule {} 