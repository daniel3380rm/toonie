## Getting Started

To use Twilio client we need to register module for example in app.module.ts

```typescript
import { TwilioSendgridModule } from '../../../common/lib/twilio';

@Module({
  imports: [
    TwilioSendgridModule.forRoot({
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
    }),
  ],
})
export class AppModule {}
```

If you are using the `@nestjs/config package` from nest, you can use the `ConfigModule` using the `registerAsync()` function to inject your environment variables like this in your custom module:

```typescript
import { TwilioSendgridModule } from '../../../common/lib/twilio';

@Module({
  imports: [
    TwilioSendgridModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (cfg: ConfigService) => ({
        accountSid: cfg.get('TWILIO_ACCOUNT_SID'),
        authToken: cfg.get('TWILIO_AUTH_TOKEN'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

Example usage in service.

```typescript
import { InjectTwilio, TwilioSendgridService } from 'nestjs-twilio';

@Injectable()
export class AppService {
  public constructor(private readonly twilioService: TwilioSendgridService) {}

  async sendSMS() {
    return this.twilioService.client.messages.create({
      body: 'SMS Body, sent to the phone!',
      from: TWILIO_PHONE_NUMBER,
      to: TARGET_PHONE_NUMBER,
    });
  }
}
```