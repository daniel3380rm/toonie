import { Module } from '@nestjs/common';
import { FinancialFormService } from './services/financial-form.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialFormEntity } from './entities/financial-form.entity';
import { FinancialFormController } from './controllers/financial-form.controller';
import { RoleModule } from '../../domain-auth/authorization/roles/role.module';
import { PermissionModule } from '../../domain-auth/authorization/permission/permission.module';
import { FinancialFormAdminController } from './controllers/financial-form-admin.controller';
import { FinancialFormTimeModule } from '../financial-form-time/financial-form-time.module';
import { FinancialFormAdviserController } from './controllers/financial-form-adviser.controller';
import { UsersModule } from 'src/domains/domain-auth/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FinancialFormEntity]),
    RoleModule,
    PermissionModule,
    FinancialFormTimeModule,
    UsersModule,
  ],
  controllers: [
    FinancialFormController,
    FinancialFormAdviserController,
    FinancialFormAdminController,
  ],
  providers: [FinancialFormService],
  exports: [TypeOrmModule, FinancialFormService],
})
export class FinancialFormModule {}
