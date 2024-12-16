import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { glob } from 'glob'; // تغییر در import
import { CountryInterface } from './interfaces/country.interface';
import { StateInterface } from './interfaces/state.interface';
import { CityInterface } from './interfaces/city.interface';
import { FileHelper } from 'src/common/helper';

@Injectable()
export class DataReader {
  constructor(private configService: ConfigService) {}

  private async getPath(dir: string) {
    const pattern = '/**/*';
    return await glob(dir + pattern, {
      mark: true,
      nodir: true,
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
