import { IsOptional, IsPhoneNumber } from 'class-validator';
import { IsNotEmpty } from './default';

export function IsIRPhoneNumber(options?: {
  optional: boolean;
}): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    IsPhoneNumber('IR', { message: 'validation.PHONE_NUMBER' })(
      target,
      propertyKey,
    );

    if (options && options.optional) IsOptional()(target, propertyKey);
    else IsNotEmpty()(target, propertyKey);
  };
}
