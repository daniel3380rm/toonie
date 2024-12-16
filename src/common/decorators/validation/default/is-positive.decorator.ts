import { IsPositive as isPositive } from 'class-validator';

export function IsPositive(options?: { each?: boolean }): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    isPositive(Object.assign({ message: 'validation.POSITIVE' }, options))(
      target,
      propertyKey,
    );
  };
}
