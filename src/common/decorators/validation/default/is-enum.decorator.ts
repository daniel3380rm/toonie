import { IsEnum as isEnum } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export function IsEnum(value: any): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    isEnum(value, {
      message: i18nValidationMessage('validation.ENUM', {
        enum: value.toString(),
      }),
    })(target, propertyKey);
  };
}
