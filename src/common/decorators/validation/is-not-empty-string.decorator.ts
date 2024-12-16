import { IsOptional } from 'class-validator';
import { IsNotEmpty, IsString } from './default';

export function CustomIsString(options?: {
  each?: boolean;
  optional: boolean;
}): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    IsString({ each: options ? options.each : false })(target, propertyKey);

    if (options && options.optional) IsOptional()(target, propertyKey);
    else IsNotEmpty()(target, propertyKey);
  };
}
