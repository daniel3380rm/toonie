import { IsBoolean as isBoolean } from 'class-validator';

export function IsBoolean(options?: { each?: boolean }): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    isBoolean(Object.assign({ message: 'validation.BOOLEAN' }, options))(
      target,
      propertyKey,
    );
  };
}
