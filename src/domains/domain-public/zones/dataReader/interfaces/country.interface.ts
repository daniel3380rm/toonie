import { BaseZoneInterface } from './base-zone.interface';

export interface CountryInterface extends BaseZoneInterface {
  iso3: string;
  iso2: string;
  phoneCode: string;
  currency: string;
  emoji: string;
}
