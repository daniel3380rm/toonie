import { MaxLength as maxLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export function MaxLength(length: number): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    maxLength(length, {
      message: i18nValidationMessage('validation.MAX_LENGTH'),
    })(target, propertyKey);
  };
}
