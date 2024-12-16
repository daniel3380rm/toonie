import { ArrayMinSize as arrayMinSize } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export function ArrayMinSize(length: number): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    arrayMinSize(length, {
      message: i18nValidationMessage('validation.ARRAY_MIN_SIZE'),
    })(target, propertyKey);
  };
}
