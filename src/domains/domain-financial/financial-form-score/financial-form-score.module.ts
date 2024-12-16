import { Module } from '@nestjs/common';
import { FinancialFormScoreService } from './services/financial-form-score.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialFormScoreEntity } from './entities/financial-form-score.entity';
import { FinancialFormScoreController } from './controllers/financial-form-score.controller';
import { RoleModule } from '../../domain-auth/authorization/roles/role.module';
import { PermissionModule } from '../../domain-auth/authorization/permission/permission.module';
import { FinancialFormModule } from '../financial-form/financial-form.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FinancialFormScoreEntity]),
    RoleModule,
    PermissionModule,
    FinancialFormModule,
  ],
  controllers: [FinancialFormScoreController],
  providers: [FinancialFormScoreService],
  exports: [TypeOrmModule, FinancialFormScoreService],
})
export class FinancialFormScoreModule {}
