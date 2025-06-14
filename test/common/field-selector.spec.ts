import { ENTITY_QUERY_CONFIG } from 'src/common/constants/constants';
import { EntityType } from 'src/common/constants/enums';
import {
  InvalidSelectionFieldException,
  InvalidFilterFieldException,
} from 'src/common/errors/BadRequestError';
import { FieldSelector } from 'src/common/utils/fieldSelector.util';

// TODO : Move this file to the right folder once testing setup is done
describe('FieldSelector', () => {
  describe('validateFields', () => {
    it('should return all valid fields when fields parameter is undefined', () => {
      // Act
      const result = FieldSelector.validateFields(EntityType.Users, undefined);

      // Assert
      expect(result).toEqual(ENTITY_QUERY_CONFIG[EntityType.Users].validFields);
    });

    it('should throw InvalidSelectionFieldException when fields parameter is blank', () => {
      // Act & Assert
      expect(() => FieldSelector.validateFields(EntityType.Users, '')).toThrow(
        InvalidSelectionFieldException,
      );
      expect(() =>
        FieldSelector.validateFields(EntityType.Users, '  '),
      ).toThrow(InvalidSelectionFieldException);
    });

    it('should throw InvalidFilterFieldException when fields contain invalid characters', () => {
      // Act & Assert
      expect(() =>
        FieldSelector.validateFields(
          EntityType.Users,
          'username,email@invalid',
        ),
      ).toThrow(InvalidFilterFieldException);

      expect(() =>
        FieldSelector.validateFields(EntityType.Users, 'username,first-name'),
      ).toThrow(InvalidFilterFieldException);
    });

    it('should throw InvalidFilterFieldException when fields contain empty values between commas', () => {
      // Act & Assert
      expect(() =>
        FieldSelector.validateFields(EntityType.Users, 'username,,email'),
      ).toThrow(InvalidFilterFieldException);

      expect(() =>
        FieldSelector.validateFields(EntityType.Users, 'username, ,email'),
      ).toThrow(InvalidFilterFieldException);
    });

    it('should return all valid fields when any requested field does not exist', () => {
      // Act
      const result = FieldSelector.validateFields(
        EntityType.Users,
        'username,nonexistentField',
      );

      // Assert
      expect(result).toEqual(ENTITY_QUERY_CONFIG[EntityType.Users].validFields);
    });

    it('should remove duplicate fields and return unique list', () => {
      // Act
      const result = FieldSelector.validateFields(
        EntityType.Users,
        'username,email,username',
      );

      // Assert
      expect(result).toEqual(['username', 'email']);
    });

    it('should return all fields when all valid fields are requested', () => {
      // Arrange
      const allFields =
        ENTITY_QUERY_CONFIG[EntityType.Users].validFields.join(',');

      // Act
      const result = FieldSelector.validateFields(EntityType.Users, allFields);

      // Assert
      expect(result).toEqual(ENTITY_QUERY_CONFIG[EntityType.Users].validFields);
    });
  });

  describe('shapeData', () => {
    const mockUsers = [
      {
        sourcedId: '1',
        username: 'user1',
        email: 'user1@example.com',
        status: 'active',
      },
      {
        sourcedId: '2',
        username: 'user2',
        email: 'user2@example.com',
        status: 'active',
      },
    ];

    it('should return original data when all fields are requested', () => {
      // Arrange
      const allFields = ENTITY_QUERY_CONFIG[EntityType.Users].validFields;

      // Act
      const result = FieldSelector.shapeData(
        mockUsers,
        allFields,
        EntityType.Users,
      );

      // Assert
      expect(result).toEqual(mockUsers);
    });

    it('should return only requested fields', () => {
      // Arrange
      const requestedFields = ['username', 'email'];
      const expectedResult = [
        { username: 'user1', email: 'user1@example.com' },
        { username: 'user2', email: 'user2@example.com' },
      ];

      // Act
      const result = FieldSelector.shapeData(
        { users: mockUsers },
        requestedFields,
        EntityType.Users,
      );

      // Assert
      expect({ users: result }).toEqual({ users: expectedResult });
    });

    it('should handle non-existent fields in shape data gracefully', () => {
      // Arrange
      const requestedFields = ['username', 'nonexistentField'];
      const expectedResult = [{ username: 'user1' }, { username: 'user2' }];

      // Act
      const result = FieldSelector.shapeData(
        { users: mockUsers },
        requestedFields,
        EntityType.Users,
      );

      // Assert
      expect({ users: result }).toEqual({ users: expectedResult });
    });

    it('should return empty objects if no requested fields exist in data', () => {
      // Arrange
      const requestedFields = ['nonexistentField1', 'nonexistentField2'];
      const expectedResult = [{}, {}];

      // Act
      const result = FieldSelector.shapeData(
        { users: mockUsers },
        requestedFields,
        EntityType.Users,
      );

      // Assert
      expect({ users: result }).toEqual({ users: expectedResult });
    });
  });

  // Integration tests combining validateFields and shapeData
  describe('integration', () => {
    const mockUsers = [
      {
        sourcedId: '1',
        username: 'user1',
        email: 'user1@example.com',
        status: 'active',
      },
    ];

    it('should validate fields and shape data correctly', () => {
      // Arrange
      const fieldsParam = 'username,email';

      // Act
      const validatedFields = FieldSelector.validateFields(
        EntityType.Users,
        fieldsParam,
      );
      const result = FieldSelector.shapeData(
        { users: mockUsers },
        validatedFields,
        EntityType.Users,
      );

      // Assert
      expect(result).toEqual([
        { username: 'user1', email: 'user1@example.com' },
      ]);
    });

    it('should return all fields when invalid field is requested', () => {
      // Arrange
      const fieldsParam = 'username,invalidField';

      // Act
      const validatedFields = FieldSelector.validateFields(
        EntityType.Users,
        fieldsParam,
      );
      const result = FieldSelector.shapeData(
        { users: mockUsers },
        validatedFields,
        EntityType.Users,
      );

      // Assert
      expect(result).toEqual({ users: mockUsers });
    });
  });
});
