import { IsOptional } from 'class-validator';
import { ValidationConstraints } from 'src/common/constants/validation-constraints.const';
import { IsInt, IsNotEmpty, IsPositive, Max } from './default';

export function IsPositiveInteger(
  max = ValidationConstraints.maxIntegerValue,
  options?: { optional: boolean },
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    IsInt()(target, propertyKey);
    IsPositive()(target, propertyKey);
    Max(max)(target, propertyKey);

    if (options && options.optional) IsOptional()(target, propertyKey);
    else IsNotEmpty()(target, propertyKey);
  };
}
