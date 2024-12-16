import { NotEquals, ValidateIf } from 'class-validator';

export function IsNotNull(): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    ValidateIf((object, value) => value !== undefined)(target, propertyKey);
    NotEquals(null)(target, propertyKey);
  };
}
