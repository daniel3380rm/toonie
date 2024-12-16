import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TypeOrmConfigService } from '../typeorm-config.service';
import { UserSeedModule } from './users/user-seed.module';
import {
  appConfig,
  authConfig,
  databaseConfig,
  fileConfig,
  twilioConfig,
  redisConfig,
  smsConfig,
  superAdminConfig,
  swaggerConfig,
} from 'src/config';

@Module({
  imports: [
    UserSeedModule,

    // TestModule,
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
  ],
})
export class SeedModule {}
