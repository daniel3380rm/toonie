import { Controller, Get, Post, Body, Patch } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { GetUser } from 'src/common/decorators';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { ProfileDto } from '../dto/profile.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { ProfileRequired } from '../profile-required.decorator';
import { UserProfilesService } from '../services/user-profiles.service';
import { UserEntity } from '../../../domain-auth/users/entities/user.entity';
import { SuccessResponse } from 'src/common/dto/response/success.response';
import { GetUserAgents } from 'src/common/decorators/user-agent.decorator';

@ApiTags('Profiles')
@ApiBearerAuth()
@Controller({
  path: 'user/profiles',
  version: '1',
})
export class ProfilesController {
  constructor(private readonly profilesService: UserProfilesService) {}

  @Post()
  public async create(
    @Body() createProfileDto: CreateProfileDto,
    @GetUser() user: UserEntity,
    @GetUserAgents() userAgents: string,
  ) {
    const result = await this.profilesService.initializeProfile(
      user,
      userAgents,
      createProfileDto,
    );

    return new SuccessResponse({ data: result });
  }

  @ApiOperation({ summary: 'Get current user profile' })
  @ProfileRequired()
  @Get()
  async getCurrent(@GetUser() { id }) {
    const profileFound = await this.profilesService.findByUserIdWithUser(
      id,
      true,
    );
    return new SuccessResponse({ data: profileFound });
  }

  @Patch()
  @ProfileRequired()
  async update(@GetUser() { id }, @Body() updateProfileDto: UpdateProfileDto) {
    await this.profilesService.updateByUserId(id, updateProfileDto);
    return new SuccessResponse({ data: {} });
  }
}
