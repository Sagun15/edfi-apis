import { faker } from '@faker-js/faker';
import { CreateCredentialDTO } from 'src/modules/credentials/dto/create-credential.dto';
import { Credential } from 'src/common/entities/credential.entity';
import { Status } from 'src/common/constants/enums';
import { CREDENTIAL_CONSTANTS } from 'src/modules/credentials/constants/credential.constants';
import { CredentialTypeDescriptor } from 'src/common/entities/descriptors/credential-type.descriptor';
import { CredentialFieldDescriptor } from 'src/common/entities/descriptors/credential-field.descriptor';
import { StateAbbreviationDescriptor } from 'src/common/entities/descriptors/state-abbreviation.descriptor';
import { TeachingCredentialDescriptor } from 'src/common/entities/descriptors/teaching-credential.descriptor';
import { TeachingCredentialBasisDescriptor } from 'src/common/entities/descriptors/teaching-credential-basis.descriptor';

/**
 * Generates a mock CreateCredentialDTO with random valid data
 * @param overrides - Optional overrides for the generated data
 * @returns CreateCredentialDTO with random valid data
 */
export const generateMockCreateCredentialDTO = (
  overrides?: Partial<CreateCredentialDTO>,
): CreateCredentialDTO => {
  const baseDTO: CreateCredentialDTO = {
    id: faker.string.uuid(),
    credentialIdentifier: faker.string.alphanumeric(10),
    stateOfIssueStateAbbreviationDescriptor: faker.number
      .int(CREDENTIAL_CONSTANTS.DESCRIPTOR_RANGES.STATE_ABBREVIATION)
      .toString(),
    credentialTypeDescriptor: faker.number
      .int(CREDENTIAL_CONSTANTS.DESCRIPTOR_RANGES.CREDENTIAL_TYPE)
      .toString(),
    credentialFieldDescriptor: faker.number
      .int(CREDENTIAL_CONSTANTS.DESCRIPTOR_RANGES.CREDENTIAL_FIELD)
      .toString(),
    teachingCredentialDescriptor: faker.number
      .int(CREDENTIAL_CONSTANTS.DESCRIPTOR_RANGES.TEACHING_CREDENTIAL)
      .toString(),
    teachingCredentialBasisDescriptor: faker.number
      .int(CREDENTIAL_CONSTANTS.DESCRIPTOR_RANGES.TEACHING_CREDENTIAL_BASIS)
      .toString(),
    namespace: CREDENTIAL_CONSTANTS.NAMESPACE,
    issuanceDate: faker.date.past().toISOString(),
    effectiveDate: faker.date.future().toISOString(),
    expirationDate: faker.date.future().toISOString(),
  };

  return { ...baseDTO, ...overrides };
};

/**
 * Generates a mock Credential entity with random valid data
 * @param overrides - Optional overrides for the generated data
 * @returns Credential entity with random valid data
 */
export const generateMockCredential = (
  overrides?: Partial<Credential>,
): Credential => {
  const baseCredential = new Credential();

  // Create descriptor objects
  const credentialTypeDescriptor = new CredentialTypeDescriptor();
  credentialTypeDescriptor.credentialTypeDescriptorId = faker.number.int(
    CREDENTIAL_CONSTANTS.DESCRIPTOR_RANGES.CREDENTIAL_TYPE,
  );

  const credentialFieldDescriptor = new CredentialFieldDescriptor();
  credentialFieldDescriptor.credentialFieldDescriptorId = faker.number.int(
    CREDENTIAL_CONSTANTS.DESCRIPTOR_RANGES.CREDENTIAL_FIELD,
  );

  const stateAbbreviationDescriptor = new StateAbbreviationDescriptor();
  stateAbbreviationDescriptor.stateAbbreviationDescriptorId = faker.number.int(
    CREDENTIAL_CONSTANTS.DESCRIPTOR_RANGES.STATE_ABBREVIATION,
  );

  const teachingCredentialDescriptor = new TeachingCredentialDescriptor();
  teachingCredentialDescriptor.teachingCredentialDescriptorId =
    faker.number.int(
      CREDENTIAL_CONSTANTS.DESCRIPTOR_RANGES.TEACHING_CREDENTIAL,
    );

  const teachingCredentialBasisDescriptor =
    new TeachingCredentialBasisDescriptor();
  teachingCredentialBasisDescriptor.teachingCredentialBasisDescriptorId =
    faker.number.int(
      CREDENTIAL_CONSTANTS.DESCRIPTOR_RANGES.TEACHING_CREDENTIAL_BASIS,
    );

  Object.assign(baseCredential, {
    id: faker.string.uuid(),
    credentialIdentifier: faker.string.alphanumeric(10),
    stateOfIssueStateAbbreviationDescriptor: stateAbbreviationDescriptor,
    credentialTypeDescriptor: credentialTypeDescriptor,
    credentialFieldDescriptor: credentialFieldDescriptor,
    teachingCredentialDescriptor: teachingCredentialDescriptor,
    teachingCredentialBasisDescriptor: teachingCredentialBasisDescriptor,
    namespace: CREDENTIAL_CONSTANTS.NAMESPACE,
    status: Status.ACTIVE,
    createdate: new Date(),
    lastmodifieddate: new Date(),
    issuanceDate: faker.date.past(),
    effectiveDate: faker.date.future(),
    expirationDate: faker.date.future(),
  });

  if (overrides) {
    Object.assign(baseCredential, overrides);
  }

  return baseCredential;
};

/**
 * Generates an array of mock credentials
 * @param count - Number of credentials to generate
 * @param overrides - Optional overrides for all generated credentials
 * @returns Array of Credential entities
 */
export const generateMockCredentials = (
  count: number,
  overrides?: Partial<Credential>,
): Credential[] => {
  return Array.from({ length: count }, () => generateMockCredential(overrides));
};

/**
 * Generates a mock credential response DTO
 * @param credential - The credential entity to generate the response for
 * @returns CredentialResponseDTO with random valid data
 */
export const generateMockCredentialResponseDTO = (credential: Credential) => {
  return {
    id: credential.id,
    credentialIdentifier: credential.credentialIdentifier,
    stateOfIssueStateAbbreviationDescriptor:
      credential.stateOfIssueStateAbbreviationDescriptor.stateAbbreviationDescriptorId.toString(),
    credentialTypeDescriptor:
      credential.credentialTypeDescriptor.credentialTypeDescriptorId.toString(),
    credentialFieldDescriptor:
      credential.credentialFieldDescriptor.credentialFieldDescriptorId.toString(),
    teachingCredentialDescriptor:
      credential.teachingCredentialDescriptor.teachingCredentialDescriptorId.toString(),
    teachingCredentialBasisDescriptor:
      credential.teachingCredentialBasisDescriptor.teachingCredentialBasisDescriptorId.toString(),
    namespace: credential.namespace,
    issuanceDate: credential.issuanceDate.toISOString(),
    effectiveDate: credential.effectiveDate.toISOString(),
    expirationDate: credential.expirationDate.toISOString(),
    _etag: `"${credential.lastmodifieddate.toISOString()}"`,
  };
};
