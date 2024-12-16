import { UserEntity } from '../../../domain-auth/users/entities/user.entity';
import { ParentEntity } from 'src/common/entities/base.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { GenderEnum } from '../../enums/gender.enum';

@Entity('user_profiles')
export class UserProfile extends ParentEntity {
  @OneToOne(() => UserEntity, (user) => user.profile)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
  @Column()
  userId: number;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({
    type: 'enum',
    enum: GenderEnum,
    nullable: true,
  })
  gender: GenderEnum;

  @Column({ nullable: true })
  birthDate: Date;

  @Column({ nullable: true })
  cityId: number;

  @Column({ nullable: true })
  addressOne: string;

  @Column({ nullable: true })
  addressTwo: string;

  @Column({ nullable: true })
  occupation: string;

  @Column({ nullable: true })
  postalCode: string;

  @Column({ nullable: true })
  avatar?: string | null;
}
