import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UserErrors } from '../enums/user-messages.enum';

export class UserNotFound extends NotFoundException {
  constructor() {
    super(UserErrors.NOT_FOUND);
  }
}

export class UserNotActive extends ForbiddenException {
  constructor() {
    super(UserErrors.IS_NOT_ACTIVE);
  }
}
