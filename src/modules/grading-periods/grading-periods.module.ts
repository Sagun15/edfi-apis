import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { JwtUtil } from 'src/common/utils/jwt/jwt.utils';
import { CacheModule } from '@nestjs/cache-manager';
import { GradingPeriod } from 'src/common/entities/gradingPeriod.entity';
import { GradingPeriodDescriptor } from 'src/common/entities/descriptors/grading-period.descriptor.entity';
import { School } from 'src/common/entities/school.entity';
import { GradingPeriodController } from './controllers/grading-period.controller';
import { GradingPeriodService } from './services/grading-period.service';
import { GradingPeriodRepository } from './repositories/grading-period.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GradingPeriod,
      GradingPeriodDescriptor,
      School,
    ]),
    CacheModule.register({
      ttl: 3600,
      max: 100,
    }),
  ],
  controllers: [GradingPeriodController],
  providers: [
    JwtAuthGuard,
    JwtUtil,
    GradingPeriodService,
    GradingPeriodRepository,
  ],
  exports: [GradingPeriodService, GradingPeriodRepository],
})
export class GradingPeriodsModule {} 