import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseOfferingController } from './controllers/course-offerings.controller';
import { CourseOfferingService } from './services/course-offerings.service';
import { CourseOfferingRepository } from './repositories/course-offerings.repository';
import { CourseOffering } from '../../common/entities/course-offering.entity';
import { Course } from '../../common/entities/course.entity';
import { School } from '../../common/entities/school.entity';
import { Session } from '../../common/entities/session.entity';
import { CourseLevelCharacteristicDescriptor } from '../../common/entities/course-level-characteristic.descriptor';
import { CurriculumUsedDescriptor } from '../../common/entities/curriculum-used.descriptor';
import { GradeLevelDescriptor } from '../../common/entities/grade-level.descriptor';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { JwtUtil } from '../../common/utils/jwt/jwt.utils';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CourseOffering,
      Course,
      School,
      Session,
      CourseLevelCharacteristicDescriptor,
      CurriculumUsedDescriptor,
      GradeLevelDescriptor
    ]),
    CacheModule.register({
      ttl: 3600, // Cache duration in seconds
      max: 100, // Maximum number of items in cache
    }),
  ],
  controllers: [
    CourseOfferingController
  ],
  providers: [
    JwtAuthGuard,
    JwtUtil,
    CourseOfferingService,
    CourseOfferingRepository
  ],
  exports: [CourseOfferingService, CourseOfferingRepository],
})
export class CourseOfferingsModule {} 