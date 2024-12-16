import { IsNotEmptyObject, ValidateNested } from 'class-validator';
import { ArrayMaxSize, ArrayMinSize, IsArray } from './default';

export function IsList(): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    IsArray()(target, propertyKey);
    IsNotEmptyObject(
      { nullable: false },
      { each: true, message: 'validation.NOT_EMPTY_OBJECT' },
    )(target, propertyKey);
    ValidateNested()(target, propertyKey);
    ArrayMinSize(0)(target, propertyKey);
    ArrayMaxSize(5)(target, propertyKey);
  };
}
