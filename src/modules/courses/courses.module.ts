import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { JwtUtil } from 'src/common/utils/jwt/jwt.utils';
import { CacheModule } from '@nestjs/cache-manager';
import { Course } from 'src/common/entities/course.entity';
import { AcademicSubjectDescriptor } from 'src/common/entities/academic-subject-descriptor.entity';
import { CareerPathwayDescriptor } from 'src/common/entities/career-pathway-descriptor.entity';
import { CourseDefinedByDescriptor } from 'src/common/entities/course-defined-by-descriptor.entity';
import { CourseGPAApplicabilityDescriptor } from 'src/common/entities/course-gpa-applicability-descriptor.entity';
import { CreditTypeDescriptor } from 'src/common/entities/credit-type-descriptor.entity';
import { EducationOrganization } from 'src/common/entities/education-organization.entity';
import { CourseController } from './controllers/course.controller';
import { CourseService } from './services/course.service';
import { CourseRepository } from './repositories/course.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Course,
      AcademicSubjectDescriptor,
      CareerPathwayDescriptor,
      CourseDefinedByDescriptor,
      CourseGPAApplicabilityDescriptor,
      CreditTypeDescriptor,
      EducationOrganization,
    ]),
    CacheModule.register({
      ttl: 3600,
      max: 100,
    }),
  ],
  controllers: [CourseController],
  providers: [
    JwtAuthGuard,
    JwtUtil,
    CourseService,
    CourseRepository,
  ],
  exports: [CourseService, CourseRepository],
})
export class CoursesModule {} 