import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionTokens } from './entities/session-tokens.entity';
import { UserSessionsEntity } from './entities/user-sessions.entity';
import { UserSessionsService } from './services/user-sessions.service';
import { SessionTokensService } from './services/session-token.service';
import { UsersSessionsController } from './user-sessions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserSessionsEntity, SessionTokens])],
  providers: [UserSessionsService, SessionTokensService],
  controllers: [UsersSessionsController],
  exports: [UserSessionsService, SessionTokensService],
})
export class UserSessionModule {}
