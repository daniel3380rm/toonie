import { IsArray as isArray } from 'class-validator';

export function IsArray(): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    isArray({ message: 'validation.ARRAY' })(target, propertyKey);
  };
}
