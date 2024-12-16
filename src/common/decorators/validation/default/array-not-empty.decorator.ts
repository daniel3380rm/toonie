import { ArrayNotEmpty as arrayNotEmpty } from 'class-validator';

export function ArrayNotEmpty(): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    arrayNotEmpty({ message: 'validation.NOT_EMPTY' })(target, propertyKey);
  };
}
