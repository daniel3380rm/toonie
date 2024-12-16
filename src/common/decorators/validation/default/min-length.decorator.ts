import { MinLength as minLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export function MinLength(length: number): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    minLength(length, {
      message: i18nValidationMessage('validation.MIN_LENGTH'),
    })(target, propertyKey);
  };
}
