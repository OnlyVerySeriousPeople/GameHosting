import {DatabaseError} from '../errors';
import {methodDecoratorFactory} from '../utils';

export const HandleError = methodDecoratorFactory(err => {
  throw DatabaseError.from(err);
}, 'catch');
