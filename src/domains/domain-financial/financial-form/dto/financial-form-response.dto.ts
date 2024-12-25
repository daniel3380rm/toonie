import { BaseResponseWithActionDates } from 'src/common/dto/response/base-response-with-action-dates.dto';
import { AnnualIncomeEnum } from '../enums/annual-income.enum';
import { JobPositionEnum } from '../enums/job-position.enum';
import { HealthStatusEnum } from '../enums/health-status.enum';
import { FamilyStatusEnum } from '../enums/family-status.enum';
import { AgeGroupEnum } from '../enums/age-group.enum';
import { InsuranceStatusEnum } from '../enums/insurance-status.enum';
import { InvestmentStatusEnum } from '../enums/investment-status.enum';
import { BankruptcyHistoryEnum } from '../enums/bankruptcy-history.enum';
import { SavingsRateEnum } from '../enums/savings-rate.enum';
import { ApiResponseProperty } from '@nestjs/swagger';

export class FinancialFormResponseDto extends BaseResponseWithActionDates {
  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty()
  email: string;

  @ApiResponseProperty()
  postalCode: string;

  @ApiResponseProperty()
  phoneNumber: string;

  @ApiResponseProperty()
  annualIncome: AnnualIncomeEnum;

  @ApiResponseProperty()
  jobPosition: JobPositionEnum;

  @ApiResponseProperty()
  healthStatus: HealthStatusEnum;

  @ApiResponseProperty()
  familyStatus: FamilyStatusEnum;

  @ApiResponseProperty()
  ageGroup: AgeGroupEnum;

  @ApiResponseProperty()
  insuranceStatus: InsuranceStatusEnum;

  @ApiResponseProperty()
  investmentStatus: InvestmentStatusEnum;

  @ApiResponseProperty()
  bankruptcyHistory: BankruptcyHistoryEnum;

  @ApiResponseProperty()
  savingsRate: SavingsRateEnum;

  @ApiResponseProperty()
  financialGoals: string[];

  @ApiResponseProperty()
  otherFinancialGoal: string;

  @ApiResponseProperty()
  trackingCode: string;

  @ApiResponseProperty()
  jitsi: string;

  @ApiResponseProperty()
  financialFormTimeId: number;
  constructor(init?: Partial<FinancialFormResponseDto>) {
    super(init);
    this.name = init?.name;
    this.email = init?.email;
    this.postalCode = init?.postalCode;
    this.phoneNumber = init?.phoneNumber;
    this.annualIncome = init?.annualIncome;
    this.jobPosition = init?.jobPosition;
    this.healthStatus = init?.healthStatus;
    this.familyStatus = init?.familyStatus;
    this.ageGroup = init?.ageGroup;
    this.insuranceStatus = init?.insuranceStatus;
    this.investmentStatus = init?.investmentStatus;
    this.bankruptcyHistory = init?.bankruptcyHistory;
    this.savingsRate = init?.savingsRate;
    this.financialGoals = init?.financialGoals;
    this.otherFinancialGoal = init?.otherFinancialGoal;
    this.jitsi = init?.trackingCode;
    this.financialFormTimeId = init?.financialFormTimeId;
  }
}
