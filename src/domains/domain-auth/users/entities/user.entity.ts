import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { ParentEntity } from 'src/common/entities/base.entity';
import { compare, hash } from 'bcrypt';
import { Roles } from '../../authorization/roles/entities/role.entity';
import { appConfig } from 'src/config';
import { SessionTokens } from '../../modules/user-sessions/entities/session-tokens.entity';
import { UserSessionsEntity } from '../../modules/user-sessions/entities/user-sessions.entity';
import { User2FAType } from '../enums/user-2fa-type.enum';
import { UserProfile } from 'src/domains/domain-member/user-profiles/entities/profile.entity';

@Entity('user')
export class UserEntity extends ParentEntity {
  @Column({ unique: true, nullable: true })
  email: string | null;

  @Column({ unique: true, nullable: true, length: 50 })
  phoneNumber: string;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ nullable: true })
  password: string;

  @Column()
  provider: string;

  @Column({ nullable: true })
  twoFASecret: string;

  @Column({
    nullable: true,
    default: User2FAType.NONE,
    type: 'enum',
    enum: User2FAType,
  })
  twoFAType: User2FAType;

  @Index()
  @Column({ nullable: true })
  socialId: string | null;

  @Column({ nullable: true })
  referralCode: string;

  @OneToOne(() => UserEntity, (user) => user.profile)
  @JoinColumn({ name: 'referralUserId' })
  referralUser: UserEntity;
  @Column({ nullable: true })
  referralUserId: number;

  @ManyToMany(() => Roles, (roles) => roles.users, {
    eager: true,
  })
  roles: Roles[];

  @OneToMany(() => UserSessionsEntity, (session) => session.user)
  sessions: UserSessionsEntity[];

  @OneToMany(() => SessionTokens, (token) => token.user)
  tokens: SessionTokens[];

  @OneToOne(() => UserProfile, (profile) => profile.user)
  profile: UserProfile;

  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @Column({ type: 'boolean', default: false })
  isAdvisor: boolean;

  private tempPassword: string;
  @AfterLoad()
  private loadTempPassword(): void {
    this.tempPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    if (this.password && this.tempPassword !== this.password) {
      this.password = await hash(this.password, appConfig().hashSaltRounds);
    }
  }

  async isPasswordCorrect(rawPassword: string): Promise<boolean> {
    return await compare(rawPassword, this.password);
  }
}
