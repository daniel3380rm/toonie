import { Inject, Injectable } from '@nestjs/common';
import { MailService } from '@sendgrid/mail';

import {
  createTwilioClient,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
} from '../utils';

@Injectable()
export class TwilioSendgridService {
  private readonly twilioSdk: MailService;

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private options: typeof OPTIONS_TYPE,
  ) {
    this.twilioSdk = createTwilioClient(this.options);
  }

  public get client(): MailService {
    return this.twilioSdk;
  }
}
