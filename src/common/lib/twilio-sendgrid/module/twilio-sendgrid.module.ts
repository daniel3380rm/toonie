import { Module } from '@nestjs/common';

import { ConfigurableModuleClass } from '../utils';

import { TwilioSendgridService } from './twilio-sendgrid.service';

@Module({
  providers: [TwilioSendgridService],
  exports: [TwilioSendgridService],
})
export class TwilioSendgridModule extends ConfigurableModuleClass {}
