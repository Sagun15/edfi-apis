import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { JwtUtil } from 'src/common/utils/jwt/jwt.utils';
import { CacheModule } from '@nestjs/cache-manager';
import { Student } from 'src/common/entities/student.entity';
import { CitizenshipStatusDescriptor } from 'src/common/entities/descriptors/citizenship-status.descriptor.entity';
import { CountryDescriptor } from 'src/common/entities/descriptors/country.descriptor.entity';
import { SexDescriptor } from 'src/common/entities/descriptors/sex.descriptor.entity';
import { StateAbbreviationDescriptor } from 'src/common/entities/descriptors/state-abbreviation.descriptor';
import { StudentsController } from './controller/students.controller';
import { StudentService } from './service/student.service';
import { StudentRepository } from './repository/student.repository';

/**
 * Students Module
 * 
 * Configures all components for Student API endpoints including
 * controller, service, repository, and required dependencies.
 * **AUTO-DISCOVERED**: All foreign entities and descriptors automatically included in imports.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Student, // Main entity
      // **AUTO-DISCOVERED**: All foreign entities that this module interacts with
      CitizenshipStatusDescriptor,
      CountryDescriptor,
      SexDescriptor,
      StateAbbreviationDescriptor,
    ]),
    CacheModule.register({
      ttl: 3600, // Cache duration in seconds
      max: 100, // Maximum number of items in cache
    }),
  ],
  controllers: [StudentsController],
  providers: [
    JwtAuthGuard,
    JwtUtil,
    StudentService,
    StudentRepository
  ],
  exports: [StudentService, StudentRepository],
})
export class StudentsModule {} 