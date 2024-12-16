import { ArrayMaxSize as arrayMaxSize } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export function ArrayMaxSize(length: number): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    arrayMaxSize(length, {
      message: i18nValidationMessage('validation.ARRAY_MAX_SIZE'),
    })(target, propertyKey);
  };
}
