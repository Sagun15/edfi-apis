import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { JwtUtil } from 'src/common/utils/jwt/jwt.utils';
import { CacheModule } from '@nestjs/cache-manager';
import { Calendar } from 'src/common/entities/calendar.entity';
import { School } from 'src/common/entities/school.entity';
import { CalendarTypeDescriptor } from 'src/common/entities/descriptors/calendarTypeDescriptor.entity';
import { CalendarController } from './controllers/calendar.controller';
import { CalendarService } from './services/calendar.service';
import { CalendarRepository } from './repositories/calendar.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Calendar,
      School,
      CalendarTypeDescriptor,
    ]),
    CacheModule.register({
      ttl: 3600,
      max: 100,
    }),
  ],
  controllers: [CalendarController],
  providers: [
    JwtAuthGuard,
    JwtUtil,
    CalendarService,
    CalendarRepository
  ],
  exports: [CalendarService, CalendarRepository],
})
export class CalendarModule {} 