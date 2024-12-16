import { ConfigurableModuleBuilder } from '@nestjs/common';

import {
  ExtraConfiguration,
  TwilioSendGridModuleOptions,
} from './twilio-sendgrid.interface';

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<TwilioSendGridModuleOptions>()
  .setExtras<ExtraConfiguration>({ isGlobal: false }, (definition, extras) => ({
    ...definition,
    global: extras.isGlobal,
  }))
  .setClassMethodName('forRoot')
  .build();
