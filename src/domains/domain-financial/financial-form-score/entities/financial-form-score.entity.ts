import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { ParentEntity } from 'src/common/entities/base.entity';
import { FinancialFormEntity } from '../../financial-form/entities/financial-form.entity';
import { UserEntity } from 'src/domains/domain-auth/users/entities/user.entity';

@Entity('financial_form_score')
export class FinancialFormScoreEntity extends ParentEntity {
  @Column({ nullable: false })
  score: number;

  @Column({ nullable: false })
  financialFormId: number;

  @OneToOne(() => FinancialFormEntity)
  @JoinColumn({ name: 'financialFormId' })
  financialForm: FinancialFormEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ nullable: false })
  userId: number;
}
