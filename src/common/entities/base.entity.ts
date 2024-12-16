import { Column } from 'typeorm';
import { ActionDatesEntity } from './action-dates.entity';

export class ParentEntity extends ActionDatesEntity {
  @Column({ default: true })
  isActive: boolean;
}
