import { Column, Entity, ManyToMany } from 'typeorm';
import { Roles } from '../../roles/entities/role.entity';
import { ParentEntity } from 'src/common/entities/base.entity';

@Entity('permissions')
export class Permission extends ParentEntity {
  @Column()
  accessKey: string;

  @Column()
  access: string;

  @ManyToMany(() => Roles, (role) => role.permissions)
  roles: Roles[];
}
