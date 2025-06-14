import { EqualOperator } from 'typeorm';

export type NonDeletedResourceCondition = {
  deletedAt: EqualOperator<null>;
};
