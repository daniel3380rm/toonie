import { NotFoundException } from '@nestjs/common';
import { UsersProfileMessagesEnum } from './enums/users-profile-messages.enum';

export class ProfileNotFound extends NotFoundException {
  constructor() {
    super(UsersProfileMessagesEnum.NOT_FOUND);
  }
}
