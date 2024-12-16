import { NotFoundException } from '@nestjs/common';
import { HttpExceptionOptions } from '@nestjs/common/exceptions/http.exception';

export class UsersProfileException {
  static notFound(
    objectOrError?: string | object | any,
    descriptionOrOptions?: string | HttpExceptionOptions,
  ) {
    throw new NotFoundException(objectOrError, descriptionOrOptions);
  }
}
