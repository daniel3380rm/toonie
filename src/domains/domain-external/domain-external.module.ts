import { Module } from '@nestjs/common';
import { SmsModule } from './sms/sms.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [SmsModule, MailModule],
})
export class DomainExternalModule {}
