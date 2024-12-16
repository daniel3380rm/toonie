import { Module } from '@nestjs/common';
import { FinancialFormTimeService } from './services/financial-form-time.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialFormTimeEntity } from './entities/financial-form-time.entity';
import { FinancialFormTimeController } from './controllers/financial-form-time.controller';
import { RoleModule } from '../../domain-auth/authorization/roles/role.module';
import { PermissionModule } from '../../domain-auth/authorization/permission/permission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FinancialFormTimeEntity]),
    RoleModule,
    PermissionModule,
  ],
  controllers: [FinancialFormTimeController],
  providers: [FinancialFormTimeService],
  exports: [TypeOrmModule, FinancialFormTimeService],
})
export class FinancialFormTimeModule {}
