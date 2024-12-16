export interface ExtraConfiguration {
  isGlobal?: boolean;
}
export interface TwilioSendGridModuleOptions extends ExtraConfiguration {
  apiKey: string | undefined;
}
