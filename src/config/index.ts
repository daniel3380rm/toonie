import { multiInheritance } from 'src/common/common/multi-inheritance.util';
import { SwaggerEnvSchema, swaggerConfig } from './swagger.config';
import { AppEnvSchema, appConfig } from './app.config';
import { AuthEnvSchema, authConfig } from './auth.config';
import { DatabaseEnvSchema, databaseConfig } from './database.config';
import { FileEnvSchema, fileConfig } from './file.config';
import { RedisEnvSchema, redisConfig } from './redis.config';
import { SuperAdminEnvSchema, superAdminConfig } from './super-admin.config';
import { RecaptchaEnvSchema, recaptchaConfig } from './recaptcha.config';
import { TwilioEnvSchema, twilioConfig } from './twilio.config';
import { SmsEnvSchema, smsConfig } from './sms.config';
import {
  twilioSendgridConfig,
  TwilioSendgridEnvSchema,
} from './twilio-sengrid.config';

class EnvironmentSchema {}
multiInheritance(EnvironmentSchema, [
  AuthEnvSchema,
  FileEnvSchema,
  AppEnvSchema,
  SwaggerEnvSchema,
  RedisEnvSchema,
  DatabaseEnvSchema,
  SuperAdminEnvSchema,
  RecaptchaEnvSchema,
  TwilioEnvSchema,
  TwilioSendgridEnvSchema,
  SmsEnvSchema,
]);

export {
  EnvironmentSchema,
  appConfig,
  authConfig,
  fileConfig,
  swaggerConfig,
  redisConfig,
  databaseConfig,
  superAdminConfig,
  recaptchaConfig,
  twilioConfig,
  twilioSendgridConfig,
  smsConfig,
};
