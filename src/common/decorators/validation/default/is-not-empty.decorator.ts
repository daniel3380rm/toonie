import { IsNotEmpty as isNotEmpty } from 'class-validator';

export function IsNotEmpty(): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    isNotEmpty({ message: 'validation.NOT_EMPTY' })(target, propertyKey);
  };
}
