import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Glob } from 'glob';
import { CountryInterface } from './interfaces/country.interface';
import { StateInterface } from './interfaces/state.interface';
import { CityInterface } from './interfaces/city.interface';
import { FileHelper } from 'src/common/helper';

@Injectable()
export class DataReader {
  constructor(private configService: ConfigService) {}

  private getPath(dir: string) {
    const pattern = '/**/*';

    return new Promise((resolve, reject) => {
      const mg = new Glob(dir + pattern, { mark: true, sync: false }, function (
        er,
        matches,
      ) {
        resolve(matches);
      });
    });
  }

  async getCountries() {
    const pathList = await this.getPath('data/zone');
    const fileHelper = new FileHelper();
    return await fileHelper.csvReader<CountryInterface[]>(pathList[1]);
  }

  async getStates() {
    const pathList = await this.getPath('data/zone');
    const fileHelper = new FileHelper();
    return await fileHelper.csvReader<StateInterface[]>(pathList[2]);
  }

  async getCities() {
    const pathList = await this.getPath('data/zone');
    const fileHelper = new FileHelper();
    return await fileHelper.csvReader<CityInterface[]>(pathList[0]);
  }
}
