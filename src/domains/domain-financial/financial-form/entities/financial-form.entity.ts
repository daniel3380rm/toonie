import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { ParentEntity } from 'src/common/entities/base.entity';
import { generateTrackingCode } from 'src/common/helper';
import { UserEntity } from 'src/domains/domain-auth/users/entities/user.entity';
import { SavingsRateEnum } from '../enums/savings-rate.enum';
import { AnnualIncomeEnum } from '../enums/annual-income.enum';
import { JobPositionEnum } from '../enums/job-position.enum';
import { HealthStatusEnum } from '../enums/health-status.enum';
import { FamilyStatusEnum } from '../enums/family-status.enum';
import { AgeGroupEnum } from '../enums/age-group.enum';
import { InsuranceStatusEnum } from '../enums/insurance-status.enum';
import { InvestmentStatusEnum } from '../enums/investment-status.enum';
import { BankruptcyHistoryEnum } from '../enums/bankruptcy-history.enum';
import { FinancialFormTimeEntity } from '../../financial-form-time/entities/financial-form-time.entity';
import { ItemStatusFinancialFormTime } from '../enums/item-status-financial-form-time.enum';

@Entity('financial_form')
export class FinancialFormEntity extends ParentEntity {
  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  postalCode: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ type: 'enum', enum: AnnualIncomeEnum })
  annualIncome: AnnualIncomeEnum;

  @Column({ type: 'enum', enum: JobPositionEnum })
  jobPosition: JobPositionEnum;

  @Column({ type: 'enum', enum: HealthStatusEnum })
  healthStatus: HealthStatusEnum;

  @Column({ type: 'enum', enum: FamilyStatusEnum })
  familyStatus: FamilyStatusEnum;

  @Column({ type: 'enum', enum: AgeGroupEnum })
  ageGroup: AgeGroupEnum;

  @Column({ type: 'enum', enum: InsuranceStatusEnum })
  insuranceStatus: InsuranceStatusEnum;

  @Column({ type: 'enum', enum: InvestmentStatusEnum })
  investmentStatus: InvestmentStatusEnum;

  @Column({ type: 'enum', enum: BankruptcyHistoryEnum })
  bankruptcyHistory: BankruptcyHistoryEnum;

  @Column({ type: 'enum', enum: SavingsRateEnum })
  savingsRate: SavingsRateEnum;

  @Column('simple-array')
  financialGoals: string[];

  @Column({ nullable: true })
  otherFinancialGoal: string;

  @Column({ default: ItemStatusFinancialFormTime.Pending })
  status!: ItemStatusFinancialFormTime;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ nullable: true })
  userId: number;

  @Column({ nullable: true })
  adviserId: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'adviserId' })
  adviser: UserEntity;

  @Column({ default: '' })
  trackingCode: string;

  @Column({ nullable: true })
  financialFormTimeId: number;

  @OneToOne(
    () => FinancialFormTimeEntity,
    (formTime) => formTime.financialForm,
    {
      nullable: true,
      onDelete: 'SET NULL', // یا 'CASCADE' بسته به نیاز شما
    },
  )
  @JoinColumn({ name: 'financialFormTimeId' })
  financialFormTime: FinancialFormTimeEntity;

  @BeforeInsert()
  async setTrackingCode() {
    this.trackingCode = generateTrackingCode();
  }
}
