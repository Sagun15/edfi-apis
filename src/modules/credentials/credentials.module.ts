import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { JwtUtil } from 'src/common/utils/jwt/jwt.utils';
import { CacheModule } from '@nestjs/cache-manager';
import { Credential } from 'src/common/entities/credential.entity';
import { StateAbbreviationDescriptor } from 'src/common/entities/descriptors/state-abbreviation.descriptor';
import { CredentialFieldDescriptor } from 'src/common/entities/descriptors/credential-field.descriptor';
import { CredentialTypeDescriptor } from 'src/common/entities/descriptors/credential-type.descriptor';
import { TeachingCredentialDescriptor } from 'src/common/entities/descriptors/teaching-credential.descriptor';
import { TeachingCredentialBasisDescriptor } from 'src/common/entities/descriptors/teaching-credential-basis.descriptor';
import { CredentialController } from './controllers/credentials.controller';
import { CredentialService } from './services/credentials.service';
import { CredentialRepository } from './repositories/credentials.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Credential,
      StateAbbreviationDescriptor,
      CredentialFieldDescriptor,
      CredentialTypeDescriptor,
      TeachingCredentialDescriptor,
      TeachingCredentialBasisDescriptor,
    ]),
    CacheModule.register({
      ttl: 3600,
      max: 100,
    }),
  ],
  controllers: [CredentialController],
  providers: [
    JwtAuthGuard,
    JwtUtil,
    CredentialService,
    CredentialRepository
  ],
  exports: [CredentialService, CredentialRepository],
})
export class CredentialsModule {} 