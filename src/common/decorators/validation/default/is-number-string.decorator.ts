import { IsNumberString as isNumberString } from 'class-validator';

export function IsNumberString(options?: {
  each?: boolean;
}): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    isNumberString(
      {},
      Object.assign({ message: 'validation.NUMBER_STRING' }, options),
    )(target, propertyKey);
  };
}
