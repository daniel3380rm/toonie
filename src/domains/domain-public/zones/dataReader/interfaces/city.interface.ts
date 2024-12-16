import { BaseZoneInterface } from './base-zone.interface';

export interface CityInterface extends BaseZoneInterface {
  stateId: number;
  countryId: number;
}
