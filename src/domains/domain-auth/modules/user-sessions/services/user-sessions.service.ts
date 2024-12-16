import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserSessionsEntity } from '../entities/user-sessions.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, IsNull, Repository } from 'typeorm';
import { SessionTokensService } from './session-token.service';
import { RevokeReason } from '../enums/revoke-reason.enum';
import { ValidateUserSessionsDto } from '../dto/validate-user-sessions.dto';
import * as DeviceDetector from 'device-detector-js';
import { UpdateUserSessionsDto } from '../dto/update-user-sessions.dto';
import { CreateUserSessionsDto } from '../dto/create-user-sessions.dto';
import { UserSessionsIsExistsDto } from '../dto/user-sessions-is-exists.dto';
import { UserSessionResponseDto } from '../dto/user-sessions-response.dto';
import { EntityCondition } from 'src/common/types/entity-condition.type';
import { UserSessionsErrors } from '../enums/user-sessions-messages.enum';
import { UserSessionsInfoDto } from '../dto/user-sessions-info.dto';

@Injectable()
export class UserSessionsService {
  private deviceDetector: DeviceDetector;
  constructor(
    @InjectRepository(UserSessionsEntity)
    private userSessionsRepository: Repository<UserSessionsEntity>,
    private sessionTokensService: SessionTokensService,
  ) {
    this.deviceDetector = new DeviceDetector();
  }

  async create(session: CreateUserSessionsDto) {
    const agents = this.deviceDetector.parse(session.agents);
    const device = [
      agents.device.type,
      agents.device.brand,
      agents.device.model,
    ].join('|');

    let thisSession = await this.findOne({
      userId: session.userId,
      hosts: session.hosts,
      agents: session.agents,
      device,
    });

    if (!thisSession) {
      thisSession = await this.userSessionsRepository.save(
        this.userSessionsRepository.create({
          userId: session.userId,
          hosts: session.hosts,
          agents: session.agents,
          device,
        }),
      );
    }
    session.tokens.map((tokenItem) => {
      this.sessionTokensService.createOrUpdate({
        userId: session.userId,
        sessionId: thisSession.id,
        value: tokenItem.token,
        type: tokenItem.tokenType,
      });
    });

    return thisSession;
  }

  async isExist(session: UserSessionsIsExistsDto): Promise<UserSessionsEntity> {
    const agents = this.deviceDetector.parse(session.agents);
    const device = [
      agents.device.type,
      agents.device.brand,
      agents.device.model,
    ].join('|');

    return await this.findOne({
      userId: session.userId,
      hosts: session.hosts,
      agents: session.agents,
      device,
    });
  }

  async findOneById(id: number) {
    return await this.findOne({
      id,
    });
  }

  async findOneByTokenAndUserId(rawToken: string) {
    return await this.findOne({
      tokens: { value: rawToken },
    });
  }

  async findOneByUserAgentAndUserId(userId: number, userAgents: string) {
    return await this.findOne({
      userId,
      agents: userAgents,
    });
  }

  async findOneWithSessionInfo(
    session: UserSessionsInfoDto,
  ): Promise<UserSessionsEntity> {
    return await this.findOne(
      {
        userId: session.userId,
        tokens: { value: Equal(session.token) },
        device: session.device,
        hosts: session.hosts,
      },
      ['tokens'],
    );
  }

  async findManyByUserId(userId: number) {
    const result = await this.userSessionsRepository.find({
      where: { userId, expiredAt: IsNull(), revokeAt: IsNull() },
      order: { updatedAt: 'DESC' },
    });
    return result.map((session) => new UserSessionResponseDto(session));
  }

  async validateSession(
    session: ValidateUserSessionsDto,
  ): Promise<UserSessionsEntity> {
    const thisSession = await this.findOne(
      {
        userId: session.userId,
        tokens: { value: Equal(session.token) },
        device: session.device,
        hosts: session.hosts,
      },
      ['tokens'],
    );

    return thisSession;
  }

  async revokeSession(
    userId: number,
    userAgents: string,
    sessionId: number,
    revokeReason: RevokeReason,
  ) {
    const userSession = await this.findOne({
      userId,
      agents: userAgents,
    });

    const thisSession = await this.findOne({
      userId,
      id: sessionId,
    });

    if (!thisSession || userSession.id === thisSession.id)
      throw new ForbiddenException(UserSessionsErrors.UNABLE_TO_REVOKE);

    const difference = userSession.createdAt.getTime() - new Date().getTime();

    const diffDays = Math.abs(difference / (24 * 60 * 60 * 1000));

    if (diffDays < 14)
      throw new ForbiddenException(UserSessionsErrors.UNABLE_TO_REVOKE);

    return await this.userSessionsRepository.update(
      { id: thisSession.id },
      {
        revokeReason,
        revokeAt: new Date(),
      },
    );
  }

  async updateLastLoginById(sessionId: number) {
    return await this.userSessionsRepository.update(
      {
        id: sessionId,
      },
      {
        loggedInAt: new Date(),
      },
    );
  }

  async update(sessionId: number, session: UpdateUserSessionsDto) {
    let device: string = undefined;

    if (session.agents) {
      const agents = this.deviceDetector.parse(session.agents);
      device = [
        agents.device.type,
        agents.device.brand,
        agents.device.model,
      ].join('|');
    }

    const thisSession = await this.userSessionsRepository.save({
      id: sessionId,
      userId: session.userId,
      hosts: session.hosts,
      agents: session.agents,
      device,
    });

    session.tokens.map((tokenItem) => {
      this.sessionTokensService.createOrUpdate({
        userId: session.userId,
        sessionId: thisSession.id,
        value: tokenItem.token,
        type: tokenItem.tokenType,
      });
    });

    return thisSession;
  }

  async findOne(
    field: EntityCondition<UserSessionsEntity>,
    relations?: string[],
  ) {
    return await this.userSessionsRepository.findOne({
      relations,
      where: {
        ...field,
        expiredAt: IsNull(),
        revokeAt: IsNull(),
      },
    });
  }
}
