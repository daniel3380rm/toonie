import { IsEmail as isEmail } from 'class-validator';

export function IsEmail(options: { each?: boolean }): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    const each = (options && options.each) || false;
    isEmail({}, { message: 'validation.INVALID_EMAIL' })(target, propertyKey);
  };
}
