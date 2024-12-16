import { Module } from '@nestjs/common';
import { UserProfilesService } from './services/user-profiles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfile } from './entities/profile.entity';
import { ProfilesController } from './controllers/profiles.controller';
import { AuthorizationModule } from '../../domain-auth/authorization/authorization.module';
import { UserSessionModule } from 'src/domains/domain-auth/modules/user-sessions/user-sessions.module';
import { ZonesModule } from 'src/domains/domain-public/zones/zones.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserProfile]),
    AuthorizationModule,
    UserSessionModule,
    ZonesModule,
  ],
  controllers: [ProfilesController],
  providers: [UserProfilesService],
  exports: [TypeOrmModule, UserProfilesService],
})
export class UserProfilesModule {}
