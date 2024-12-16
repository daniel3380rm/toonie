import { Injectable } from '@nestjs/common';
import { DataReader } from './dataReader';

@Injectable()
export class ZonesService {
  constructor(private dataReader: DataReader) {}

  async getCountries() {
    return await this.dataReader.getCountries();
  }

  async getStates(id: number) {
    return (await this.dataReader.getStates()).filter(
      (x) => x.countryId === id,
    );
  }

  async getCities(id: number) {
    return (await this.dataReader.getCities()).filter((x) => x.stateId === id);
  }

  async getCity(id: number) {
    const cityInterface = (await this.dataReader.getCities()).filter(
      (x) => x.id === id,
    )?.[0];
    const stateInterface = (await this.dataReader.getStates()).filter(
      (x) => x.id === cityInterface.stateId,
    )?.[0];
    const countryInterface = (await this.dataReader.getCountries()).filter(
      (x) => x.id === cityInterface.countryId,
    )?.[0];
    return {
      id: cityInterface.id,
      name: cityInterface.name,
      latitude: cityInterface.latitude,
      longitude: cityInterface.longitude,
      state: stateInterface,
      country: countryInterface,
    };
  }
}
