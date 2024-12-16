import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { UserEntity } from '../../../../../domains/domain-auth/users/entities/user.entity';
import { Permission } from '../../permission/entities/permission.entity';
import { ActionDatesEntity } from 'src/common/entities/action-dates.entity';

@Entity('roles')
export class Roles extends ActionDatesEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  key?: string;

  @ManyToMany(() => UserEntity, (users) => users.roles)
  @JoinTable({ name: 'users_roles' })
  users: UserEntity[];

  @ManyToMany(() => Permission, (permissions) => permissions.roles)
  @JoinTable({
    name: 'roles_permissions',
  })
  permissions: Permission[];
}
