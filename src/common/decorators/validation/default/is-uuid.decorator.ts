import { IsUUID as isUUID } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export function IsUUID(options?: { each?: boolean }): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    isUUID(
      4,
      Object.assign(
        {
          message: i18nValidationMessage('validation.PATTERN'),
        },
        options,
      ),
    )(target, propertyKey);
  };
}
