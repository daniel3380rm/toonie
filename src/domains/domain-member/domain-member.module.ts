import { Module } from '@nestjs/common';
import { UserProfilesModule } from './user-profiles/user-profiles.module';

@Module({
  imports: [UserProfilesModule],
})
export class DomainMemberModule {}
