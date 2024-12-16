import { ValidateNested } from 'class-validator';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmptyObject,
} from './default';

export function IsSort(): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    IsArray()(target, propertyKey);
    IsNotEmptyObject({ nullable: false }, { each: true })(target, propertyKey);
    ValidateNested()(target, propertyKey);
    ArrayMinSize(0)(target, propertyKey);
    ArrayMaxSize(5)(target, propertyKey);
  };
}
