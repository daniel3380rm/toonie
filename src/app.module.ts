import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { IsExist, IsNotExist } from 'src/common/validators';
import { DomainAuthModule } from './domains/domain-auth/domain-auth.module';
import { DomainMemberModule } from './domains/domain-member/domain-member.module';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { join } from 'path';

import {
  appConfig,
  authConfig,
  databaseConfig,
  fileConfig,
  redisConfig,
  smsConfig,
  superAdminConfig,
  swaggerConfig,
  twilioConfig,
  twilioSendgridConfig,
} from './config';
import { DomainFinancialFormModule } from './domains/domain-financial/domain-financial.module';
import { CachingModule } from 'src/common/caching/caching.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { DomainPublicModule } from './domains/domain-public/domain-public.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        authConfig,
        databaseConfig,
        redisConfig,
        fileConfig,
        swaggerConfig,
        superAdminConfig,
        twilioConfig,
        twilioSendgridConfig,
        smsConfig,
      ],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options) => {
        return await new DataSource(options).initialize();
      },
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      fallbacks: {
        en: 'debug',
      },
      loaderOptions: {
        path: join(__dirname, '..', 'i18n'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
    ThrottlerModule.forRoot({
      ttl: 600,
      limit: 50,
    }),
    ScheduleModule.forRoot(),
    CachingModule,
    DomainAuthModule,
    DomainMemberModule,
    DomainFinancialFormModule,
    DomainPublicModule,
  ],
  providers: [
    IsExist,
    IsNotExist,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
