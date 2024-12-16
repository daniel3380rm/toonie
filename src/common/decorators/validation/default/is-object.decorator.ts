import { ValidationOptions, IsObject as isObject } from 'class-validator';

export function IsObject(options?: ValidationOptions): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    isObject({ ...options, message: 'validation.OBJECT' })(target, propertyKey);
  };
}
