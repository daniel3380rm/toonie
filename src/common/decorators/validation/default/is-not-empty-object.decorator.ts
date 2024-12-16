import { IsNotEmptyObject as isNotEmptyObject } from 'class-validator';

export function IsNotEmptyObject(
  params: {
    nullable?: boolean;
  },
  options?: { each?: boolean },
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    isNotEmptyObject(params, {
      ...options,
      message: 'validation.IS_NOT_EMPTY_OBJECT',
    })(target, propertyKey);
  };
}
