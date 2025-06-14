import { FieldParser } from '../utils/fieldParser.util';
import { EntityType } from './enums';

export const ENTITY_QUERY_FIELD_MAPPING: Record<
  EntityType,
  Record<string, string>
> = {
  [EntityType.Student]: {
    // TODO : Map all the fields from the data model here and use it in the field selector util class 
    // Example: givenName: `${Users.name}.${FieldParser.getPropertyField<Users>('givenName')}`,
  },
  [EntityType.CourseOffering]: undefined
};
