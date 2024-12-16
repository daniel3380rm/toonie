import { Entity, Column } from 'typeorm';
import { ParentEntity } from '../../../../common/entities/base.entity';

@Entity('newsletters')
export class NewslettersEntity extends ParentEntity {
  @Column()
  email: string;
}
