import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { ParentEntity } from 'src/common/entities/base.entity';
import { ItemStatusFinancialFormTime } from '../enums/item-status-financial-form-time.enum';
import { FinancialFormEntity } from '../../financial-form/entities/financial-form.entity';
import { UserEntity } from 'src/domains/domain-auth/users/entities/user.entity';

@Entity('financial_form_time')
export class FinancialFormTimeEntity extends ParentEntity {
  @Column({ default: new Date() })
  time: Date;

  @Column({ default: ItemStatusFinancialFormTime.Pending })
  status!: ItemStatusFinancialFormTime;

  // @Column({ nullable: true })
  // financialFormId: number;

  // @OneToOne(() => FinancialFormEntity)
  // @JoinColumn({ name: 'financialFormId' })
  // financialForm: FinancialFormEntity;

  @OneToOne(() => FinancialFormEntity, (form) => form.financialFormTime, {
    nullable: true,
  })
  financialForm: FinancialFormEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ nullable: false })
  userId: number;
}
