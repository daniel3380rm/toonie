import { IsOptional, Length } from 'class-validator';
import { IsNotEmpty } from './default';
import { i18nValidationMessage } from 'nestjs-i18n';

export function ExactLength(
  length: number,
  options?: {
    optional: boolean;
  },
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    Length(length, length, {
      message: i18nValidationMessage('validation.LENGTH'),
    })(target, propertyKey);
    if (options && options.optional) IsOptional()(target, propertyKey);
    else IsNotEmpty()(target, propertyKey);
  };
}
