import { IsNotEmpty, IsString, Matches } from './default';

export function IsPassword(): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    IsString()(target, propertyKey);
    IsNotEmpty()(target, propertyKey);
    Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)(
      target,
      propertyKey,
    );
  };
}
