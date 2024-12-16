import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'src/common/decorators/validation/default';
import { IsArray, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { AnnualIncomeEnum } from '../enums/annual-income.enum';
import { JobPositionEnum } from '../enums/job-position.enum';
import { HealthStatusEnum } from '../enums/health-status.enum';
import { FamilyStatusEnum } from '../enums/family-status.enum';
import { AgeGroupEnum } from '../enums/age-group.enum';
import { InsuranceStatusEnum } from '../enums/insurance-status.enum';
import { InvestmentStatusEnum } from '../enums/investment-status.enum';
import { BankruptcyHistoryEnum } from '../enums/bankruptcy-history.enum';
import { SavingsRateEnum } from '../enums/savings-rate.enum';

export class CreateFinancialFormDto {
  @ApiProperty({
    description: 'Full name of the person (optional)',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  name: string;

  @ApiProperty({
    description: 'Email address of the person (optional)',
    example: 'johndoe@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({})
  email: string;

  @ApiProperty({
    description: 'Postal code of the person (optional)',
    example: '12345',
    required: false,
  })
  @IsOptional()
  postalCode: string;

  @ApiProperty({
    description: 'Phone number of the person (optional)',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({
    description: 'Annual income of the person',
    examples: AnnualIncomeEnum,
    enum: AnnualIncomeEnum,
  })
  @IsNotEmpty()
  @IsEnum(AnnualIncomeEnum)
  annualIncome: AnnualIncomeEnum;

  @ApiProperty({
    description: 'Job position of the person',
    example: JobPositionEnum['EMPLOYEE'],
    enum: JobPositionEnum,
  })
  @IsNotEmpty()
  @IsEnum(JobPositionEnum)
  jobPosition: JobPositionEnum;

  @ApiProperty({
    description: 'Health status of the person',
    example: HealthStatusEnum['HEALTHY'],
    enum: HealthStatusEnum,
  })
  @IsNotEmpty()
  @IsEnum(HealthStatusEnum)
  healthStatus: HealthStatusEnum;

  @ApiProperty({
    description: 'Family status of the person',
    example: FamilyStatusEnum['MARRIED'],
    enum: FamilyStatusEnum,
  })
  @IsNotEmpty()
  @IsEnum(FamilyStatusEnum)
  familyStatus: FamilyStatusEnum;

  @ApiProperty({
    description: 'Age group of the person',
    example: AgeGroupEnum['AGE_31_40'],
    enum: AgeGroupEnum,
  })
  @IsNotEmpty()
  @IsEnum(AgeGroupEnum)
  ageGroup: AgeGroupEnum;

  @ApiProperty({
    description: 'Insurance status of the person',
    example: InsuranceStatusEnum['HEALTH_INSURANCE'],
    enum: InsuranceStatusEnum,
  })
  @IsNotEmpty()
  @IsEnum(InsuranceStatusEnum)
  insuranceStatus: InsuranceStatusEnum;

  @ApiProperty({
    description: 'Investment status of the person',
    example: InvestmentStatusEnum['SOME_INVESTMENTS'],
    enum: InvestmentStatusEnum,
  })
  @IsNotEmpty()
  @IsEnum(InvestmentStatusEnum)
  investmentStatus: InvestmentStatusEnum;

  @ApiProperty({
    description: 'Bankruptcy history of the person',
    example: BankruptcyHistoryEnum['NO_HISTORY'],
    enum: BankruptcyHistoryEnum,
  })
  @IsNotEmpty()
  @IsEnum(BankruptcyHistoryEnum)
  bankruptcyHistory: BankruptcyHistoryEnum;

  @ApiProperty({
    description: 'Savings rate of the person',
    example: SavingsRateEnum['TEN_TO_20_PERCENT'],
    enum: SavingsRateEnum,
  })
  @IsNotEmpty()
  @IsEnum(SavingsRateEnum)
  savingsRate: SavingsRateEnum;

  @ApiProperty({
    description: 'Financial goals of the person (multiple choices)',
    example: ['Retirement Planning', 'Wealth Building'],
    isArray: true,
  })
  @IsNotEmpty()
  @IsArray()
  financialGoals: string[];

  @ApiProperty({
    description: 'Any other financial goal not covered by the list (optional)',
    example: 'Starting a business',
    required: false,
  })
  @IsOptional()
  otherFinancialGoal: string;

  @ApiProperty({
    description: 'time by the list (required)',
    required: true,
  })
  @IsOptional()
  financialFormTimeId: number;

  userId: number;
}
