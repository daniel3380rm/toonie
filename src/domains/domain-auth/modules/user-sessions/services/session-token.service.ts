import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionTokens } from '../entities/session-tokens.entity';
import { TokenType } from '../enums/token-type.enum';
import { SessionTokensDto } from '../dto/session-tokens.dto';

@Injectable()
export class SessionTokensService {
  constructor(
    @InjectRepository(SessionTokens)
    private sessionTokenRepository: Repository<SessionTokens>,
  ) {}

  async createOrUpdate(sessionTokens: SessionTokensDto) {
    let token = await this.findOne(sessionTokens.sessionId, sessionTokens.type);
    if (!token) {
      token = await this.sessionTokenRepository.save(
        this.sessionTokenRepository.create(sessionTokens),
      );
    } else {
      token.value = sessionTokens.value;
      await token.save();
    }
    return token;
  }

  async findOne(sessionId: number, type: TokenType) {
    return await this.sessionTokenRepository.findOne({
      where: { sessionId, type },
    });
  }
}
