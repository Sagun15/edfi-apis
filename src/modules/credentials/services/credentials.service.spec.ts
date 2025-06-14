import { Test, TestingModule } from '@nestjs/testing';
import { CredentialService } from './credentials.service';
import { CredentialRepository } from '../repositories/credentials.repository';
import { ETagService } from 'src/common/services/etag.service';
import { TransactionService } from 'src/common/services/transaction.service';
import { CustomLogger } from 'src/common/utils/logger/logger.service';
import { BadRequestError } from 'src/common/errors/BadRequestError';
import { UnknownObjectError } from 'src/common/errors/UnknownObjectError';
import { Status } from 'src/common/constants/enums';
import {
  generateMockCreateCredentialDTO,
  generateMockCredential,
  generateMockCredentials,
} from 'src/common/utils/test-utils/credentialGenerator.util';
import { QueryRunner, Repository } from 'typeorm';
import { Credential } from 'src/common/entities/credential.entity';
import { CREDENTIAL_CONSTANTS } from '../constants/credential.constants';
import { CREDENTIAL_TEST_CONSTANTS } from '../constants/credential.test.constants';
import { faker } from '@faker-js/faker';
import { UUID } from 'crypto';
import { StateAbbreviationDescriptor } from 'src/common/entities/descriptors/state-abbreviation.descriptor';
import { CredentialTypeDescriptor } from 'src/common/entities/descriptors/credential-type.descriptor';
import { CredentialFieldDescriptor } from 'src/common/entities/descriptors/credential-field.descriptor';
import { TeachingCredentialDescriptor } from 'src/common/entities/descriptors/teaching-credential.descriptor';
import { TeachingCredentialBasisDescriptor } from 'src/common/entities/descriptors/teaching-credential-basis.descriptor';

