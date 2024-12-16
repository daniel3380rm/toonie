import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { ParentEntity } from 'src/common/entities/base.entity';
import { UserEntity } from 'src/domains/domain-auth/users/entities/user.entity';
import { UserDeviceOperationSystemsEnum } from '../enums/user-device-operation-systems.enum';
import { UserDeviceInstallationSourcesEnum } from '../enums/user-device-installation-source.enum';

@Entity()
export class UserDevice extends ParentEntity {
  @OneToOne(() => UserEntity, { nullable: false })
  @JoinColumn()
  user: UserEntity;
  @Column()
  userId: number;

  @Column({
    type: 'enum',
    enum: UserDeviceOperationSystemsEnum,
    nullable: true,
  })
  operationSystem: UserDeviceOperationSystemsEnum;

  @Column({ nullable: true })
  systemVersion: string;

  @Column({ nullable: true })
  buildNumber: string;

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({
    type: 'enum',
    enum: UserDeviceInstallationSourcesEnum,
    nullable: true,
  })
  installationSource: UserDeviceInstallationSourcesEnum;

  @Column({ nullable: true })
  appVersion: string;
}
