import { IsOptional } from 'class-validator';
import { IsNotEmpty, IsString, Matches } from './default';

export function IsObjectId(options?: {
  optional: boolean;
  each?: boolean;
}): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    const each = (options && options.each) || false;

    IsString(options)(target, propertyKey);
    Matches(/^[a-f\d]{24}$/i, {
      each,
    })(target, propertyKey);

    if (options && options.optional) IsOptional()(target, propertyKey);
    else IsNotEmpty()(target, propertyKey);
  };
}
