import {DatabaseError} from '../../../errors';
import {methodDecoratorFactory} from '../../../utils/method_decorator_factory';

export const HandleError = methodDecoratorFactory(err => {
  throw DatabaseError.from(err);
}, 'catch');
