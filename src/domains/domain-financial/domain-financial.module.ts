import { Module } from '@nestjs/common';
import { FinancialFormModule } from './financial-form/financial-form.module';
import { FinancialFormTimeModule } from './financial-form-time/financial-form-time.module';
import { FinancialFormScoreModule } from './financial-form-score/financial-form-score.module';

@Module({
  imports: [
    FinancialFormTimeModule,
    FinancialFormModule,
    FinancialFormScoreModule,
  ],
})
export class DomainFinancialFormModule {}
