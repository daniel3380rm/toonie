import { Matches as matches } from 'class-validator';

export function Matches(
  pattern,
  options?: { each?: boolean },
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    matches(pattern, Object.assign({ message: 'validation.PATTERN' }, options))(
      target,
      propertyKey,
    );
  };
}
