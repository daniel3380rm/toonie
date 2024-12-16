import { NestFactory, Reflector } from '@nestjs/core';
import { Logger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import validationOptions from './common/validation-options';
import { UserSessionsService } from './domains/domain-auth/modules/user-sessions/services/user-sessions.service';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AuthGuard } from './domains/domain-auth/authentications/guards/authentication.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService);
  const env = configService.get('app.env');

  app.enableShutdownHooks();
  app.setGlobalPrefix(configService.get('app.apiPrefix'), {
    exclude: ['/'],
  });
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(new I18nValidationPipe(validationOptions));

  app.useGlobalFilters(new HttpExceptionFilter(configService));

  app.useGlobalFilters(new I18nValidationExceptionFilter());

  const reflector = app.get(Reflector);
  const userSessionsService = app.get(UserSessionsService);

  app.useGlobalGuards(new AuthGuard(reflector, userSessionsService));

  // if (env !== 'production') {
  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API docs')
    .setVersion(configService.get('app.apiVersion'))
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(configService.get('swagger.url'), app, document);
  // }
  const nestLogger = new Logger('bootstrap', { timestamp: true });

  await app.listen(configService.get('app.port'));
  nestLogger.log(
    `Documentation available on path: http://localhost:${configService.get(
      'app.port',
    )}/${configService.get('swagger.url')}`,
  );
}
bootstrap();
