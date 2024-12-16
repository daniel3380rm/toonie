import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TwilioSendgridService } from '../../../common/lib/twilio-sendgrid';
import { MailContent } from '@sendgrid/helpers/classes/mail';

@Injectable()
export class MailService {
  constructor(
    private twilioSendGridService: TwilioSendgridService,
    private configService: ConfigService,
  ) {}

  async sendConfirmCode(email: string, code: string) {
    await this.sendEmail(email, 'd-68008c1f7b434065af8e7592eb73c2c7', {
      OTP_CODE: code,
      EMAIL_ADDRESS: email,
    });
  }

  async sendForgetCode(email: string, code: string) {
    await this.sendEmail(email, 'd-9b4bdb01c8ba4ebea6f92eb0d47239c4', {
      OTP_CODE: code,
      EMAIL_ADDRESS: email,
    });
  }

  async sendRegistrationMessage(email: string) {
    await this.sendEmail(email, 'd-bf436ae3d8fb4d3ab2ed1dac8b043e0c', {
      EMAIL_ADDRESS: email,
    });
  }

  private async sendEmail(
    email: string,
    templateId: string,
    dynamicTemplateData: { [key: string]: string },
  ) {
    await this.twilioSendGridService.client
      .send({
        to: email,
        from: this.configService.get('sendgrid.fromEmail'),
        dynamicTemplateData,
        templateId,
      })
      .catch((err) => console.log(err));
  }
}
