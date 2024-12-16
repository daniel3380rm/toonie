import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { I18nContext, I18nValidationException } from 'nestjs-i18n';
import {
  BaseErrorResponse,
  ErrorResponse,
} from '../dto/response/error-response.dto';
import { SharedErrors } from '../enums/shared-messages.enum';
import { Environments } from '../enums/environments.enum';
import { ConfigService } from '@nestjs/config';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    try {
      const i18n = I18nContext.current(host);
      const status = Number(exception.getStatus());
      const result = exception.getResponse() as
        | string
        | { message: string }
        | BaseErrorResponse;
      const env = this.configService.get('app.env');
      if (result instanceof ErrorResponse) {
        let message: string = i18n.t(
          result.message,
          env === Environments.TEST || env === Environments.DEVELOP
            ? { lang: 'debug' }
            : {},
        );
        if (typeof message === 'string' && result.metadata.variables) {
          Object.keys(result.metadata.variables).map((variable) => {
            message = message.replace(
              `{${variable}}`,
              result.metadata.variables[variable],
            );
          });
        }
        return response
          .status(status)
          .json(new ErrorResponse(String(message), status));
      }
      if (!(exception instanceof I18nValidationException)) {
        const message = typeof result === 'object' ? result.message : result;
        if (message.split('.').length > 1) {
          return response
            .status(status)
            .json(
              new ErrorResponse(
                i18n.t(
                  message,
                  env === Environments.TEST || env === Environments.DEVELOP
                    ? { lang: 'debug' }
                    : {},
                ),
                status,
              ),
            );
        } else {
          return response
            .status(status)
            .json(new ErrorResponse(message, status));
        }
      }
    } catch (err) {
      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new ErrorResponse(
            SharedErrors.INTERNAL_SERVER_ERROR,
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  }
}
