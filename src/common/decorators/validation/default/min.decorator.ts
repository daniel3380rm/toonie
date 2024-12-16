import { Min as min } from 'class-validator';

export function Min(
  value: number,
  options?: { each?: boolean },
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    min(value, Object.assign({ message: 'validation.MIN' }, options))(
      target,
      propertyKey,
    );
  };
}
