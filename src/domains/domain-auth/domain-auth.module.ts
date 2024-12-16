import { Module } from '@nestjs/common';
import { AuthenticationsModule } from './authentications/authentications.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { AuthGoogleModule } from './modules/auth-google/auth-google.module';
import { UserSessionModule } from './modules/user-sessions/user-sessions.module';
import { UsersModule } from './users/users.module';
import { AuthAppleModule } from './modules/auth-apple/auth-apple.module';

@Module({
  imports: [
    AuthenticationsModule,
    AuthorizationModule,
    AuthGoogleModule,
    AuthAppleModule,
    UserSessionModule,
    UsersModule,
  ],
})
export class DomainAuthModule {}
