import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ParentEntity } from 'src/common/entities/base.entity';
import { TokenType } from '../enums/token-type.enum';
import { UserEntity } from '../../../users/entities/user.entity';
import { UserSessionsEntity } from './user-sessions.entity';

@Entity('session_tokens')
export class SessionTokens extends ParentEntity {
  @ManyToOne(() => UserEntity, (user) => user.tokens)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
  @Column()
  userId: number;

  @ManyToOne(() => UserSessionsEntity, (session) => session.tokens)
  @JoinColumn({ name: 'sessionId' })
  session: UserSessionsEntity;
  @Column()
  sessionId: number;

  @Column()
  value: string;

  @Column({ type: 'enum', enum: TokenType })
  type: TokenType;
}
