import { ParentEntity } from 'src/common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { RevokeReason } from '../enums/revoke-reason.enum';
import { UserEntity } from '../../../users/entities/user.entity';
import { SessionTokens } from './session-tokens.entity';

@Entity('user_sessions')
export class UserSessionsEntity extends ParentEntity {
  @ManyToOne(() => UserEntity, (user) => user.sessions)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
  @Column()
  userId: number;

  @OneToMany(() => SessionTokens, (token) => token.session)
  tokens: SessionTokens[];

  @Column()
  device: string;

  @Column()
  hosts: string;

  @Column()
  agents: string;

  @Column({ nullable: true })
  loggedInAt: Date;

  @Column({ type: 'enum', enum: RevokeReason, nullable: true })
  revokeReason?: RevokeReason;

  @Column({ nullable: true })
  revokeAt?: Date;

  @Column({ nullable: true })
  expiredAt?: Date;
}