describe('CredentialService', () => {
  // Reusable test data
  const mockQueryOptions = CREDENTIAL_TEST_CONSTANTS.MOCK_QUERY_OPTIONS;
  const mockHttpResponse = { setHeader: jest.fn() };
  const mockQueryRunner: QueryRunner = {
    connection: {},
    manager: {},
    isReleased: false,
  } as QueryRunner;
  const mockIfMatchHeader = CREDENTIAL_TEST_CONSTANTS.MOCK_IF_MATCH_HEADER;

  // Service dependencies
  let service: CredentialService;
  let credentialRepository: jest.Mocked<CredentialRepository>;
  let etagService: jest.Mocked<ETagService>;
  let transactionService: jest.Mocked<TransactionService>;
  let logger: jest.Mocked<CustomLogger>;

  // Mock descriptor repositories with precise typing
  const mockStateAbbrevRepo = {
    findOne: jest.fn() as jest.MockedFunction<
      Repository<StateAbbreviationDescriptor>['findOne']
    >,
    target: StateAbbreviationDescriptor as typeof StateAbbreviationDescriptor,
    manager: {} as Repository<StateAbbreviationDescriptor>['manager'],
    metadata: {} as Repository<StateAbbreviationDescriptor>['metadata'],
    createQueryBuilder: jest.fn() as jest.MockedFunction<
      Repository<StateAbbreviationDescriptor>['createQueryBuilder']
    >,
  };

  const mockCredentialTypeRepo = {
    findOne: jest.fn() as jest.MockedFunction<
      Repository<CredentialTypeDescriptor>['findOne']
    >,
    target: CredentialTypeDescriptor as typeof CredentialTypeDescriptor,
    manager: {} as Repository<CredentialTypeDescriptor>['manager'],
    metadata: {} as Repository<CredentialTypeDescriptor>['metadata'],
    createQueryBuilder: jest.fn() as jest.MockedFunction<
      Repository<CredentialTypeDescriptor>['createQueryBuilder']
    >,
  };

  const mockCredentialFieldRepo = {
    findOne: jest.fn() as jest.MockedFunction<
      Repository<CredentialFieldDescriptor>['findOne']
    >,
    target: CredentialFieldDescriptor as typeof CredentialFieldDescriptor,
    manager: {} as Repository<CredentialFieldDescriptor>['manager'],
    metadata: {} as Repository<CredentialFieldDescriptor>['metadata'],
    createQueryBuilder: jest.fn() as jest.MockedFunction<
      Repository<CredentialFieldDescriptor>['createQueryBuilder']
    >,
  };

  const mockTeachingCredentialRepo = {
    findOne: jest.fn() as jest.MockedFunction<
      Repository<TeachingCredentialDescriptor>['findOne']
    >,
    target: TeachingCredentialDescriptor as typeof TeachingCredentialDescriptor,
    manager: {} as Repository<TeachingCredentialDescriptor>['manager'],
    metadata: {} as Repository<TeachingCredentialDescriptor>['metadata'],
    createQueryBuilder: jest.fn() as jest.MockedFunction<
      Repository<TeachingCredentialDescriptor>['createQueryBuilder']
    >,
  };

  const mockTeachingCredentialBasisRepo = {
    findOne: jest.fn() as jest.MockedFunction<
      Repository<TeachingCredentialBasisDescriptor>['findOne']
    >,
    target:
      TeachingCredentialBasisDescriptor as typeof TeachingCredentialBasisDescriptor,
    manager: {} as Repository<TeachingCredentialBasisDescriptor>['manager'],
    metadata: {} as Repository<TeachingCredentialBasisDescriptor>['metadata'],
    createQueryBuilder: jest.fn() as jest.MockedFunction<
      Repository<TeachingCredentialBasisDescriptor>['createQueryBuilder']
    >,
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CredentialService,
        {
          provide: CredentialRepository,
          useValue: {
            findAllBy: jest.fn(),
            findById: jest.fn(),
            findByCompositeKey: jest.fn(),
            updateByWhere: jest.fn(),
            resolveCredentialDescriptors: jest.fn(),
          },
        },
        {
          provide: ETagService,
          useValue: {
            validateIfMatch: jest.fn(),
          },
        },
        {
          provide: TransactionService,
          useValue: {
            executeInTransaction: jest.fn(),
            getRepository: jest.fn(),
          },
        },
        {
          provide: CustomLogger,
          useValue: {
            setContext: jest.fn(),
            log: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
          },
        },
        {
          provide: 'CACHE_MANAGER',
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
            reset: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CredentialService>(CredentialService);
    credentialRepository = module.get(CredentialRepository);
    etagService = module.get(ETagService);
    transactionService = module.get(TransactionService);
    logger = module.get(CustomLogger);

    jest.clearAllMocks();

    // Setup common transaction mock
    transactionService.executeInTransaction.mockImplementation(
      async (callback) => {
        return callback(mockQueryRunner);
      },
    );

    // Setup descriptor repository mocks - return mock objects that satisfy the Repository interface where needed
    transactionService.getRepository.mockImplementation(
      (entity: any, queryRunner: any): any => {
        switch (entity) {
          case StateAbbreviationDescriptor:
            return mockStateAbbrevRepo;
          case CredentialTypeDescriptor:
            return mockCredentialTypeRepo;
          case CredentialFieldDescriptor:
            return mockCredentialFieldRepo;
          case TeachingCredentialDescriptor:
            return mockTeachingCredentialRepo;
          case TeachingCredentialBasisDescriptor:
            return mockTeachingCredentialBasisRepo;
          default:
            return null;
        }
      },
    );

    // Setup default descriptor responses
    mockStateAbbrevRepo.findOne.mockResolvedValue({
      stateAbbreviationDescriptorId:
        CREDENTIAL_TEST_CONSTANTS.MOCK_DESCRIPTOR_IDS.STATE_ABBREVIATION,
    } as StateAbbreviationDescriptor);
    mockCredentialTypeRepo.findOne.mockResolvedValue({
      credentialTypeDescriptorId:
        CREDENTIAL_TEST_CONSTANTS.MOCK_DESCRIPTOR_IDS.CREDENTIAL_TYPE,
    } as CredentialTypeDescriptor);
    mockCredentialFieldRepo.findOne.mockResolvedValue({
      credentialFieldDescriptorId:
        CREDENTIAL_TEST_CONSTANTS.MOCK_DESCRIPTOR_IDS.CREDENTIAL_FIELD,
    } as CredentialFieldDescriptor);
    mockTeachingCredentialRepo.findOne.mockResolvedValue({
      teachingCredentialDescriptorId:
        CREDENTIAL_TEST_CONSTANTS.MOCK_DESCRIPTOR_IDS.TEACHING_CREDENTIAL,
    } as TeachingCredentialDescriptor);
    mockTeachingCredentialBasisRepo.findOne.mockResolvedValue({
      teachingCredentialBasisDescriptorId:
        CREDENTIAL_TEST_CONSTANTS.MOCK_DESCRIPTOR_IDS.TEACHING_CREDENTIAL_BASIS,
    } as TeachingCredentialBasisDescriptor);
  });

  describe('getAllCredentials', () => {
    it('should return empty array when no credentials found', async () => {
      credentialRepository.findAllBy.mockResolvedValue([[], 0]);

      const result = await service.getAllCredentials(
        mockQueryOptions,
        mockHttpResponse,
      );

      expect(result).toEqual([]);
      expect(credentialRepository.findAllBy).toHaveBeenCalledWith(
        mockQueryOptions,
        { status: Status.ACTIVE },
      );
    });

    it('should return credentials and set total count header when requested', async () => {
      const mockCredentials = generateMockCredentials(3);
      credentialRepository.findAllBy.mockResolvedValue([mockCredentials, 3]);

      const result = await service.getAllCredentials(
        { ...mockQueryOptions, totalCount: true },
        mockHttpResponse,
      );

      expect(result).toHaveLength(3);
      expect(mockHttpResponse.setHeader).toHaveBeenCalledWith(
        CREDENTIAL_CONSTANTS.HEADERS.TOTAL_COUNT,
        '3',
      );
      expect(result[0]).toHaveProperty('_etag');
    });
  });

  describe('getCredentialById', () => {
    it('should throw BadRequestError when id is empty', async () => {
      await expect(
        service.getCredentialById('', mockHttpResponse),
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw UnknownObjectError when credential not found', async () => {
      credentialRepository.findById.mockResolvedValue(null);

      await expect(
        service.getCredentialById(
          faker.string.uuid() as UUID,
          mockHttpResponse,
        ),
      ).rejects.toThrow(UnknownObjectError);
    });

    it('should return credential and set ETag header', async () => {
      const mockId = faker.string.uuid() as UUID;
      const mockCredential = generateMockCredential({ id: mockId });
      credentialRepository.findById.mockResolvedValue(mockCredential);

      const result = await service.getCredentialById(mockId, mockHttpResponse);

      expect(result).toBeDefined();
      expect(mockHttpResponse.setHeader).toHaveBeenCalledWith(
        CREDENTIAL_CONSTANTS.HEADERS.ETAG,
        expect.any(String),
      );
      expect(result.id).toBe(mockId);
    });
  });

  describe('createCredential', () => {
    const mockCreateDTO = generateMockCreateCredentialDTO();

    it('should throw BadRequestError when credential with same ID exists', async () => {
      credentialRepository.findById.mockResolvedValue(generateMockCredential());

      await expect(
        service.createCredential(mockCreateDTO, mockHttpResponse, ''),
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw BadRequestError when credential with same composite key exists', async () => {
      credentialRepository.findById.mockResolvedValue(null);
      credentialRepository.findByCompositeKey.mockResolvedValue(
        generateMockCredential(),
      );

      await expect(
        service.createCredential(mockCreateDTO, mockHttpResponse, ''),
      ).rejects.toThrow(BadRequestError);
    });

    it('should successfully create credential', async () => {
      credentialRepository.findById.mockResolvedValue(null);
      credentialRepository.findByCompositeKey.mockResolvedValue(null);

      const mockSavedCredential = generateMockCredential();
      const mockRepository = {
        save: jest
          .fn()
          .mockResolvedValue(mockSavedCredential) as jest.MockedFunction<
          Repository<Credential>['save']
        >,
        findOne: jest
          .fn()
          .mockResolvedValue(mockSavedCredential) as jest.MockedFunction<
          Repository<Credential>['findOne']
        >,
        target: Credential as typeof Credential,
        manager: {} as Repository<Credential>['manager'],
        metadata: {} as Repository<Credential>['metadata'],
        createQueryBuilder: jest.fn() as jest.MockedFunction<
          Repository<Credential>['createQueryBuilder']
        >,
      };

      (
        transactionService.getRepository as jest.MockedFunction<any>
      ).mockReturnValue(mockRepository);
      credentialRepository.resolveCredentialDescriptors.mockResolvedValue(
        mockSavedCredential,
      );

      await service.createCredential(mockCreateDTO, mockHttpResponse, '');

      expect(mockRepository.save).toHaveBeenCalled();
      expect(mockHttpResponse.setHeader).toHaveBeenCalledWith(
        CREDENTIAL_CONSTANTS.HEADERS.ETAG,
        expect.any(String),
      );
    });
  });

  describe('updateCredential', () => {
    const mockUpdateDTO = generateMockCreateCredentialDTO();

    it('should throw BadRequestError when if-match header is missing', async () => {
      await expect(
        service.updateCredential(
          faker.string.uuid() as UUID,
          mockUpdateDTO,
          '',
          mockHttpResponse,
        ),
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw UnknownObjectError when credential not found', async () => {
      credentialRepository.findById.mockResolvedValue(null);

      await expect(
        service.updateCredential(
          faker.string.uuid() as UUID,
          mockUpdateDTO,
          mockIfMatchHeader,
          mockHttpResponse,
        ),
      ).rejects.toThrow(UnknownObjectError);
    });

    it('should successfully update credential', async () => {
      const mockId = faker.string.uuid() as UUID;
      const mockExistingCredential = generateMockCredential({ id: mockId });
      credentialRepository.findById.mockResolvedValue(mockExistingCredential);
      credentialRepository.findByCompositeKey.mockResolvedValue(null);
      credentialRepository.updateByWhere.mockResolvedValue({
        affected: 1,
      } as any);

      await service.updateCredential(
        mockId,
        mockUpdateDTO,
        mockIfMatchHeader,
        mockHttpResponse,
      );

      expect(credentialRepository.updateByWhere).toHaveBeenCalled();
      expect(mockHttpResponse.setHeader).toHaveBeenCalledWith(
        CREDENTIAL_CONSTANTS.HEADERS.ETAG,
        expect.any(String),
      );
    });
  });

  describe('deleteCredential', () => {
    it('should throw BadRequestError when if-match header is missing', async () => {
      await expect(
        service.deleteCredential(faker.string.uuid() as UUID, ''),
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw UnknownObjectError when credential not found', async () => {
      credentialRepository.findById.mockResolvedValue(null);

      await expect(
        service.deleteCredential(
          faker.string.uuid() as UUID,
          mockIfMatchHeader,
        ),
      ).rejects.toThrow(UnknownObjectError);
    });

    it('should successfully delete credential', async () => {
      const mockId = faker.string.uuid() as UUID;
      const mockCredential = generateMockCredential({ id: mockId });
      credentialRepository.findById.mockResolvedValue(mockCredential);
      credentialRepository.updateByWhere.mockResolvedValue({
        affected: 1,
      } as any);

      await service.deleteCredential(mockId, mockIfMatchHeader);

      expect(credentialRepository.updateByWhere).toHaveBeenCalledWith(
        { id: mockId },
        expect.objectContaining({
          status: Status.DELETED,
          deletedate: expect.any(Date),
        }),
      );
    });
  });
});
