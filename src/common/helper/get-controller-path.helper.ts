import { PATH_METADATA } from '@nestjs/common/constants';
import { ConfigService } from '@nestjs/config';

export const routePath = (
  configService: ConfigService,
  controllerClass: any,
  controllerMethod: any,
) => {
  let routePath = Reflect.getMetadata(PATH_METADATA, controllerClass);
  routePath += '/' + Reflect.getMetadata(PATH_METADATA, controllerMethod);
  return routePath;
};
