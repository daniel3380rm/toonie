import { Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserSessionsService } from './services/user-sessions.service';
import { SuccessResponse } from 'src/common/dto/response/success.response';
import { GetUser, IUser } from 'src/common/decorators';
import { IdDto } from 'src/common/dto/request/id.dto';
import { RevokeReason } from './enums/revoke-reason.enum';
import { GetUserAgents } from 'src/common/decorators/user-agent.decorator';

@ApiTags('Sessions')
@ApiBearerAuth()
@Controller({
  path: 'sessions',
  version: '1',
})
export class UsersSessionsController {
  constructor(private userSessionsService: UserSessionsService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessResponse,
  })
  @Get('')
  async findAll(@GetUser() user: IUser) {
    return new SuccessResponse({
      data: await this.userSessionsService.findManyByUserId(user.id),
    });
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessResponse,
  })
  @Post('session/:id/revoke')
  async revoke(
    @GetUser() user: IUser,
    @GetUserAgents() userAgents: string,
    @Param() { id }: IdDto,
  ) {
    return new SuccessResponse({
      data: await this.userSessionsService.revokeSession(
        user.id,
        userAgents,
        id,
        RevokeReason.LOGOUT,
      ),
    });
  }
}
