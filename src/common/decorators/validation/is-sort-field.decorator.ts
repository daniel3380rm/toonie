import { ValidationConstraints } from 'src/common/constants/validation-constraints.const';
import { IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from './default';

export function IsSortField(validateEnum): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    MinLength(ValidationConstraints.minSortFieldLength)(target, propertyKey);
    MaxLength(ValidationConstraints.maxSortFieldLength)(target, propertyKey);
    IsString()(target, propertyKey);
    IsNotEmpty()(target, propertyKey);
    IsEnum(validateEnum)(target, propertyKey);
  };
}
