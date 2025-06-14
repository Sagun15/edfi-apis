import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { Staff } from 'src/common/entities/staff.entity';
import { StaffController } from './controllers/staff.controller';
import { StaffService } from './services/staff.service';
import { StaffRepository } from './repositories/staff.repository';
import { SexDescriptor } from 'src/common/entities/descriptors/sex.descriptor.entity';
import { OldEthnicityDescriptor } from 'src/common/entities/descriptors/old-ethnicity.descriptor.entity';
import { CitizenshipStatusDescriptor } from 'src/common/entities/descriptors/citizenship-status.descriptor.entity';
import { LevelOfEducationDescriptor } from 'src/common/entities/descriptors/level-of-education.descriptor.entity';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { JwtUtil } from 'src/common/utils/jwt/jwt.utils';

@Module({
    imports: [
        // Register Staff entity and its referenced descriptors with TypeORM
        TypeOrmModule.forFeature([
            Staff,
            SexDescriptor,
            OldEthnicityDescriptor,
            CitizenshipStatusDescriptor,
            LevelOfEducationDescriptor,
        ]),
        // Configure cache module with TTL of 3600 seconds (1 hour)
        CacheModule.register({
            ttl: 3600,
            max: 100, // Maximum number of items in cache
        }),
    ],
    controllers: [StaffController],
    providers: [
        JwtAuthGuard,
        JwtUtil,
        StaffService,
        StaffRepository,
    ],
    exports: [StaffService, StaffRepository], // Export services for use in other modules
})
export class StaffModule {} 