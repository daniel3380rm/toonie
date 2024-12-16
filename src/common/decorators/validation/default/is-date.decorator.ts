import { IsDate as isDate } from 'class-validator';

export function IsDate(options?: { each?: boolean }): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    isDate(Object.assign({ message: 'validation.DATE' }, options))(
      target,
      propertyKey,
    );
  };
}
