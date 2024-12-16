import { IsInt as isInt } from 'class-validator';

export function IsInt(options?: { each?: boolean }): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    isInt(Object.assign({ message: 'validation.INT' }, options))(
      target,
      propertyKey,
    );
  };
}
