import { MailService } from '@sendgrid/mail';
import { OPTIONS_TYPE } from './twilio-sendgrid.module-definition';

export function createTwilioClient({
  apiKey,
}: typeof OPTIONS_TYPE): MailService {
  const service = new MailService();
  service.setApiKey(apiKey);
  return service;
}
