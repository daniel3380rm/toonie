import { Injectable } from '@nestjs/common';
import { SendSmsCodeDto } from './dto/create-confirm-code-sms.dto';
import { ConfigService } from '@nestjs/config';
import { TwilioService } from '../../../common/lib/twilio';

@Injectable()
export class SmsService {
  constructor(
    private readonly twilioService: TwilioService,
    private readonly configService: ConfigService,
  ) {}

  async sendConfirmCode({ code, phoneNumber }: SendSmsCodeDto) {
    const message =
      '\n' +
      'Hi,\n' +
      '\n' +
      `To finalize your registration, please verify your phone number using the following code: ${code}.` +
      '\n' +
      'Thank you,\n' +
      'Toonie\n';
    this.sendMessage(phoneNumber, message);
  }

  async sendForgetCode({ code, phoneNumber }: SendSmsCodeDto) {
    const message =
      '\n' +
      'Hi,\n' +
      '\n' +
      `To reset your password, please verify your phone number using the following code: ${code}.` +
      '\n' +
      'Thank you,\n' +
      'Toonie\n';
    this.sendMessage(phoneNumber, message);
  }

  async sendRegistrationMessage(phoneNumber: string) {
    const message =
      'Hi,\n' +
      'Welcome to Toonie! Your registration is complete, and we’re excited to have you in our community, where you can learn, earn, and trust.\n' +
      'If you have any questions, feel free to reach out.\n' +
      'Best regards,\n' +
      'Toonie';
    this.sendMessage(phoneNumber, message);
  }
  private sendMessage(phoneNumber: string, message: string) {
    this.twilioService.client.messages
      .create({
        body: message,
        to: phoneNumber,
        from: this.configService.get('twilio.fromNumber'), // From a valid Twilio number
      })
      .catch((err) => console.log(err));
  }
}