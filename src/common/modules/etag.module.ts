import { Global, Module } from '@nestjs/common';
import { ETagService } from '../services/etag.service';

@Global()
@Module({
    providers: [ETagService],
    exports: [ETagService],
})
export class ETagModule {} 