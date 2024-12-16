import { IsString as isString } from 'class-validator';

export function IsString(options?: { each?: boolean }): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    const each = (options && options.each) || false;
    isString({ each, message: 'validation.STRING' })(target, propertyKey);
  };
}
