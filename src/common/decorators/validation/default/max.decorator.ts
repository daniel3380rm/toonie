import { Max as max } from 'class-validator';

export function Max(
  value: number,
  options?: { each?: boolean },
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    max(value, Object.assign({ message: 'validation.MAX' }, options))(
      target,
      propertyKey,
    );
  };
}
